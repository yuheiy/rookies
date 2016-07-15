---
title: JavaScriptからメディアクエリを利用する
date: 2016/07/11 09:04:22
update: 2016/07/11 09:04:22
author: yuhei
---
CSSでレスポンシブデザインの実装などに利用されるメディアクエリは、JavaScriptからも利用することができます。

<!-- more -->

`window.matchMedia`を実行すると`MediaQueryList`オブジェクトが作成されます。
それを利用してクエリにマッチしているかの判定、またその評価結果の変化を通知することができます。

以下のようにして利用します。

```javascript
var mql = window.matchMedia('(min-width: 30rem)');

if (mql.matches) {
  // 30remより大きい
} else {
  // 30rem以下
}
```

また、以下のようにしてクエリの評価結果の変化を監視することができます。

```javascript
var mql = window.matchMedia('(orientation: portrait)');

mql.addListener(function (mql) {
  // 画面の向きが変わった・ウィンドウの長辺が変わった

  if (mql.matches) {
    // ウィンドウサイズが縦長
  } else {
    // ウィンドウサイズが横長
  }
});
```

[これを利用した簡単な実装例がこちらです。](/rookies/demos/use-media-queries-from-javascript.html)

CSSのメディアクエリの評価結果の変化に合わせて処理を実行するとき、これまでは`resize`イベントを監視したり、ブレイクポイントを`px`以外で設定しているとJavaScriptで毎回計算したりというような面倒なことをやっていました。
このAPIを利用することでそれらの処理が簡潔に行えます。

ただ、単一のメディアクエリの評価結果に応じて処理を実行することは楽にできても、例えば以下のように複数のメディアクエリに応じて処理を振り分けるのは大変そうです。

```css
:root {
  font-size: 100%;
}

@media (min-width: 30rem) {
  :root {
    font-size: 150%;
  }
}

@media (min-width: 45rem) {
  :root {
    font-size: 200%;
  }
}
```

`MediaQueryList`の通知を監視するというやり方では難しそうで、やるとしたら`resize`イベントで`MediaQueryList`の評価をポーリングするという感じでしょうか。
メディアクエリがもっと増えてくるとその分管理が大変になっていくので、このAPIの利用は、単一のメディアクエリを利用する場合だけに止めた方がよさそうです。

参考
[スクリプトからのメディアクエリの使用 - Web developer guide | MDN](https://developer.mozilla.org/ja/docs/Web/Guide/CSS/Testing_media_queries)
