import React, { Component } from 'react';

import { getMarkerXMinIndex } from './utils';

class BarAreaLine extends Component {
  constructor(props){
    const { instances, xvalues, yvalues1, yvalues2 } = props;
    super(props);
    instances.lines.push(this)    

    if ((xvalues.length !== yvalues1.length) || (xvalues.length !== yvalues2.length)) {
      throw new Error('Wrong data size');
    }

    this.state = {xvalues_px: null, yvalues_px: null};
  }

  calcPath = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
    const { xvalues, yvalues1, yvalues2 } = this.props;

    const indxs = xvalues
    .map( (x,i) => ({x,i}) )
    .filter( ({x}) => x>xleft && x<xright )
    .map( ({i}) => i );

    const xvalues_px = xvalues
    .filter( (x,i) => indxs.includes(i) )
    .map( x => (x-xleft)*dpi_x );

    const yvalues1_px = yvalues1
    .filter( (y,i) => indxs.includes(i) ) 
    .map( y => (ytop-y)*dpi_y )

    const yvalues2_px = yvalues2
    .filter( (y,i) => indxs.includes(i) ) 
    .map( y => (ytop-y)*dpi_y )    

    this.setState({xvalues_px, yvalues1_px, yvalues2_px});
  }

  render() {
    const { xvalues_px, yvalues1_px, yvalues2_px } = this.state;
    const { color, width, visible } = this.props;

    if (visible !== true){
      return null;
    }

    if (!xvalues_px || !yvalues1_px || !yvalues2_px || (xvalues_px.length !== yvalues1_px.length) || (xvalues_px.length !== yvalues2_px.length) ){
      return null;
    }

    let pathData = `M${xvalues_px[0]} ${yvalues1_px[0]}`;
    for (let i=1; i<xvalues_px.length; i++){
        pathData = pathData + ` L${xvalues_px[i]} ${yvalues1_px[i-1]} L${xvalues_px[i]} ${yvalues1_px[i]}`
    }        
    for (let i=xvalues_px.length-1; i>0; i--){
        pathData = pathData + ` L${xvalues_px[i]} ${yvalues2_px[i]} L${xvalues_px[i]} ${yvalues2_px[i-1]}`
    }
    pathData = pathData + ` L${xvalues_px[0]} ${yvalues2_px[0]}`;

    return (
        <path fill={color}  strokeWidth={width} stroke={`${color}`} d={pathData} />
    );
  }
}

export default BarAreaLine;
