---
title: 記事作成のためのスタイルガイド
date: 2016/08/17 12:42:48
updated: 2016/08/17 12:42:48
author: yuhei
---
このブログの記事を作成するためのスタイルガイドを掲載します。

<!-- more -->

## 目次

- [画像の貼り付け](#画像の貼り付け)
  - [大きい画像](#大きい画像)
  - [左にはみ出した画像](#左にはみ出した画像)
  - [右にはみ出した画像](#右にはみ出した画像)
  - [ウィンドウ幅いっぱいの画像](#ウィンドウ幅いっぱいの画像)
  - [スタイルが施されてない画像](#スタイルが施されてない画像)

## 画像の貼り付け

記事中に画像を貼り付ける場合、必要に応じていくつかのスタイルの中から好きなものを選んで利用することができます。

### 大きい画像

画像を大きく表示します。  
小さい画像の場合、引き伸ばして表示されます。

<figure class="large">{% img /images/post/styleguide/building.jpg ニューヨークの高層ビル %}</figure>

```html
<figure class="large">{% img /images/post/post-slug-name/image-file-name.ext altに入る文字 %}</figure>
```

### 左にはみ出した画像

<figure class="drop-left">{% img /images/post/styleguide/noda-red.jpg 野田レッド %}</figure>

ウィンドウ幅が大きい（`960px`以上）場合、画像が左にはみ出して、その右には続くテキストが回りこむようになります。  
画像のサイズは、最大`480px`、最小`160px`まで伸縮されます。

ウィンドウ幅が小さい場合、画像ははみ出さず、続くテキストが回りこむだけになります。  
またその場合、画像の最大幅はコンテンツ幅の半分になります。

<div style="clear: both;"></div>

```html
<figure class="drop-left">{% img /images/post/post-slug-name/image-file-name.ext altに入る文字 %}</figure>
```

### 右にはみ出した画像

<figure class="drop-right">{% img /images/post/styleguide/noda-yellow.jpg 野田イエロー %}</figure>

左にはみ出した画像の逆です。

<div style="clear: both;"></div>

```html
<figure class="drop-right">{% img /images/post/post-slug-name/image-file-name.ext altに入る文字 %}</figure>
```

### ウィンドウ幅いっぱいの画像

ウィンドウの幅いっぱいまで画像が引き伸ばして表示されます。  
画像が小さい場合は拡大されます。

できるだけ横の比率が高い画像を利用してください。

<figure class="cover">{% img /images/post/styleguide/bird.jpg 謎のかっこいい鳥 %}</figure>

```html
<figure class="cover">{% img /images/post/post-slug-name/image-file-name.ext altに入る文字 %}</figure>
```

### スタイルが施されてない画像

特別なスタイルが施されてない画像です。  
コンテンツ幅が画像の最大幅になります。

<figure>{% img /images/post/styleguide/building2.jpg なんかかっこいいビル %}</figure>

```html
<figure>{% img /images/post/post-slug-name/image-file-name.ext altに入る文字 %}</figure>
```
