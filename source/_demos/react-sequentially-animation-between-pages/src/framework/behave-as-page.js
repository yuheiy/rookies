'use strict';

const behaveAsPage = WrappedComponent => {
  Object.defineProperty(WrappedComponent.prototype, 'componentWillAppear', {
    value(callback) {
      const queue = () => this.onEnter().then(callback);
      this.props.dispatch('push-queue', queue);
    }
  });

  Object.defineProperty(WrappedComponent.prototype, 'componentWillEnter', {
    value(callback) {
      // 前のコンポーネントの `componentWillLeave` を待ってから実行する
      setTimeout(() => {
        const queue = () => this.onEnter().then(callback);
        this.props.dispatch('push-queue', queue);
      }, 0);
    }
  });

  Object.defineProperty(WrappedComponent.prototype, 'componentWillLeave', {
    value(callback) {
      const queue = () => this.onLeave().then(callback);
      this.props.dispatch('push-queue', queue);
    }
  });
};

module.exports = behaveAsPage;
