---
title: 記事作成のためのスタイルガイド
author: yuhei
---

このブログの記事を作成するためのスタイルガイドを掲載します。

<!-- more -->

## 目次

- [リンク](#リンク)
  - [別の記事へのリンク](#別の記事へのリンク)
  - [同じサブドメイン以下のページへのリンク](#同じサブドメイン以下のページへのリンク)
- [見出し](#見出し)
- [画像の貼り付け](#画像の貼り付け)
  - [大きい画像](#大きい画像)
  - [左にはみ出した画像](#左にはみ出した画像)
  - [右にはみ出した画像](#右にはみ出した画像)
  - [中央寄せされた画像](#中央寄せされた画像)

## リンク

### 別の記事へのリンク

[RYDENの新人がブログを始めました]({{ site.baseurl }}{% post_url 2016-06-24-hello-world %})

```markdown
{% raw %}[RYDENの新人がブログを始めました]({{ site.baseurl }}{% post_url 2016-06-24-hello-world %}){% endraw %}
```

### 同じサブドメイン以下のページへのリンク

[OGP画像]({{ site.baseurl }}/assets/images/ogp.png)

```markdown
{% raw %}[OGP画像]({{ site.baseurl }}/assets/images/ogp.png){% endraw %}
```

詳しい仕様に関しては[Jekyllのドキュメント](https://jekyllrb.com/docs/templates/)を参照してください。

## 見出し

必要に応じて見出しを利用してください。  
記事タイトルが見出しレベル1になっており、記事中ではレベル2以降の見出しを適切に利用できます。スタイルはレベル4までしか設定されていません。

## 見出し２

```markdown
## 見出し２
```

### 見出し３

```markdown
## 見出し３
```

#### 見出し４

```markdown
## 見出し４
```

## 画像の貼り付け

記事中に画像を利用する場合、次のフォーマットから適切なパターンを選択してください。

### 大きい画像

<figure class="large">
  <img src="{{ site.baseurl }}/assets/images/post/styleguide/building.jpg" alt="ニューヨークの高層ビル">
  <figcaption>コンテンツ幅より小さい画像の場合</figcaption>
</figure>

画像を少し大きく表示します。コンテンツ幅より小さい画像の場合は、拡大して表示されます。キャプションの利用は任意です。

```markdown
{% raw %}<figure class="large">
  <img src="{{ site.baseurl }}/assets/images/post/post-slug-name/image-file-name.ext" alt="代替テキスト">
  <figcaption>補足情報</figcaption>
</figure>{% endraw %}
```

### 左にはみ出した画像

<figure class="drop-left">
  <img src="{{ site.baseurl }}/assets/images/post/styleguide/noda-red.jpg" alt="野田レッド">
</figure>

画像が左にはみ出して、その右には続くテキストが回りこむようになります。画像の幅は、最大でコンテンツ幅の半分です。それ以上大きい場合は縮小されます。

```markdown
{% raw %}<figure class="drop-left">
  <img src="{{ site.baseurl }}/assets/images/post/post-slug-name/image-file-name.ext" alt="代替テキスト">
</figure>{% endraw %}
```

### 右にはみ出した画像

<figure class="drop-right">
  <img src="{{ site.baseurl }}/assets/images/post/styleguide/noda-yellow.jpg" alt="野田イエロー">
</figure>

左にはみ出した画像の逆です。

```markdown
{% raw %}<figure class="drop-right">
  <img src="{{ site.baseurl }}/assets/images/post/post-slug-name/image-file-name.ext" alt="代替テキスト">
</figure>{% endraw %}
```

### 中央寄せされた画像

<figure class="centered">
  <img src="{{ site.baseurl }}/assets/images/post/styleguide/noda-red.jpg" alt="野田レッド">
</figure>

画像を中央寄せして表示します。

```markdown
{% raw %}<figure class="centered">
  <img src="{{ site.baseurl }}/assets/images/post/post-slug-name/image-file-name.ext" alt="代替テキスト">
</figure>{% endraw %}
```
