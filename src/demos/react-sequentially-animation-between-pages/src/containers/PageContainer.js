'use strict';
const {EventEmitter} = require('events');
const React = require('react');
const TransitionGroup = require('react-addons-transition-group');
import PromisedReducer from 'promised-reducer';
const matchURI = require('../matchURI');

class PageContainer extends React.Component {
  constructor(props) {
    super(props);

    const initialState = {
      location: props.location
    };
    this.state = initialState;

    const reducer = new PromisedReducer(initialState);
    reducer.on(':update', state => this.setState(state));

    const emitter = new EventEmitter();
    this.dispatch = emitter.emit.bind(emitter);

    const subscribe = emitter.on.bind(emitter);
    subscribe(
      'push-queue',
      queue => reducer.update(state => queue().then(() => state))
    );
    subscribe(
      'update-location',
      location => reducer.update(state => ({location}))
    );
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

module.exports = PageContainer;
