# [Ryden blog](https://ryden-inc.github.io/rookies/)

俺たちで最高の社会人になろうな！

## 運用ガイドライン

ブラウザで記事を更新する場合、以下の手順に従うとスムーズです。

### 新規記事投稿

1. ディレクトリを `rookies/source/_posts/` まで移動する。
1. `Create new file` をクリック。
1. ファイル名を `article-title-like-this.md` のフォーマットで入力する。
1. 以下のフォーマットに則って、テキストエリアにマークダウン記法で記事を書く。

  ```markdown
  ---
  title: 記事のタイトル
  date: 2016/01/01 00:00:00
  author: maika
  ---
  導入のテキスト

  <!-- more -->

  続きのテキスト
  ```

  - dateに入力する値は、以下のブックマークレットで生成できる。  
    [date format 生成用ブックマークレット](https://gist.github.com/yuheiy/6e47f70d2d7393ace1900d1dee0bbf63)
  - authorに入る値は以下のいずれかとなる。
    - maika
    - yuhei
  - 記事一覧ページとdescriptionでは、導入のテキストのみが表示される。
  - 記事詳細ページにのみ、続きのテキストが表示される。

1. `Commit Changes` をクリックしてしばらくすると、記事が更新される。

### 既存記事編集

1. ディレクトリを `rookies/source/_posts/` まで移動する。
1. 編集する記事を開く。
1. `Edit this file` をクリック。
1. 記事の内容を編集する。
1. `Commit Changes` をクリックしてしばらくすると、記事が更新される。

### 画像アップロード

1. ディレクトリを `rookies/source/images/post/` まで移動する。
1. `Upload files` をクリック。
1. アップロードする画像を選択。
1. `Commit Changes` をクリックしてしばらくすると、画像がアップロードされる。

### 記事中へ画像の挿入

1. 画像を挿入する記事を開く。
1. 以下のタグを挿入する。

  ```
  {% img /images/post/image-file-name.ext %}
  ```

1. `image-file-name.ext` の部分を、挿入するファイル名に変更する。
1. `Commit Changes` をクリックしてしばらくすると、記事が更新される。

### その他

- 画像以外にいろいろ記事に入れるタグ  
  [Tag Plugins | Hexo](https://hexo.io/docs/tag-plugins.html)
- Markdown記法の書き方  
  [文章作成やメモ書きにも便利、Markdown記法｜Web Design KOJIKA17](http://kojika17.com/2013/01/starting-markdown.html)
- Markdownのライブプレビュー  
  [Markdown Live Preview](http://markdownlivepreview.com/)
- 記事の下書きはGistにSecretで保存するとよさそう  
  [Create a new Gist](https://gist.github.com/)

## Todos

- favicon
- link to prev, next entry
- design for large screen
