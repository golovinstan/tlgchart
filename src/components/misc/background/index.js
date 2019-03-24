import React, { Component } from 'react';


class BackgroundColor extends Component {
  constructor(props){
    super(props);
    this.start="white";
  }

  render() {
    const {color} = this.props;
    const start = this.start;
    this.start = color;

    return (
      <rect x={0} y={0} width={"100%"} height={"100%"}>
        <linearGradient>
          <stop offset="5%"  stopColor={"clRed"}/>
        </linearGradient>        
      </rect>

    );
  }
}

export default BackgroundColor;
