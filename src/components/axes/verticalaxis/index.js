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
    this.scale_dy = dy;
    let step = Math.floor((ystart - ybottom)/dy)*dy || ystart;
    const ylabels = [];    
    
    while (step < ytop){
      if ((step >= ybottom) && (step <= ytop)){
        const ypi = height_px - (step-ybottom)*dpi_y;
        ylabels.push({py: Math.floor(ypi), y: step});
      }
      step = step + dy;
    }

    this.setState({ylabels});
  }  

  getAxisLabel = ({y, py, labelWidth, labelHeight, key, axisWidth, ytop, ybottom}) => {
    const { getAxisLabel } = this.props;
    if (getAxisLabel){
      return getAxisLabel({y, py, labelWidth, labelHeight, key, axisWidth, ytop, ybottom });
    }
    return <text x="0" y={py-axisWidth} key={key} >{`${Math.floor(y)}`}</text>
  }

  render() {
    const { width, axisWidth, ytop, ybottom } = this.props;
    const { ylabels } = this.state;

    let labelPath = '';
    ylabels.forEach( ({py}) => {
      labelPath = labelPath + `M0 ${py} L${width} ${py} `;
    }); 
    let labelHeight = 0;
    if (ylabels.length>1){
      labelHeight = ylabels[0].py - ylabels[1].py;
    }

    return (
      <svg ref={ el => this.svg = el }>
        <path strokeWidth={axisWidth} stroke="black" d={labelPath} />
        {
          ylabels.map( ({y, py}, i) => this.getAxisLabel({y, py, labelWidth: width, labelHeight, key: i, axisWidth, ytop, ybottom})  )
        }
      </svg>
    );
  }
}

export default VerticalAxis;
