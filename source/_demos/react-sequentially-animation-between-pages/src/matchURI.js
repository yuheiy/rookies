'use strict';
const React = require('react');
const HomePage = require('./components/page/Home');
const AboutPage = require('./components/page/About');
const WorkPage = require('./components/page/Work');

const matchURI = ({pathname}, dispatch) => {
  const props = {
    key: pathname,
    dispatch
  };

  switch (pathname) {
    case '/':
      return <HomePage {...props} />
    case '/about':
      return <AboutPage {...props} />
    case '/work':
      return <WorkPage {...props} />
    default:
      return null;
  }
};

module.exports = matchURI;
