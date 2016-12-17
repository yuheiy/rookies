'use strict';
const React = require('react');
const Header = require('./Header');
const PageContainer = require('../containers/PageContainer');

const App = function App(props) {
  return (
    <div>
      <Header />
      <PageContainer location={props.location} />
    </div>
  );
};

module.exports = App;
