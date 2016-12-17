---
title: browserifyで出力するファイルを分割する
date: 2016/07/08 09:49:30
updated: 2016/07/08 09:49:30
author: yuhei
---
browserifyは、ひとつのファイルに出力するという方法が最も使いやすく、基本的にはそれだけで事足ります。  
ですが、ファイルの巨大化などに際すると、読み込みのパフォーマンス上、ファイルの分割が必要になってくるケースがあります。

<!-- more -->

browserifyには、そのための方法が用意されていて、指定したモジュールをグローバルに`require`で読み込めるように出力することができます。

例えば、以下のようなファイルを、jQueryとそれ以外のコードのふたつに分割したいとします。

```javascript
var message = 'hello world';
module.exports = message;
```

```javascript
var $ = require('jquery');
var message = require('./message');
$(document.body).text(message);
```

この場合、jQueryはグローバルに`require`できるようにして、エントリーポイントである`main.js`にはjQueryを含めないようにファイル出力します。

```bash
$ browserify --require jquery > lib.js
$ browserify main.js --external jquery > app.js
```

そして、HTMLから以下のように読み込むことで利用できます。

```html
<script src="lib.js"></script>
<script src="app.js"></script>
```

頻繁にアプリケーションのコードが変更される場合、ライブラリとアプリケーションのコードを分割しておくと、ライブラリの読み込みにはキャッシュを活かせるので、ブラウザに読み込ませるリソースを減らすことができます。

## グローバル依存のライブラリの解決

jQueryプラグインやCreateJSなど、ブラウザだけを前提としたグローバル依存をしているライブラリはbrowserifyとは相性が悪いです。  
無理矢理browserifyで依存を解決する方法もあるのですが、素直にconcatしてscript要素で読み込むというのが無難です。

### babel-polyfill

babel-polyfillは、`require`した時点でグローバルを書き換えます。また、複数回読み込むとエラーが投げられます。  
そのため、concatして読み込むか、あるいは`babel-plugin-transform-runtime`を使うという手があります。

`babel-plugin-transform-runtime`は、グローバルに変更を加えず、ポリフィルが必要なコードだけが変換されます。そのため、ファイルが複数になった場合にポリフィルが多重に読み込まれることはありません。

[babel-polyfillとbabel-runtimeの使い分けに迷ったので調べた - Qiita](http://qiita.com/inuscript/items/d2a9d5d4daedaacff924)

## ネイティブでの解決

browserifyを始め、webpackやrollup.jsなどの依存性解決ツールは、node.jsにあるようなモジュールシステムを擬似的に表現しているだけで、あくまで妥協的な解決策に過ぎません。  
JavaScriptの新しい仕様であるes2015には、ブラウザネイティブでモジュールシステムが利用できるes modulesが定義されています。  
ただ、実装するために十分な仕様はまだ決まり切っていなくて、主要なブラウザで実用段階になるのはかなり先の話になるでしょう。ですが、実際にこれが利用できるようになると、これらのツールは不要となって、モジュールシステムを利用するための複雑さが取り除かれ、より正しくファイルが分割できるようになるはずです。  
未来を信じて期待しましょう。
