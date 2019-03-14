import React, { Component } from 'react';

class View extends Component {
  render() {
    const {width, height} = this.props;

    return (
      <svg width={width} height={height}>
      
      </svg>
    );
  }
}

export default View;
