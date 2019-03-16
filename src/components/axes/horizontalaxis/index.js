import React, { Component } from 'react';

class HorizontAxis extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={left:0, top:0, right:1, bottom:1 };

    this.position = props.position;
    this.height = props.height;
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
    this.setState({ left, right, top, bottom })
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }

  calcScale = ({xleft, xright, xstart}) => {
    const { scalecount } = this.props;

    const steps = [];
    const dx = (xright - xleft)/(scalecount);

    let step = Math.floor((xstart - xleft)/dx)*dx;

    while (step < xright){
      if ((step > xleft) && (step < xright)){
        steps.push(step);
      }
      step = step + dx;
    }
    this.calcAxisLabel({steps, xright, xleft});
  }

  calcAxisLine = ({steps}) => {

  }  

  calcAxisLabel = ({steps, xleft, xright}) => {
    const { height } = this.props;
    const width = this.right - this.left;
    const dpi = width/(xright-xleft);

    let labelPath = '';
    steps.forEach( step => {
      const xpi = (step-xleft)*dpi;
      labelPath = labelPath + `M${xpi} 0 L${xpi} ${height} `;
    });
    this.setState({labelPath});
  }

  render() {
    const { left, right, top, bottom, labelPath } = this.state;

    return (
      <svg x={left} y={top} width={right-left} height={bottom-top}>
        <path stroke-width="4" stroke="black" d={labelPath} />
      </svg>
    );
  }
}

export default HorizontAxis;
