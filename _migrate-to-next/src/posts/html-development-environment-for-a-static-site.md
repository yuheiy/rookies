---
title: 静的サイト制作のための便利なHTML開発環境の作り方
date: 2016/11/08 17:46:37
updated: 2016/11/08 17:51:37
author: yuhei
---
バックエンドの環境を用いない、静的なHTMLだけのサイトを構築する機会がよくあります。ローカルだけでHTMLを生成する方法はいろいろあると思いますが、個人的にベストプラクティスだと考えているパターンをご紹介します。

<!-- more -->

## テンプレートエンジンを直接利用する

まず、Jekyllなどの静的サイトジェネレーターやフレームワークは利用しません。用意されたレールから外れた使い方をしようとすると余計に手間がかかり、それらを利用しない場合より複雑になってしまうからです。

そのため、直接テンプレートエンジンを利用するか、タスクランナーなどを介して利用します。個人的には[gulp-pug](https://github.com/pugjs/gulp-pug)を使っています。

## extendは利用しない

テンプレートエンジンにextendの機能があるものがありますが、これは利用しません。extendを利用することでテンプレートが複雑化することがあるからです。

それぞれのページ（URL）に対応するファイルは、全て以下の例のようにして作成します。

```
doctype html
html(lang= lang)
  include partial/head

  body
    include partial/global-header

    h1 home
    p= description

    include partial/scripts
    script.
      window.App.run('home')
```

インラインスクリプトの記述に関してはこちらを参照してください。  
[ページごとにJSの処理を分割するためのよさそうな方法](/rookies/posts/page-dispatcher.html)

## テンプレート側に必要なユーティリティーやデータを提供する

静的サイトジェネレーターなどの仕組みは時に大げさですが、いくつかのデータやユーティリティー関数は場合に応じて提供されていると便利です。

### パスの解決

テンプレート側から、自分自身のファイルがデプロイされたときのパスを利用したいことがよくあります。`src/about.pug`をサーバーに配置したときは`/subdir/about.html`になり、それに応じて`canonical`の値を設定するようなときのケースです。また、ナビゲーションの現在参照しているページをアクティブにするなどの場合にも言えます。

都度ハードコーディングすると人的ミスが起こる場合もあり、変更が必要なときに対応が大変です。そのため、それぞれのページに対応するテンプレートに、ソースディレクトリからの相対パスを基にしてデプロイ時のパスを生成して渡します。`/index.html`は`/`となって欲しいので、`index.html`は省略した状態にします。

また、ユーティリティーとして、サイトが配置されるディレクトリからの相対パスをルートパスに変換するための関数を提供します。これは、サイトがドメインのルートディレクトリに配置される場合には無くても問題ありません。

コードとしてはこういうイメージです。

```javascript
const pagePathFromBaseDir = '/' + path.relative('src/html', file.path)
  .replace(/\.pug$/, '.html')
  .replace(/\/?index\.html$/, '')
const buildPagePath = pagePath => path.join('/', baseURL, pagePath)

const locals = {
  currentPath: pagePathFromBaseDir,
  urlFor: buildPagePath,
}
```

### テンプレートに必要なデータ

サイト全体やあるいは一部のページだけで利用したいデータは、JSONとしてテンプレートと同じディレクトリに配置しておきます。

すべてのテンプレートで利用したいデータは、ソースディレクトリ直下に`metadata.json`として配置します。また、単一のページだけで利用したいデータは、テンプレートファイルと同じディレクトリ内に、同じファイル名で拡張子だけ`.json`に変更して配置します。

テンプレート内にデータを定義したければfrontMatterを利用するという手もありますが、個人的にはJSONとYAMLが混ざるのが気になるのでやってません。Pugなら`- var v = 'value';`などのように記述して利用できますが、可読性が良くないのでこれもやってません。

## ディレクトリ構成

```
.
└── src/
    └── html/
        ├── about.json
        ├── about.pug
        ├── index.json
        ├── index.pug
        ├── metadata.json
        └── partial/
            ├── global-header.pug
            ├── head.pug
            └── scripts.pug
```

テンプレートファイルは`src/`ディレクトリの中に`html/`というディレクトリを作成してそこに配置します。ソースディレクトリ直下にテンプレートを配置している構成をよく見ますが、何らかのディレクトリの中にファイルを配置したほうが、ファイル数が増加してきた際に明確に理解しやすいです。

`src/html/partial`には、includeされるためだけのファイルを配置します。このディレクトリ以下のファイルは単一ページとしてはコンパイルしません。それ以外のファイルはディレクトリの階層を維持しつつ、単一のページとしてコンパイルされます。

ちなみに個人的には他に、`src/{html,css,js,img,static}`という風にディレクトリを分けています。

## タスクの例

以上の構成を取り入れたタスクの例が、以下のようになります。

```javascript
const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const pug = require('gulp-pug')
const data = require('gulp-data')

const baseURL = 'path/to/project'

gulp.task('html', () =>
  gulp.src([
    'src/html/**/*.pug',
    '!src/html/partial/**/*'
  ])
    .pipe(data(file => {
      const metaData = JSON.parse(fs.readFileSync('src/html/metadata.json', 'utf8'))
      const pageDataPath = file.path.replace(/\.pug$/, '.json')
      const pageData = fs.existsSync(pageDataPath) ? JSON.parse(fs.readFileSync(pageDataPath)) : null
      const pagePathFromBaseDir = '/' + path.relative('src/html', file.path)
        .replace(/\.pug$/, '.html')
        .replace(/\/?index\.html$/, '')
      const buildPagePath = pagePath => path.join('/', baseURL, pagePath)

      return {
        ...metaData,
        ...pageData,
        currentPath: pagePathFromBaseDir,
        urlFor: buildPagePath
      }
    }))
    .pipe(pug())
    .pipe(gulp.dest('dist'))
)
```

## まとめ

必要最低限のルールを定めてシンプルに開発できるようにすれば、ストレス無くミスも少なくなると思います。特に複数人が関わるプロジェクトにおいては、さまざまなルールが乱立して開発しづらくなることも多いため、普段から開発しやすい環境づくりを意識しておくことが大切だと言えます。

ちなみに、以上の構成に加え、[静的サイト構築のために必要な構成を含めたボイラープレートをこちらで公開](https://github.com/yuheiy/real-world-website-boilerplate)しています。

---

今回のこの構成のため、主に以下のプロジェクトを参考にさせていただきました。

- [hail2u/hail2u.net](https://github.com/hail2u/hail2u.net)  
- [vigetlabs/gulp-starter](https://github.com/vigetlabs/gulp-starter)  
- [kriasoft/static-site-starter](https://github.com/kriasoft/static-site-starter)
- [Hexo](https://hexo.io/)
