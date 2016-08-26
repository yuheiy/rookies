'use strict';
const React = require('react');
const behaveAsPage = require('../../framework/behave-as-page');
const dynamics = require('dynamics.js');

@behaveAsPage
class WorkPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: {
        outer: {
          display: 'none',
          opacity: 0
        },
        p: {
          y: 30
        }
      }
    };
  }

  onEnter() {
    return Promise.resolve()
    .then(() => new Promise(done => {
      const nextStyles = {...this.state.styles};
      const outer = {...nextStyles.outer};
      outer.display = '';
      dynamics.animate(outer, {
        opacity: 1
      }, {
        duration: 1000,
        change: outer => this.setState({styles: {...nextStyles, outer}}),
        complete: done
      });
    }))
    .then(() => new Promise(done => {
      const nextStyles = {...this.state.styles};
      const p = {...nextStyles.p};
      dynamics.animate(p, {
        y: 0
      }, {
        duration: 1000,
        change: p => this.setState({styles: {...nextStyles, p}}),
        complete: done
      });
    }));
  }

  onLeave() {
    return Promise.resolve()
    .then(() => new Promise(done => {
      const nextStyles = {...this.state.styles};
      const p = {...nextStyles.p};
      dynamics.animate(p, {
        y: 30,
      }, {
        duration: 1000,
        change: p => this.setState({styles: {...nextStyles, p}}),
        complete: done
      });
    }))
    .then(() => new Promise(done => {
      const nextStyles = {...this.state.styles};
      const outer = {...nextStyles.outer};
      dynamics.animate(outer, {
        opacity: 0
      }, {
        duration: 1000,
        change: outer => this.setState({styles: {...nextStyles, outer}}),
        complete: done
      });
    }));
  }

  componentDidMount() {
    const baseTitle = 'React Sequentially Animation Between Pages Example';
    document.title = `Work - ${baseTitle}`;
  }

  render() {
    const {styles} = this.state;
    return (
      <section style={{
        display: styles.outer.display,
        opacity: styles.outer.opacity
      }}>
        <h1>Work</h1>
        <p style={{
          transform: `translateY(${styles.p.y}px)`
        }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </section>
    );
  }
}

module.exports = WorkPage;
