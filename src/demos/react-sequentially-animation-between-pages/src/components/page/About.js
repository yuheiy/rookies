'use strict';
const React = require('react');
const behaveAsPage = require('../../framework/behave-as-page');
const dynamics = require('dynamics.js');

@behaveAsPage
class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: {
        outer: {
          display: 'none'
        },
        h1: {
          x: 50,
          opacity: 0
        },
        p: {
          x: 50,
          opacity: 0
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
      this.setState({styles: {...nextStyles, outer}}, done);
    }))
    .then(() => new Promise(done => {
      const nextStyles = {...this.state.styles};
      const h1 = {...nextStyles.h1};
      dynamics.animate(h1, {
        x: 0,
        opacity: 1
      }, {
        duration: 1000,
        change: h1 => this.setState({styles: {...nextStyles, h1}}),
        complete: done
      });
    }))
    .then(() => new Promise(done => {
      const nextStyles = {...this.state.styles};
      const p = {...nextStyles.p};
      dynamics.animate(p, {
        x: 0,
        opacity: 1
      }, {
        duration: 1000,
        change: p => this.setState({styles: {...nextStyles, p}}),
        complete: done
      })
    }));
  }

  onLeave() {
    return Promise.resolve()
    .then(() => new Promise(done => {
      const nextStyles = {...this.state.styles};
      const p = {...nextStyles.p};
      dynamics.animate(p, {
        x: 50,
        opacity: 0
      }, {
        duration: 1000,
        change: p => this.setState({styles: {...nextStyles, p}}),
        complete: done
      })
    }))
    .then(() => new Promise(done => {
      const nextStyles = {...this.state.styles};
      const h1 = {...nextStyles.h1};
      dynamics.animate(h1, {
        x: 50,
        opacity: 0
      }, {
        duration: 1000,
        change: p => this.setState({styles: {...nextStyles, h1}}),
        complete: done
      })
    }));
  }

  componentDidMount() {
    const baseTitle = 'React Sequentially Animation Between Pages Example';
    document.title = `About - ${baseTitle}`;
  }

  render() {
    const {styles} = this.state;
    return (
      <section style={{
        display: styles.outer.display
      }}>
        <h1 style={{
          transform: `translateX(${styles.h1.x}px)`,
          opacity: styles.h1.opacity
        }}>About</h1>
        <p style={{
          transform: `translateX(${styles.p.x}px)`,
          opacity: styles.p.opacity
        }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </section>
    );
  }
}

module.exports = AboutPage;
