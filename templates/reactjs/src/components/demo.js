import React, { Component } from 'react';
import { render } from 'react-dom';
import Counter from './counter';

import '../style/demo.less';

export default class Demo extends Component {
  render() {
    return (
      <div>
        <Counter increment={100}  />
        <Counter increment={9} />
      </div>
    )
  }
}
