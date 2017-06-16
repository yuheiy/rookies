---
title: WebPの自動生成とフォールバック
author: yuhei
---

WebPはGoogleが開発した画像の圧縮形式で、これを利用することで従来よりファイルサイズを削減することが出来ます。  
ですが現状では、WebPとして画像を書き出せるソフトフェアは少なく、対応するブラウザも一部なので、その取り扱いが少し面倒です。  
PNGやJPEGからWebPを自動生成し、未対応のブラウザにはフォールバックする方法も併せて紹介します。

<!-- more -->

---

WebPへの変換は、Gulpプラグインの[`gulp-webp`](https://github.com/sindresorhus/gulp-webp)を利用します。  
画像の圧縮もGulpで行うことが多いと思うので、以下のようなタスクを作成します。

```javascript
'use strict';

var gulp = require('gulp');
var webp = require('gulp-webp');
var imagemin = require('gulp-imagemin');

gulp.task('webp', function () {
  return gulp.src('src/img/**/*.{png,jpg}')
    .pipe(webp())
    .pipe(gulp.dest('dist/img'))
});

gulp.task('imagemin', function () {
  return gulp.src('src/img/**/*.{png,jpg,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
});
```

これで画像をWebPに変換しつつ、フォールバック時に表示される画像も圧縮するようにできました。次は、WebPを利用できない環境では別の画像を表示する方法です。

---

画像を表示する場合は、HTMLの`<img>`要素として利用するか、CSSの`background-image`に指定して利用することが多いと思います。  
`<img>`要素として利用する場合は`<picture>`要素を利用することで、対応ブラウザはWebPをリクエストするようになります。

```html
<picture>
  <source type="image/webp" srcset="sample.webp">
  <img src="sample.png" alt="sample image">
</picture>
```

これについてはこちらを参考にさせていただきました。  
[画像最適化戦略 WebP 編 | blog.jxck.io](https://blog.jxck.io/entries/2016-03-26/webp.html)

---

CSSの`background-image`から画像を利用する場合は、CSS側で対応しているかを判断する方法が無いので、[Modernizr](https://modernizr.com/)を用いてWebPが利用できるかを検出します。

Modernizrは全部入りではファイルサイズが無駄に大きいので、カスタムビルドでWebPが対応しているかだけを検出するようにします。Webページ上でもカスタムビルドはできますが、条件が変わったりバージョンアップのたびに行うのが手間なので、それもgulpのタスクに組み込んで行います。

```javascript
'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var gulp = require('gulp');
var modernizr = require('modernizr');

gulp.task('modernizr', function (done) {
  modernizr.build({
    'feature-detects': ['img/webp'],
    minify: true
  }, function (result) {
    mkdirp.sync('dist/js');
    fs.writeFileSync('dist/js/modernizr-custom.js', result);
    done();
  });
});
```

Modernizrは、`<head>`要素の中で同期的（`async`属性などを利用せず）に読み込みます。  
非同期で読み込むと、WebPが利用できるかを検出する前に画像をロードしてしまい、無駄に通信量を増やしてしまいます。Modernizrを実行するまではdocumentのロードをブロッキングします。

```html
<head>
  <!-- do stuff -->
  <script src="/js/modernizr-custom.js"></script>
</head>
```

ModernizrでWebPが利用できると判定されると、`<html>`要素に`webp`というクラスが追加されます。  
これを用いて、`webp`というクラスがある場合はWebPの画像を利用し、そうでない場合はフォールバックの画像を表示するために、CSSはこのようにして書けます。

```css
.sample {
  background-image: url("/img/sample.png");
}

.webp .sample {
  background-image: url("/img/sample.webp");
}
```

---

新しいものを利用するためにはさまざまな手間がかかることもありますが、そのコストに見合うだけの効果があるものに関しては積極的に採用していきたいと思います。
