# [Ryden blog](https://ryden-inc.github.io/rookies/)

俺たちで最高の社会人になろうな！

## 運用ガイドライン

ブラウザで記事を更新する場合、以下の手順に従うとスムーズです。

### 新規記事投稿

1. ディレクトリを [`/source/_posts/`](/source/_posts/) まで移動する。
1. `Create new file` をクリック。
1. ファイル名を `article-title-like-this.md` のフォーマットで入力する。
1. 以下のフォーマットに則って、テキストエリアにマークダウン記法で記事を書く。

  ```markdown
  ---
  title: 記事のタイトル
  date: 2016/01/01 00:00:00
  updated: 2016/01/01 00:00:00
  author: maika
  ---
  導入のテキスト

  <!-- more -->

  続きのテキスト
  ```

  - dateに入力する値は、以下のブックマークレットで生成できる。以下のコードをブックマークすることで利用できる。  

    ```js
    javascript:{let zero = n => `0${n}`.slice(-2);let date = new Date();let year = date.getFullYear();let month = zero(date.getMonth() + 1);let day = zero(date.getDate());let hours = zero(date.getHours());let minutes = zero(date.getMinutes());let seconds = zero(date.getSeconds());alert(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}`);}
    ```

  - authorに入る値は以下のいずれかとなる。
    - maika
    - yuhei
  - 記事一覧ページとdescriptionでは、導入のテキストのみが表示される。
  - 記事詳細ページにのみ、続きのテキストが表示される。

1. `Commit Changes` をクリックしてしばらくすると、記事が更新される。

### 既存記事編集

1. ディレクトリを [`/source/_posts/`](/source/_posts/) まで移動する。
1. 編集する記事を開く。
1. `Edit this file` をクリック。
1. 記事の内容を編集する。
1. `Commit Changes` をクリックしてしばらくすると、記事が更新される。

### 画像アップロード

1. ディレクトリを [`/source/images/post/`](/source/images/post/) まで移動する。
1. 記事の専用のディレクトリを作成する。  
`Create new file` をクリック  
ファイル名の欄に `記事の拡張子を除いたファイル名/.gitkeep` と入力（例えば、記事のファイル名が`post-title-like-this.md`なら`post-title-like-this/.gitkeep`）  
`Commit Changes` をクリック
1. 作成したディレクトリを開いた状態で、 `Upload files` をクリック
1. アップロードする画像を選択。
1. `Commit Changes` をクリックしてしばらくすると、画像がアップロードされる。

### 記事中へ画像の挿入

1. 画像を挿入する記事を開く。
1. [スタイルガイド](https://ryden-inc.github.io/rookies/posts/styleguide.html)を参考に、必要なコードを挿入する。
1. `post-slug-name` の部分を、記事の拡張子を覗いたファイル名に変更する。
1. `image-file-name.ext` の部分を、挿入するファイル名に変更する。
1. `Commit Changes` をクリックしてしばらくすると、記事が更新される。

## その他

- Markdown記法の書き方  
  [文章作成やメモ書きにも便利、Markdown記法｜Web Design KOJIKA17](http://kojika17.com/2013/01/starting-markdown.html)
- Markdownのライブプレビュー  
  [Markdown Live Preview](http://markdownlivepreview.com/)
- 画像以外にいろいろ記事に入れるタグ  
  [Tag Plugins | Hexo](https://hexo.io/docs/tag-plugins.html)
- 記事の下書きはGistにSecretで保存するとよさそう  
  [Create a new Gist](https://gist.github.com/)
