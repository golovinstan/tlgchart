import React, { Component } from 'react';

class Line extends Component {
  constructor(props){
    const { instances, xvalues, yvalues } = props;
    super(props);
    instances.lines.push(this)    

    if (xvalues.length !== yvalues.length) {
      throw new Error('Wrong data size');
    }

    this.state = {xvalues_px: null, yvalues_px: null};
  }

  calcPath = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
    const { xvalues, yvalues } = this.props;

    const px_offset = xleft*dpi_x;
    const py_offset = ytop*dpi_y;

    const indxs = xvalues
    .map( (x,i) => ({x,i}) )
    .filter( ({x}) => x>xleft && x<xright )
    .map( ({i}) => i );

    const xvalues_px = xvalues
    .filter( (x,i) => indxs.includes(i) )
    .map( x => (x-xleft)*dpi_x );

    const yvalues_px = yvalues
    .filter( (y,i) => indxs.includes(i) ) 
    .map( y => (ytop-y)*dpi_y )

    this.setState({xvalues_px, yvalues_px});
  }

  render() {
    const { xvalues_px, yvalues_px } = this.state;

    if (!xvalues_px || !yvalues_px){
      return null;
    }

    let pathData = `M${xvalues_px[0]} ${yvalues_px[0]}`;
    for (let i=1; i<xvalues_px.length; i++){
      pathData = pathData + ` L${xvalues_px[i]} ${yvalues_px[i]}`
    }        

    return (
      <path fill="none"  strokeWidth="4" stroke="black" d={pathData} />
    );
  }
}

export default Line;
