---
title: CSSでより良いハの字型の背景
date: 2016/08/24 12:47:19
updated: 2016/08/24 12:47:19
author: yuhei
---
前回の記事を公開したところ、いくつかのご意見をいただきました。  
それらを基に、より良い実装がないかを再考してみました。

<!-- more -->

---

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">スタッキングコンテキストを生成しないほうがみんな（誰）安心する気がするから、こうしてもいいと思う。<a href="https://t.co/xU0ZOxH1Lf">https://t.co/xU0ZOxH1Lf</a></p>&mdash; 〓〓〓 (@o_ti) <a href="https://twitter.com/o_ti/status/768036161671483392">2016年8月23日</a></blockquote>

この実装は、`linear-gradient`でグラデーションさせずに単色の斜めになったイメージを表現することで、前回の記事で紹介したものよりも圧倒的にシンプルなコードになっています。ですが、この実装だとジャギって見えてしまうのがイマイチです。

---

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">SVGでやれ</p>&mdash; ながしまきょう (@hail2u\_) <a href="https://twitter.com/hail2u_/status/768036499992350720">2016年8月23日</a></blockquote>

まさにこういうときのためにSVGですが、`background-image`として利用するためには外部ファイルにしなければならないので管理の手間が増えそう、**という勘違いをしていました。**  
どうやら、SVGはdataURIとしてCSSに埋め込んで利用できるようです。  
つまり、よりシンプルな実装で見た目もジャギらず、CSSだけで完結して管理することができるということが判明しました。

ということで実装しました。

```html
<div class="container">
  <div class="container__inner">
    <!-- do stuff... -->
  </div>
</div>
```

```scss
@mixin v-shaped-container-next($gap, $bg-color) {
  &::before,
  &::after {
    content: "";
    display: block;
    height: $gap;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  &::before {
    background-image: url('data:image/svg+xml,\
      <svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" preserveAspectRatio="none">\
        <path d="M0 1l1-1v1z" fill="#{$bg-color}"/>\
      </svg>');
  }

  &::after {
    background-image: url('data:image/svg+xml,\
      <svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" preserveAspectRatio="none">\
        <path d="M0 0l1-0v1z" fill="#{$bg-color}"/>\
      </svg>');
  }

  &__inner {
    padding: 1rem;
    background-color: $bg-color;
  }
}

.container {
  @include v-shaped-container-next(100px, rgba(#000,.6));

  color: #fff;
}
```

[これが動いているそれです。](/demos/v-shaped-container-next/v-shaped-container-next.html)

この度はみなさまのお力添えによって、最高の実装をこの手にすることができました。  
今後とも最高のCSSを書いていくため、引き続きよろしくお願い致します。
