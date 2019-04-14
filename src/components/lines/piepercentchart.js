import React, { Component } from 'react';

class PiePercentChart extends Component {
  constructor(props){
    super(props);
  }

  calcPath = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
  }

  render() {
    return (
        <svg width="100%" height="100%" viewbox="0 0 4 4">    
            <circle r="1" cx="2" cy="2" stroke="green" fill="none" stroke-width="2" stroke-dashoffset="0" stroke-dasharray="0.78 6.28"/>
            <circle r="1" cx="2" cy="2" stroke="red" fill="none" stroke-width="2" stroke-dashoffset="3.14" stroke-dasharray="0.78 6.28"/>
        </svg>
    );
  }
}

export default PiePercentChart;
