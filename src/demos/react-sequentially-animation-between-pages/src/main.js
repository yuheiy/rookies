'use strict';
const React = require('react');
const {render} = require('react-dom');
const history = require('./history');
const App = require('./components/App');

const mountNode = document.getElementById('root');
const renderApp = location => {
  render(<App location={location} />, mountNode);
};

renderApp(history.getCurrentLocation());
history.listen(renderApp);
