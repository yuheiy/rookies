'use strict';
const React = require('react');
const Link = require('./Link');

const Header = function Header() {
  return (
    <header>
      <h1>React Sequentially Animation Between Pages Example</h1>
      <nav>
        <ul>
          {[
            ['home', '/'],
            ['about', '/about'],
            ['work', '/work']
          ].map(([name, path]) => (
            <li key={path}>
              <Link to={path}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

module.exports = Header;
