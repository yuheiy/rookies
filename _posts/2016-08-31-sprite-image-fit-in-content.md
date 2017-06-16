---
title: スプライトアニメーションをコンテンツの背景にフィットさせる
author: yuhei
image: sprite-image-fit-in-content/background-position.png
---

CSSでスプライトアニメーションをコンテンツの背景にフィットさせる方法です。

<!-- more -->

縦一列にコマが5つ分並べられたスプライト画像を想定して、それを[コンテンツの背景いっぱいに表示]({{ site.baseurl }}/demos/sprite-image-fit-in-content/)させるCSSです。

```html
<body>
  <div class="sprite-container"></div>
</body>
```

```scss
$frame-count: 5;
$seconds-per-frame: 1;

.sprite-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-image: url("sprite.png");
  background-repeat: no-repeat;
  background-size: 100% $frame-count * 100%;
  animation: sprite #{$frame-count * $seconds-per-frame}s steps($frame-count) infinite;
}

@keyframes sprite {
  from {
    background-position: left top;
  }
  to {
    background-position: left 100% * $frame-count / ($frame-count - 1);
  }
}
```

`background-size`で、スプライト画像のうち一コマで要素のサイズいっぱいになるように指定します。

アニメーションをJavaScriptで制御する場合は、

```javascript
let frameCount = 5;
let currentFrame = 3; // 0 から 4 の間
el.style.backgroundPosition = `${100 * currentFrame / frameCount - 1}%`;
```

みたいな感じにすれば良いですが、CSS Animationの`steps`でやる場合は若干注意点がありました。

<figure class="drop-left">
  <img src="{{ site.baseurl }}/assets/images/post/sprite-image-fit-in-content/background-position.png" alt="">
</figure>

`background-position`の値を`100%`に設定すると、はみ出さずに、左の図で言うと紫のブロックがぴったりに表示されるようになります。

`animation-timing-function`に指定する`steps`関数には第二引数があり、デフォルト値は`end`です。[詳しくはMDNを見てください。](https://developer.mozilla.org/ja/docs/Web/CSS/timing-function)

`steps`関数の第二引数が`end`になっていると、キーフレームの100%までは実行されません。

上記の例のように`steps(5)`となっていると、キーフレームの`0%`、`20%`、`40%`、`60%`、`80%`の状態だけが実行されます。

そのため、`80%`の状態で最後のコマを表示するために、キーフレームの完了時の状態として6コマ目の位置にあたる`background-position`を指定します。

計算方法は、左の図と上記のコードを見ていただいた通りです。

こうして今日も平和にCSSを書くことができました。ありがとうございました。
