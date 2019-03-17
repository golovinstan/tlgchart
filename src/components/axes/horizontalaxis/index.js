import React, { Component } from 'react';

class HorizontAxis extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={ xlabels: [] };

    this.position = props.position;
    this.height = props.height;
    this.scalecount = props.scalecount;
    instances.axes.push(this);
  }    

  calcOffset = ({top, bottom}) => {
    const { height, xonchart: onchart } = this.props;
    if (top != null){
      if (onchart !== true){
        return top + height;
      } else {
        return top;
      }
    }
    if (bottom != null){
      if (onchart !== true){
        return bottom - height;
      } else {
        return bottom;
      }
    }
    throw new Error('Need some value');
  }

  setPosition({ left, right, top, bottom }){
    this.svg.setAttribute('x', left);
    this.svg.setAttribute('y', top);
    this.svg.setAttribute('width', right-left);
    this.svg.setAttribute('height', bottom-top);
  }

  calcScale = ({xleft, xright, xstart, dpi_x}) => {
    const { scalecount } = this.props;
    const dx = (xright - xleft)/(scalecount);
    let step = Math.floor((xstart - xleft)/dx)*dx || xstart;
    const xlabels = [];

    while (step < xright){
      if ((step >= xleft) && (step <= xright)){
        const xpi = (step-xleft)*dpi_x;
        xlabels.push(xpi);
      }
      step = step + dx;
    }

    this.setState({xlabels});
  }

  calcAxisLine = ({xlabels}) => {

  }  

  render() {
    const { height } = this.props;
    const { xlabels } = this.state;

    let labelPath = '';
    xlabels.forEach( x => {
      labelPath = labelPath + `M${x} 0 L${x} ${height} `;
    }); 

    return (
      <svg ref={ el => this.svg = el }>
        <path stroke-width="4" stroke="black" d={labelPath} />
      </svg>
    );
  }
}

export default HorizontAxis;
