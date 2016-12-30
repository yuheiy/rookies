# [ライデンの新人ブログ](https://ryden-inc.github.io/rookies/)

## Setup

```bash
yarn
```

or

```bash
npm i
```

## Development

```bash
npm start
```

## Deploy

`master`ブランチにpushすることで自動的にサーバーへデプロイされます。

## New post

以下のフォーマットで新規ファイルを作成します。

`src/posts/post-title-like-this.md`

```markdown
---
title: 記事タイトル
date: 2016/01/01 00:00:00
updated: 2016/01/01 00:00:00
author: yuhei
---
導入の文を書きます。

ここに書いたテキストは記事一覧ページに表示され、descriptionにも利用されます。

<!-- more -->

続きの文を書きます。

ここに書いたテキストは個別記事ページにしか表示されません。
```

`author`には、`author.json`に設定されている著者のキーが入ります。

`date`及び`updated`に入るデータは、以下のブックマークレットで生成できます。

```js
javascript:{let zero = n => `0${n}`.slice(-2);let date = new Date();let year = date.getFullYear();let month = zero(date.getMonth() + 1);let day = zero(date.getDate());let hours = zero(date.getHours());let minutes = zero(date.getMinutes());let seconds = zero(date.getSeconds());alert(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}`);}
```

### Original rules

記事中の画像とリンクのパスは、`/`から始まる場合はプリフィックスとしてプロジェクトのサブディレクトリへのパスが追加されます。

画像や別の記事へのリンクを貼りたい場合、以下のようにしてください。

```markdown
![altに入る文字](/img/posts/post-slug-name/image-file-name.ext)

[RYDENの新人がブログを始めました](/posts/hello-world.html)
```

### Use images

記事中に利用する画像は、`src/img/posts/:post-slug-name`以下のディレクトリに配置してください。

画像が表示されるスタイルについては、以下の記事を参考にしてください。

[記事作成のためのスタイルガイド](https://ryden-inc.github.io/rookies/posts/styleguide.html)

## New author

`authors.json`を編集することで記事の著者を追加できます。

有効なキーは以下の通りです。

| キー | 意味 | 必須 |
|-------------|-------------|------|
| `name` | 名前 | * |
| `title` | 職種 | * |
| `description` | 紹介文 | * |
| `image` | `src/img`からアバター画像への相対パス | * |
| `twitter` | TwitterのID |  |
