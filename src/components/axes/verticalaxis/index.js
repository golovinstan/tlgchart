import React, { Component } from 'react';

class VerticalAxis extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={left:0, top:0, right:1, bottom:1 };

    this.position = props.position;
    this.width = props.width;
    instances.axes.push(this);
  }

  calcOffset = ({left, right}) => {
    const { width, yonchart: onchart } = this.props;
    if (left != null){
      if ( onchart !== true){
        return left + width;
      } else {
        return left;
      }
    }
    if (right != null){
      if ( onchart !== true){
        return right - width;
      } else {
        return right;
      }
    }
    throw new Error('Need some value');
  }

  setPosition({ left, right, top, bottom }){
    this.setState({ left, right, top, bottom })
  }

  calcScale = ({}) => {
  }  

  calcAxisLine = ({}) => {
  }

  calcAxisLabel = ({}) => {
  }

  render() {
    const { left, right, top, bottom } = this.state;

    return (
      <svg x={left} y={top} width={right-left} height={bottom-top}>
      </svg>
    );
  }
}

export default VerticalAxis;
