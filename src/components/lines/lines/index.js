import React, { Component } from 'react';

class Lines extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={left:0, top:0, right:1, bottom:1 };    

    instances.linesView = this;
    instances.lines = [];
  }

  setPosition({ left, right, top, bottom }){
    this.setState({ left, right, top, bottom })
  }  

  render() {
    const { children, instances } = this.props;
    const { left, right, top, bottom } = this.state;
    
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances })
    );        

    return (
    <svg x={left} y={top} width={right-left} height={bottom-top}>
      {childrenWithProps}
    </svg>);
  }
}

export default Lines;
