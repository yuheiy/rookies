---
title: CSSでハの字型の背景を作る
date: 2016/08/24 12:33:04
updated: 2016/08/24 12:33:04
author: yuhei
---
背景が傾いて、斜めのラインが入ったようなページは少し前からよく見かけます。  
最近それに似た、背景をハの字型にしたいという要件があったのでやってみました。  
なんとなく簡単にできそうな雰囲気はありますが、思いつくまで意外と時間がかかってしまいました。

<!-- more -->

**後日追記**  
**これの改良版の記事を書きました。**  
**[CSSでより良いハの字型の背景](/posts/v-shaped-container-next.html)**

まず、よくある背景が傾いただけのものは割と簡単にできます。

```css
.skewed-container {
  position: relative;
}

.skewed-container::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  transform: skewY(3deg);
  background-color: #ccc;
}
```

ターゲットの要素の擬似要素として背景として表示させるものを作り、`transform`で傾かせています。

<figure class="large">![](/img/posts/v-shaped-container/skew.png)</figure>

ただ、このままでは部分的に中の要素がはみ出してしまいます。  
なので、三角関数で適当に計算します。

```stylus
skewed-container(deg, bg-color)
  width-full = 100vw
  width-half = width-full / 2
  tan = tan(abs(deg))
  gap = width-full * tan
  gap-half = width-half * tan

  position relative
  padding-top gap
  padding-bottom gap

  &::before
    content ""
    position absolute
    top gap-half
    right 0
    bottom gap-half
    left 0
    z-index -1
    transform skewY(deg)
    background-color bg-color

.container
  skewed-container(3deg, black)

  color white

  :first-child
    margin-top 0

  :last-child
    margin-bottom 0
```

Sassでも三角関数は使えなくもないですが、[Stylusならビルトイン関数として備わっている](http://stylus-lang.com/docs/bifs.html)のでそれを利用しました。

[こんな感じの表示になります。](/demos/v-shaped-container/skewed-container.html)

---

そして、これと同じようなノリでハの字型の背景を実現できないかといろいろ試行錯誤しました。最終的にものになったアイデアは、**背景の上下にCSSで作った三角形を半分見せる** という方法です。

<figure class="drop-left">![](/img/posts/v-shaped-container/triangle.png)</figure>

[CSSの`border`を使って三角形を描画する](https://css-tricks.com/snippets/css/css-triangle/)テクニックがありますが、それを利用して左向き（あるいは右向き）の三角形を作り、垂直方向に二等分すると、まさに斜めに傾いた背景のパーツとして利用できます。

それによって描画した三角形をコンテンツの上下に組み合わせると、やりたかったハの字型の背景を作ることができるというわけです。

実装としては以下のような感じです。

```stylus
v-shaped-container(gap, bg-color)
  width-full = 100vw

  triangle(h, c)
    position absolute
    z-index -1
    width 0
    height 0
    border-style solid
    border-width h width-full h 0
    border-color transparent c transparent transparent

  position relative
  padding-top gap
  padding-bottom gap

  &::before
    triangle(gap, bg-color)

    content ""
    top 0

  &::after
    triangle(gap, bg-color)

    content ""
    bottom 0

  &__inner
    background-color bg-color

.container
  v-shaped-container(100px, black)

  color white
```

```html
<div class="container">
  <div class="container__inner">
    <!-- do stuff... -->
  </div>
</div>
```

[実際にはこのように表示されます。](/demos/v-shaped-container/v-shaped-container.html)

---

さてこれでハの字型の背景を実現できたわけですが、それに加えて背景を半透明にしたいという要望がありました。  
背景をこのまま半透明にすると、三角形とインナーのコンテンツの背景が重なって表示されてしまい、意図した通りになりません。

<figure class="large">![](/img/posts/v-shaped-container/overlap.png)</figure>

これを解決させるために、三角形の重なっている部分を`overflow: hidden`で隠します。  
よって以下のようになります。

```stylus
v-shaped-container(gap, bg-color)
  width-full = 100vw

  triangle(h, c)
    position absolute
    width 100%
    height h
    overflow hidden

    &::before
      content ""
      position absolute
      width 0
      height 0
      border-style solid
      border-width h width-full h 0
      border-color transparent c transparent transparent

  triangle-top(h, c)
    triangle(h, c)

    top 0

    &::before
      top 0

  triangle-bottom(h, c)
    triangle(h, c)

    bottom 0

    &::before
      bottom 0

  position relative
  padding-top gap
  padding-bottom gap

  &__top
    triangle-top(gap, color)

  &__inner
    padding 1rem
    background-color color

  &__bottom
    triangle-bottom(gap, color)

.container
  v-shaped-container(rgba(red,.8), 100px)
```

```html
<div class="container">
  <div class="container__top"></div>
  <div class="container__inner">
    <!-- do stuff... -->
  </div>
  <div class="container__bottom"></div>
</div>
```

これを利用すると、[それぞれの背景を重ね合わせた上で、その後ろの背景も見せるというような演出（デモ）](/demos/v-shaped-container/v-shaped-opacity-container.html)もできるようになります。

ただ、こちらの方が無駄な`div`要素が増えてしまうので、半透明にする必要がなければ前の方法を利用した方が良さそうです。

ちなみに個人的には、`div`要素一つで実装できる最初のやつが一番好きです。

---

他に以下の記事のようなやり方もありましたが、今回の要件とマッチしなかったので利用しませんでした。

[Slopy Elements with CSS3](http://tympanus.net/codrops/2011/12/21/slopy-elements-with-css3/)
