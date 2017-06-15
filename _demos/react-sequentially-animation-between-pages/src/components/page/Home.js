'use strict';
const React = require('react');
const behaveAsPage = require('../../framework/behave-as-page');
const dynamics = require('dynamics.js');

@behaveAsPage
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

  componentDidMount() {
    const baseTitle = 'React Sequentially Animation Between Pages Example';
    document.title = `Home - ${baseTitle}`;
  }

  render() {
    const {style} = this.state;
    return (
      <section style={{
        display: style.display,
        opacity: style.opacity
      }}>
        <h1>Home</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </section>
    );
  }
}

module.exports = HomePage;
