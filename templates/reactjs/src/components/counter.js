import React, { Component } from 'react';

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.interval = setInterval(() => this.tick(), 1000);
  }
  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillMount() {
    console.log('componentWillMount')
  }
  componentDidMount() {
    console.log('componentDidMount') 
  }

  componentWillUpdate() {
    console.log('componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    console.log('render')
    return (
      <h1>
        计数: ({this.props.increment}): {this.state.counter}
      </h1>
    )
  }
}
