'use strict';
const React = require('react');
const history = require('../history');

const Link = function Link({to, children}) {
  const onClick = e => {
    e.preventDefault();

    // 雑
    if (to === history.getCurrentLocation().pathname) {
      return;
    }

    history.push(to);
  };
  return <a href={history.createHref(to)} onClick={onClick}>{children}</a>;
};

module.exports = Link;
