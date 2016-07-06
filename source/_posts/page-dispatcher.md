---
title: ページごとにJSの処理を分割するためのよさそうな方法
date: 2016/07/06 09:31:22
updated: 2016/07/06 09:31:22
author: yuhei
---
ページごとに実行する処理はバラバラだけど、制作上の都合でJSファイルはひとつにまとめたいということがあります。

<!-- more -->

そういう場合、ページの読み込み時にURLに応じて実行する処理を切り分けられればいいと思って、そのためのモジュールを書いたことがあります。  
[普通のウェブサイトのためのJSボイラープレートを作った](http://yuheiy.hatenablog.com/entry/2016/03/26/092157)

ですが、実際のニーズはそれと違っていて、本当に必要なのは、URLでなくHTMLファイルごとに実行する処理を分けられる仕組みでした。  
というのは、ページの場所が変更されたり、URLが複数存在する場合（ `/index.html` と `/` など）でも動くように、URLに依存しないようにしたいからです。  
また、HTML側から実行する処理を知りたいというのもあります。

そしてこういう場合、`body` 要素にクラス名を割り振って処理を分けるというのがよくあるパターンなようです。

```html
<body class="home">
  <!-- do stuff... -->
</body>
```

```javascript
if ($('body').hasClass('home')) {
  // do stuff...
}
```

ただ、これはあまりよくないやり方だと感じます。  
理由は、他人が見て何のために付与されているクラスなのかが判断しにくいこと、そしてCSSのセレクタとして利用されてスタイルの収集がつかなくなる可能性があることです。

では、どうするべきかと僕が考えたのは、JSファイルの中でディスパッチャに処理を登録して、HTMLから必要なものを実行するという方法です。

```javascript
var dispatcher = new Dispacher();

dispatcher.route('common', function () {
  // run on all pages
});

dispatcher.route('home', function () {
  // run only on home
});

window.run = dispatcher.run.bind(dispatcher);
```

```html
<body>
  <h1>home</h1>

  <!-- do stuff... -->

  <script src="app.js"></script>
  <script>
    run('common'); // 全ページの共通処理を実行
    run('home'); // Homeだけで必要な処理を実行
  </script>
</body>
```

この方法を利用すると、他人が見てもHTML側からなんらかの処理を呼び出しているのがはっきり理解できます。  
そしてそれに加えて、引数にパラメータを与えることができます。

パラメータを与えられると何が便利かというと、テンプレートエンジンで同じパターンのページを量産するときなどに、HTML側からデータを渡すことができれば、データをJSに含めたり、DOMからデータを読み取る必要がなくなるからです。

このディスパッチャーはGitHubに公開して、npmにも公開しています。

```
$ npm install @yuheiy/page-dispatcher
```

[yuheiy/page-dispatcher](https://github.com/yuheiy/page-dispatcher)

実装は実質10行程度で、簡単なことしかしていませんが、コンセプトが伝わればと思います。

ちなみに、bundleしてminifyしたJSが1MBを超えるような大きさになってきたら、読み込みやビルドの速度の問題があるので、諦めてファイルを分割するスタイル切り替えていくのが無難だと思います。
