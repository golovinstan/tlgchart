import React, { Component } from 'react';
import withDragSVG from './withdragsvg';

const LineComponent = React.forwardRef((props, ref) => (
  <line {...props} ref={ref} />
));
const LineSVG = withDragSVG(LineComponent);

class VerticalLine extends Component {
  constructor(props){
    const { instances } = props;
    super(props);
    instances.lines.push(this)    

    this.state = {xvalue_px: null};
  }



  calcPath = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
    const { xvalue } = this.props;
    this.setState({ xvalue_px: (xvalue-xleft)*dpi_x });

    this.dpi_x = dpi_x;
    this.xleft = xleft;
  }


  componentDidUpdate(prevProps, prevState, snapshot){
    const { xvalue } = this.props;
    const { xvalue: oldx } = prevProps;

    if (oldx !== xvalue){
        const dpi_x = this.dpi_x;
        const xleft = this.xleft;
        this.setState({ xvalue_px: (xvalue-xleft)*dpi_x });
    }
  }

  tlgOnDragMove = ({movementX, clientX}) => {
    const { onDrag, instances } = this.props;      
    const dpi_x = instances.axisView.dpi_x;

    if (onDrag){
        onDrag({x: clientX/dpi_x+this.xleft , dx: movementX/dpi_x });
    } 
  }

  render() {
    const { xvalue_px } = this.state;
    const { color, width, opacity } = this.props;

    if (!xvalue_px){
      return null;
    }

    return (
        <LineSVG 
            x1={xvalue_px} 
            y1={0} 
            x2={xvalue_px} 
            y2={'100%'} 
            stroke={color}
            strokeWidth={width}
            strokeOpacity={opacity}
            color={color}

            tlgOnDragMove={ this.tlgOnDragMove }                        
        />
    );
  }
}           

export default VerticalLine;
