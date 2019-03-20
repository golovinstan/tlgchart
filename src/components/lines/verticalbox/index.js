import React, { Component } from 'react';

class VerticalBox extends Component {
  constructor(props){
    const { instances } = props;
    super(props);
    instances.lines.push(this)    

    this.state = {leftvalue_px: null, rightvalue_px: null};
  }


  calcPath = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
    const { leftvalue, rightvalue } = this.props;
    this.setState({ leftvalue_px: (leftvalue-xleft)*dpi_x, rightvalue_px: (rightvalue-xleft)*dpi_x });

    this.dpi_x = dpi_x;
    this.xleft = xleft;
  }


  componentDidUpdate(prevProps, prevState, snapshot){
    const { leftvalue, rightvalue } = this.props;
    const { leftvalue: leftold, rightvalue: rightold } = prevProps;

    if ((leftold != leftvalue) || (rightvalue != rightold)){
        const dpi_x = this.dpi_x;
        const xleft = this.xleft;
        this.setState({ leftvalue_px: (leftvalue-xleft)*dpi_x, rightvalue_px: (rightvalue-xleft)*dpi_x });
    }
  }

  render() {
    const { leftvalue_px, rightvalue_px } = this.state;
    const { color, opacity } = this.props;

    if ((leftvalue_px == null) || (rightvalue_px == null)){
      return null;
    }

    return (
        <rect 
            x={leftvalue_px}
            width={rightvalue_px-leftvalue_px}
            y={0}
            height={'100%'}

            fill={color}
            fillOpacity={opacity}
        />
    );
  }
}           

export default VerticalBox;
