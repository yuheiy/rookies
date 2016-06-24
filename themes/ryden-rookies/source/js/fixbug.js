// chrome 51で擬似要素のcontentで指定した画像が表示されないので再描画させる
(function () {
  'use strict';

  var userAgent = navigator.userAgent;
  var isChrome = userAgent.indexOf('Chrome') > -1;

  if (!isChrome) {
    return;
  }

  var redrawStyle = function () {
    var styleSheet = document.styleSheets[0];
    var rule = 'body::before { display: none !important; }';
    var index = 0;

    styleSheet.insertRule(rule, index);
    setTimeout(styleSheet.deleteRule.bind(styleSheet, index), 0);
  };

  if (document.readyState === 'complete') {
    redrawStyle();
  } else {
    window.addEventListener('load', redrawStyle);
  }
})();
