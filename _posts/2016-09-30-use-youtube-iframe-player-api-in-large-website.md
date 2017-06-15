---
title: 複数の動画を埋め込む場合におけるYouTube IFrame Player APIの辛みを回避する
author: yuhei
---
実務でYouTube IFrame Player APIを利用することが多いのですが、ライブラリの設計上の問題で使うのが辛く感じます。

<!-- more -->

というのも、[YouTube IFrame Player APIのリファレンス](https://developers.google.com/youtube/iframe_api_reference?hl=ja)を見ればわかりますが、利用方法が、

1. `script`要素で非同期にYouTube APIを読み込む
1. 読み込み完了時点で`window.onYouTubeIframeAPIReady`が呼ばれる
1. それ以降APIが利用できるようになる

という風になっていて、それを単一の動画を制御するために使うのであれば問題ないのですが、サイト内で複数のページに複数の動画を埋め込んで制御するというようなケースにおいてはうまく機能させるのが大変です。  
Youtube APIの`script`要素が複数読み込まれると問題が起きる可能性が高く、また、複数ファイルをまたいだときにAPIが利用可能になったのを検知するのが手間、というようなことがあるからです。  
ライブラリが一時代前に設計されたことが原因で、このようになっているのでしょうか。最近Webを始めたばかりの新人社員なので歴史的経緯を把握した上での断定ができません。  
とは言え、現代的なJavsScript APIの`Promise`を利用することで比較的楽に解決できそうです。

browserify等のモジュールシステムを利用する前提で例を示します。  
まず、この問題を解決するための以下のようなファイルを用意します。

```javascript
'use strict';

var loadYouTubeIFramePlayerAPI = function () {
  return new Promise(function (resolve) {
    var script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';

    var firstScript = document.querySelector('script');
    firstScript.parentNode.insertBefore(script, firstScript);

    window.onYouTubeIframeAPIReady = resolve;
  });
};

// export instance of promise
var resolver = loadYouTubeIFramePlayerAPI();
module.exports = resolver;
```

後は、YouTube APIを利用する際には必ず、先ほどのファイルからPromiseのインスタンスを読み込んで利用するだけです。

```javascript
'use strict';

var loadYoutubeAPI = require('./path/to/loadYoutubeAPI');

loadYoutubeAPI.then(function () {
  var player = new YT.Player('player', {});
});
```

解決済みの`Promise`インスタンスの`then`に関数を渡すと、その関数が即座に（非同期で）実行されます。  
そのため、YouTube APIが読み込まれていなければその完了を待ち、読み込み済みであればそのまま実行する関数を定義することができます。  
この方法を利用すれば、`script`要素の読み込みは１回しか実行されず、なおかつAPIの準備ができた段階で実行するという処理が簡単に書けます。

[このパターンを利用したページの設計を、簡易的な例として用意しました。](https://github.com/ryden-inc/rookies/tree/master/src/demos/use-youtube-iframe-player-api-in-large-website)

古い時代の問題も、新しい技術を用いて簡単に解決できるという身近な例でした。
