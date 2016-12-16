---
title: Reactでページ間のアニメーションを直列に実行する
date: 2016/08/26 16:32:23
updated: 2016/08/26 16:32:23
author: yuhei
---
Reactでページ（URL）間のアニメーションを直列に表現したいということがありました。  
公式のアドオンとして、`ReactCSSTransitionGroup`、`ReactTransitionGroup`というアニメーションのためのコンポーネントが提供されていますが、それらはクロスフェードするようなアニメーションが前提になっています。つまり、現在のページのアニメーションが終了するのを待ってから、次のページのアニメーションを実行するという機能を提供していません。

<!-- more -->

Webサイトとして凝った演出をしたいとき、URLをまたいだときの処理として、現在のページを離脱するときのアニメーションが終わった後、次のページが徐々に現れるという風にしたいです。  
そのため、それらのアニメーションを直列に実行する必要があります。

`ReactTransitionGroup`はアニメーションのためのAPIを提供していますが、それだけではやりたいことが実現できません。そのため、**それらをラップしてキューを管理するためのコンポーネント** を作ります。例えば、以下のように実装します。[全部飛ばしてソースを見たい人はここにあります。](https://github.com/ryden-inc/rookies/tree/master/source/_demos/react-sequentially-animation-between-pages)

まず、ロケーションの管理は以下のように行います。

```javascript
const React = require('react');
const {render} = require('react-dom');
const history = require('./history'); // instance of history

const App = ({location}) => (
  <div>
    <Header />
    <PageContainer location={location} />
  </div>
);

const renderApp = location => {
  render(<App location={location} />, mountNode);
};

renderApp(history.getCurrentLocation());
history.listen(renderApp);
```

URLの変更があると、Reactのコンポーネントに対して`location`オブジェクトが渡されます。  
ブラウザのロケーションを管理するためのライブラリとして、[mjackson/history](https://github.com/mjackson/history)を利用しています。

`PageContainer`では、stateとして持った`location`を基に、ページにマッチするコンポーネントを選択して`TransitionGroup`の`children`として渡します。初期stateには`props.location`をセットして、以後は`location`が渡ってくるたびに、`setState`するためのキューを溜めます。

キューを溜めるための機構として[mizchi/promised-reducer](https://github.com/mizchi/promised-reducer)を、子のコンポーネントとやり取りするためにEventEmitterを利用します。

```javascript
const {EventEmitter} = require('events');
const React = require('react');
const TransitionGroup = require('react-addons-transition-group');
import PromisedReducer from 'promised-reducer';

const matchURI = ({pathname}, dispatch) => {
  switch (pathname) {
    case '/':
      return <HomePage key={pathname} dispatch={dispatch} />;
    case '/about':
      return <AboutPage key={pathname} dispatch={dispatch} />;
    default:
      return null;
  }
};

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location
    };

    const reducer = new PromisedReducer();
    reducer.on(':update', state => this.setState(state));

    const emitter = new EventEmitter();
    const subscribe = emitter.on.bind(emitter);

    subscribe('push-queue', queue => {
      reducer.update(state => queue().then(() => state));
    });
    subscribe('update-location', location => {
      reducer.update(state => ({location}));
    });

    this.dispatch = emitter.emit.bind(emitter);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.dispatch('update-location', nextProps.location);
    }
  }

  render() {
    const matchComponent = matchURI(this.state.location, this.dispatch);

    return (
      <TransitionGroup component="div">
        {matchComponent}
      </TransitionGroup>
    );
  }
}
```

PromisedReducerでは、`PromisedReducer#update`に渡したキューを連結して、それら全てが終了したタイミングで`PromisedReducer#on(':update')`に渡したコールバックが呼ばれます。

全体の流れとしてはこういう風になっています。

初回マウント時

1. `PageContainer`に初期の`location`をstateにセットする
1. `PageContainer`からマッチするコンポーネントを`TransitionGroup`に渡す
1. URLに対応するコンポーネントの`componentWillAppear`からコンテナにキューが打ち上げられる

URL遷移時

1. `PageContainer`に`location`が渡り、`setState`するキューを溜める
1. reducerにキューが溜まってなければ`setState`される
1. 次のURLに対応するコンポーネントを`TransitionGroup`に渡す
1. 次のURLに対応するコンポーネントの`componentWillEnter`が発火するが、前のURLのコンポーネントの`componentWillLeave`の後に実行させたいので、`setTimeout(fn, 0)`で遅延させておく
1. 前のURLに対応するコンポーネントの`componentWillLeave`からキューが打ち上げられる
1. 遅延して、次のURLに対応するコンポーネントの`componentWillEnter`からキューが打ち上げられる

いずれかのキューの途中でURL遷移のイベントが複数発生しても、中間で渡った`location`を経由する（`TransitionGroup`に渡される）ことなく、現在表示されているコンポーネントの`componentWillLeave`と、最終的なURLにマッチするコンポーネントの`componentWillEnter`のみが実行されます。

それぞれのURLに対応するコンポーネントの実装として以下のようなイメージです。

```javascript
const React = require('react');
const dynamics = require('dynamics.js');

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        display: 'none',
        opacity: 0
      }
    };
  }

  onEnter() {
    return new Promise(done => {
      const nextStyle = {...this.state.style};
      nextStyle.display = '';
      dynamics.animate(nextStyle, {
        opacity: 1
      }, {
        duration: 3000,
        change: style => this.setState({style}),
        complete: done
      });
    });
  }

  onLeave() {
    return new Promise(done => {
      const nextStyle = {...this.state.style};
      dynamics.animate(nextStyle, {
        opacity: 0
      }, {
        duration: 3000,
        change: style => this.setState({style}),
        complete: done
      });
    });
  }

  componentWillAppear(callback) {
    const queue = () => this.onEnter().then(callback);
    this.props.dispatch('push-queue', queue);
  }

  componentWillEnter(callback) {
    // 前のコンポーネントの `componentWillLeave` を待ってから実行する
    setTimeout(() => {
      const queue = () => this.onEnter().then(callback);
      this.props.dispatch('push-queue', queue);
    }, 0);
  }

  componentWillLeave(callback) {
    const queue = () => this.onLeave().then(callback);
    this.props.dispatch('push-queue', queue);
  }

  render() {
    const {style} = this.state;
    return (
      <div style={{
        display: style.display,
        opacity: style.opacity
      }}>
        <h1>HomePage</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    );
  }
}
```

Reactとあまり関係ありませんが、上の例で使用している[dynamics.js](http://dynamicsjs.com/)はオブジェクトの値を変化させるのに便利です。

[この仕組みで実際に動いているデモ](/demos/react-sequentially-animation-between-pages/#/)と、[そのソース](https://github.com/ryden-inc/rookies/tree/master/source/_demos/react-sequentially-animation-between-pages)です。

---

なんとかやりたいことは実現できましたが、あまりきれいなやり方でできなかったという感じです。もうちょっとまともな方法があったら教えてください。
