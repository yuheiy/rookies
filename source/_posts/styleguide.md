---
title: 記事作成のためのスタイルガイド
date: 2016/08/17 09:49:23
updated: 2016/08/17 09:49:23
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

<figure class="large">{% asset_img building.jpg ニューヨークの高層ビル %}</figure>

```html
<figure class="large">{% asset_img image-file-name.ext alt text %}</figure>
```

### 左にはみ出した画像

<figure class="drop-left">{% asset_img noda-red.jpg 野田レッド %}</figure>

ウィンドウ幅が大きい（`960px`以上）場合、画像が左にはみ出して、その右には続くテキストが回りこむようになります。  
画像のサイズは、最大`480px`、最小`160px`まで伸縮されます。

ウィンドウ幅が小さい場合、画像ははみ出さず、続くテキストが回りこむだけになります。  
またその場合、画像の最大幅はコンテンツ幅の半分になります。

<div style="clear: both;"></div>

```html
<figure class="drop-left">{% asset_img image-file-name.ext alt text %}</figure>
```

### 右にはみ出した画像

<figure class="drop-right">{% asset_img noda-yellow.jpg 野田イエロー %}</figure>

左にはみ出した画像の逆です。

<div style="clear: both;"></div>

```html
<figure class="drop-right">{% asset_img image-file-name.ext alt text %}</figure>
```

### ウィンドウ幅いっぱいの画像

ウィンドウの幅いっぱいまで画像が引き伸ばして表示されます。  
画像が小さい場合は拡大されます。

できるだけ横の比率が高い画像を利用してください。

<figure class="cover">{% asset_img bird.jpg 謎のかっこいい鳥 %}</figure>

```html
<figure class="cover">{% asset_img image-file-name.ext alt text %}</figure>
```

### スタイルが施されてない画像

特別なスタイルが施されてない画像です。  
コンテンツ幅が画像の最大幅になります。

<figure>{% asset_img building2.jpg なんかかっこいいビル %}</figure>
