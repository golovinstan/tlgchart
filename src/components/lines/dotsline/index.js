import React, { Component } from 'react';

class DotsLine extends Component {
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

    if (!xvalues_px || !yvalues_px || (xvalues_px.length !== yvalues_px.length) ){
      return null;
    }

    return (
      <svg x={0} y={0} width={'100%'} height={'100%'}>
        {
            xvalues_px.map( (e,i) => {
                return (<circle cx={xvalues_px[i]} cy={yvalues_px[i]} r={"5"} stroke={"red"} fill={"transparent"} />);
            } )

        }
      </svg>
    );
  }
}

export default DotsLine;
