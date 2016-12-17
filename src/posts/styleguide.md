---
title: 記事作成のためのスタイルガイド
date: 2016/08/17 12:42:48
updated: 2016/12/18 00:54:06
author: yuhei
---
このブログの記事を作成するためのスタイルガイドを掲載します。

<!-- more -->

## 目次

- [画像の貼り付け](#画像の貼り付け)
  - [大きい画像](#大きい画像)
  - [左にはみ出した画像](#左にはみ出した画像)
  - [右にはみ出した画像](#右にはみ出した画像)
  - [中央寄せされた画像](#中央寄せされた画像)
  - [ウィンドウ幅いっぱいの画像](#ウィンドウ幅いっぱいの画像)
  - [スタイルが施されてない画像](#スタイルが施されてない画像)

## 画像の貼り付け

記事中に画像を貼り付ける場合、必要に応じていくつかのスタイルの中から好きなものを選んで利用することができます。

### 大きい画像

画像を大きく表示します。コンテンツ幅より小さい画像の場合、中央寄せして表示されます。

<figure class="large">![ニューヨークの高層ビル](/img/posts/styleguide/building.jpg)</figure>

```markdown
<figure class="large">![altに入る文字](/img/posts/post-slug-name/image-file-name.ext)</figure>
```

### 左にはみ出した画像

<figure class="drop-left">![野田レッド](/img/posts/styleguide/noda-red.jpg)</figure>

画像が左にはみ出して、その右には続くテキストが回りこむようになります。画像の幅は、最大でコンテンツ幅の半分まで縮小されます。

```markdown
<figure class="drop-left">![altに入る文字](/img/posts/post-slug-name/image-file-name.ext)</figure>
```

### 右にはみ出した画像

<figure class="drop-right">![野田イエロー](/img/posts/styleguide/noda-yellow.jpg)</figure>

左にはみ出した画像の逆です。

```markdown
<figure class="drop-right">![altに入る文字](/img/posts/post-slug-name/image-file-name.ext)</figure>
```

### 中央寄せされた画像

<figure class="centered">![野田レッド](/img/posts/styleguide/noda-red.jpg)</figure>

画像を中央寄せして表示します。横幅`720px`以下の画像にのみ使用してください。

```markdown
<figure class="centered">![altに入る文字](/img/posts/post-slug-name/image-file-name.ext)</figure>
```

### ウィンドウ幅いっぱいの画像

ウィンドウの幅いっぱいまで画像が引き伸ばして表示されます。画像が小さい場合は拡大されます。できるだけ横の比率が高い画像を利用してください。

<figure class="cover">![謎のかっこいい鳥](/img/posts/styleguide/bird.jpg)</figure>

```markdown
<figure class="cover">![altに入る文字](/img/posts/post-slug-name/image-file-name.ext)</figure>
```

### 普通の画像

上記に使いたいスタイルがない場合に利用してください。コンテンツ幅が画像の最大幅になります。

<figure>![なんかかっこいいビル](/img/posts/styleguide/building2.jpg)</figure>

```markdown
<figure>![altに入る文字](/img/posts/post-slug-name/image-file-name.ext)</figure>
```
