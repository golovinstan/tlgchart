import React, { Component } from 'react';

class VerticalAxis extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={ylabels: []};

    this.position = props.position;
    this.width = props.width;
    this.scalecount = props.scalecount;
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
    this.svg.setAttribute('x', left);
    this.svg.setAttribute('y', top);
    this.svg.setAttribute('width', right-left);
    this.svg.setAttribute('height', bottom-top);
  }

  calcScale = ({ytop, ybottom, ystart, dpi_y, height_px}) => {
    const { scalecount } = this.props;
    const dy = (ytop - ybottom)/(scalecount);    
    let step = Math.floor((ystart - ybottom)/dy)*dy || ystart;
    const ylabels = [];    
    
    while (step < ytop){
      if ((step >= ybottom) && (step <= ytop)){
        const ypi = height_px - (step-ybottom)*dpi_y;
        ylabels.push(Math.floor(ypi));
      }
      step = step + dy;
    }

    this.setState({ylabels});
  }  

  calcAxisLine = ({}) => {
  }

  calcAxisLabel = ({}) => {
  }

  render() {
    const { width } = this.props;
    const { ylabels } = this.state;

    let labelPath = '';
    ylabels.forEach( y => {
      labelPath = labelPath + `M0 ${y} L${width} ${y} `;
    }); 

    return (
      <svg ref={ el => this.svg = el }>
        <path stroke-width="4" stroke="black" d={labelPath} />
      </svg>
    );
  }
}

export default VerticalAxis;
