# ライデンの新人ブログ

## 準備

```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build

echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile

source ~/.bash_profile

rbenv install 2.4.1
rbenv global 2.4.1

gem install bundler
```

```bash
bundle install
bundle exec jekyll serve
```

## 記事を書く

1. `_posts/2017-01-01-post-slug.md` というフォーマットに則った名前のファイルを作成
1. 以下のフォーマットで記事を書く
    ```markdown
    ---
    title: 記事のタイトル
    author: yuhei
    ---
    記事の前書き（トップページに表示される）

    <!-- more -->

    続き（個別記事ページにのみ表示される）
    ```
1. Gitにcommitしてpushすれば反映される

### 画像の利用

1. `assets/images/post/post-slug` のような記事のファイルと同名のディレクトリを作成
1. 利用する画像を格納
1. 画像の埋め込み方法は[スタイルガイド](https://ryden-inc.github.io/rookies/posts/styleguide.html)を参照

### OGP画像

1. 記事ファイルと同名のディレクトリに画像を格納する
1. 記事ファイルのFront matterに `image: file-name-like-this.png` のようにファイル名のみ記述

### ツイートの埋め込み

1. 記事ファイルのFront matterに `embed_tweet: true` を追加
1. 「ツイートをサイトに埋め込む」で生成されたコードをコピペし、`<script>`要素は削除する

## 著者を追加

1. `_data/authors.yml` を編集
1. 画像ファイルは `assets/images/author` に格納
