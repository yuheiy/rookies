---
title: Reactで静的サーバーでも初期描画をする
date: 2016/12/12 13:26:39
updated: 2016/12/12 13:26:39
author: yuhei
---
Reactはサーバーサイドでも実行可能で、サーバーサイドで初期描画済みのHTMLをクライアントに返却できます（サーバーサイドレンダリング）。これで得られる効果は、初期ロード時間の削減とSEOの改善です。ですが、静的コンテンツ用のサーバーでは動的にHTMLを生成することはできません。

<!-- more -->

静的コンテンツ用のサーバーでも初期描画するためには、それぞれのURLに対応するHTMLをReactDOMで生成します。その結果を静的ファイルとして生成することで、実質サーバーサイドレンダリングをしたような効果が得られます。

言い換えると、Universalな作りにしておいて、リクエストされるであろうURLに対応するHTMLファイルを開発タスクであらかじめ生成しておく、というやり方です。

もちろんこの場合、リクエストごとに結果が変わる状態や、URLのクエリ文字列に応じて異なる結果を初期描画に含めることはできません。そのため利用できるシーンは制限されますが、得られる恩恵を考慮するとそれを行う価値はあると思っています。

具体的な実装としては以下のようにして行いました。

まず、開発用ファイルの構成は以下のようになります。

```bash
.
├── dist
│   ├── about.html
│   ├── app.js
│   ├── app.js.map
│   └── index.html
├── gulpfile.babel.js
├── package.json
├── prerender.js
├── src
│   ├── js
│   │   ├── components
│   │   │   ├── about.js
│   │   │   ├── home.js
│   │   │   ├── link.js
│   │   │   └── root.js
│   │   ├── constants.js
│   │   ├── history.js
│   │   ├── index.js
│   │   └── router.js
│   ├── routes.json
│   └── template.pug
└── yarn.lock

4 directories, 18 files
```

`src/routes.json`には、サーバーとクライアントで共有するルートの情報を記述しています。

```json
[
  {
    "path": "/",
    "page": "./components/home"
  }, {
    "path": "/about.html",
    "page": "./components/about",
    "title": "About"
  }
]
```

`src/js/router.js`では、ページに対応するコンポーネントのルーティングを行うために、サーバーとクライアントで共有するルーターを以下のように実装しています。

```jsx
const path = require('path')

const baseTitle = 'Site Title'

export default class Router {
  static resolve(routes, context) {
    const route = routes.find(route => route.path === context.location)
    if (!route) throw new Error('Not found route')

    route.title = route.title ? `${route.title} - ${baseTitle}` : baseTitle
    return route
  }
}
```

クライアント固有のファイルとしては、`pushState`のラッパーである[history](https://github.com/mjackson/history)をシングルトンみたいに扱うためのファイル（`src/js/history.js`）と、クライアントのエントリーポイント（`src/js/index.js`）があります。

```jsx
import createHistory from 'history/createBrowserHistory'

const isBrowser = typeof window !== 'undefined'
const history = isBrowser && createHistory()
export default history
```

```javascript
import history from './history.js'
import Router from './router.js'
import routes from '../routes.json'
import Root from './components/root.js'

const React = require('react')
const ReactDOM = require('react-dom')

// browserifyで動的に`require`するため以下のコードで読み込んでおく
if (process.title === 'browser') {
  require('./components/home').default
  require('./components/about').default
}

const onLocationChange = location => {
  const route = Router.resolve(routes, location)
  const Page = require(route.page).default
  const component = <Page />

  ReactDOM.render(
    <Root>{component}</Root>,
    document.querySelector('#root'),
    () => document.title = route.title
  )
}

history.listen(onLocationChange)
onLocationChange(history.location)
```

サーバー側、つまり静的HTMLを生成するためのファイルとしては、Pugのテンプレートファイル（`src/template.pug`）と、全てのルートに対応するHTMLを生成するためのスクリプト（`prerender.js`）があります。

```jade
doctype html
html
  head
    meta(charset="utf-8")
    title= title
  body
    #root!= markup
    script(src="app.js")
```

```jsx
import Router from './src/js/router.js'
import routes from './src/routes.json'
import Root from './src/js/components/root.js'

const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const pug = require('pug')
const React = require('react')
const ReactDOM = require('react-dom/server')

const compiler = pug.compileFile('src/template.pug')
mkdirp.sync('dist')

routes.forEach(({path: pathname}) => {
  const location = {pathname}
  const route = Router.resolve(routes, location)
  const Page = require(`./${path.join('src/js', route.page)}`).default
  const component = <Page />
  const markup = ReactDOM.renderToString(<Root>{component}</Root>)
  const locals = {
    title: route.title,
    markup,
  }
  const result = compiler(locals)
  const filename = route.path.replace(/\/$/, '/index.html')

  fs.writeFileSync(path.join('dist', filename), result, 'utf8')
})
```

上記の例ではいろいろ省略した部分があります。実際に開発タスクとして動くようにしたのが以下です。

[yuheiy/prerendered-react-static](https://github.com/yuheiy/prerendered-react-static)

---

以下のプロジェクトを参考にしました。

- [kriasoft/react-starter-kit](https://github.com/kriasoft/react-starter-kit)
- [kriasoft/react-static-boilerplate](https://github.com/kriasoft/react-static-boilerplate)
- [bouzuya/blog.bouzuya.net](https://github.com/bouzuya/blog.bouzuya.net)
- [gatsbyjs/gatsby](https://github.com/gatsbyjs/gatsby)
