---
title: Node.jsの相対パス辛い問題を解決する
author: yuhei
---

Node.jsで深い階層のファイルから別のファイルを参照するとき、相対パスで記述しなければならないのが辛くなる事がよくあります。  

```bash
├── foo/
│   └── bar/
│       └── baz/
│           └── module.js
├── lib/
│   └── util.js
├── node_modules/
└── package.json
```

例えば、上記のような構成のプロジェクトの場合、`foo/bar/baz/module.js`から`lib/util.js`を参照したいときは、

```javascript
require('../../../lib/util');
```

のような記述をしなければなりません。  
これを、以下のように書けるようにします。

```javascript
require('lib/util');
```

<!-- more -->

`node_modules/`以下に参照したいディレクトリへのシンボリックリンクを作成することで、上記のように参照することができます。

手順としては、まずシンボリックリンクをgitに含めるようにしたいので、`.gitignore`の中身を編集します。

```
node_modules/
```

この状態だと、`node_modules/`以下のファイル全てが無視されるので、代わりに次のように記述します。

```
node_modules/*
!node_modules/lib
```

次にシンボリックリンクを作成します。  
カレントディレクトリが`node_modules/`でないと意図したようにパスが通らないので以下のようにします。

```bash
$ cd node_modules/
$ ln -s ../lib lib
```

これで`require('lib/utils')`のようにファイルを参照することができます。

Node.jsの相対パスの問題については、[さまざまな議論がされている](https://gist.github.com/branneman/8048520)のですが、これが一番シンプルに解決できる方法だと思います。
