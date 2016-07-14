---
title: package.jsonに環境変数を定義する
date: 2016/07/14 16:19:11
updated: 2016/07/14 16:19:11
author: yuhei
---
npm run-scriptにタスクを追加していくとき、タスク間で共通の変数を定義したいということがあります。  
そういう場合は、`package.json`の`config`フィールドに記述することで実現できます。

<!-- more -->

以下のような記述をした上で、npm run-scriptを通して実行することで環境変数を利用することができます。

```json
{
  "config": {
    "dest": "public/assets"
  },
  "scripts": {
    "build": "browserify src/main.js > ${npm_package_config_dest}/bundle.js",
    "env": "node env.js"
  },
  "devDependencies": {
    "browserify": "*"
  }
}
```

`config`フィールド以外の`package.json`の値も参照することができて、例えば`npm_package_version`などでバージョンを参照することができます。

また、npm run-scriptを通して実行したnode.jsのファイルからも、`process.env`を通して利用できます。

```javascript
let vars = Object.keys(process.env).filter(v => v.startsWith('npm_package'));
console.log(vars);

// [ 'npm_package_config_dest',
//  'npm_package_name',
//  'npm_package_scripts_build',
//  'npm_package_devDependencies_browserify',
//  'npm_package_version',
//  'npm_package_scripts_env' ]
```

参考：  
[scripts | npm Documentation](https://docs.npmjs.com/misc/scripts)
