---
title: スマートデバイスの動画再生周りの挙動
author: yuhei
---

端末によって、サイトに埋め込んだ動画が再生できたりできなかったりするので、その挙動について調べました。  
video要素と、Youtube IFrame Player APIによって埋め込まれた動画の再生を、イベントに応じて制御できるかなどを検証しています。

<!-- more -->

## 自動再生

スマートデバイスにおいては、動画の自動再生はできない仕様になっています。  
理由は、ユーザーが費用負担する携帯電話ネットワーク経由で要求していないダウンロードを防止するためです。  
と、[アップルのドキュメント](https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html)に書かれています。

そのため、明示的なユーザーのアクションによってしか動画が再生されないようになっています。ボタンをクリックするなどです。  
試しに、resizeイベントやscrollイベントをトリガーにして再生させようとしてみたのですができませんでした。クリックして1秒後に再生なども不可です。  
この仕様があることと同様の理由から、ユーザーの意図しないタイミングでの動画再生がされるようなサイトを制作するべきではないでしょう。

## ボタンのクリックによる再生

動画のプレイヤーでなく、ボタンのクリックイベントをトリガーとして動画を再生してみた確認結果です。

[デモ用ページ]({{ site.baseurl }}/demos/playing-movie-in-smart-devices/)

### video要素の埋め込み

| 機種    | 対応 |
|---------|------|
| iPhone  | ◯    |
| iPad    | ◯    |
| Nexus 5 | ◯    |
| Nexus 7 | ◯    |

### Youtube iframeの埋め込み

| 機種    | 対応 |
|---------|------|
| iPhone  | ×    |
| iPad    | ×    |
| Nexus 5 | ◯    |
| Nexus 7 | ◯    |

確認した中では、iOSでYoutubeの動画を再生するためには、実際のiframe playerをクリック（タップ）するか、Youtubeへのリンクに移動させる以外の方法はありませんでした。
