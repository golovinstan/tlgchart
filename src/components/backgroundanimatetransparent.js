import React, { Component } from 'react';


class BackgroundAnimateTransparent extends Component {
  constructor(props){
    super(props);
  }


  render() {
    const {color} = this.props;

    return (
        <rect pointerEvents={"none"} x={0} y={0} width={"100%"} height={"100%"} fill={color}  >
          <animate attributeName={"opacity"} values={`1;0`} dur={"1s"} fill={"freeze"} />        
        </rect>
    );
  }
}

export default BackgroundAnimateTransparent;
