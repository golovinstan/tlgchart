import React, { Component } from 'react';
import withDragSVG from './withdragsvg';

const RectComponent = React.forwardRef((props, ref) => (
  <rect {...props} ref={ref} />
));
const RectSVG = withDragSVG(RectComponent);

class VerticalBox extends Component {
  constructor(props){
    const { instances } = props;
    super(props);
    instances.lines.push(this);

    this.state = {leftvalue_px: null, rightvalue_px: null};
  }


  onDragMove = ({movementX, clientX}) => {
    const { onDrag, instances } = this.props;    
    const dpi_x = instances.axisView.dpi_x;

    if (onDrag){
      onDrag({x: clientX/dpi_x+this.xleft , dx: movementX/dpi_x });
    }   
  }  

  calcPath = ({xleft, xright, ytop}) => {
    const { leftvalue, rightvalue, instances } = this.props;
    const dpi_x = instances.axisView.dpi_x;
    this.setState({ leftvalue_px: (leftvalue-xleft)*dpi_x, rightvalue_px: (rightvalue-xleft)*dpi_x });

    this.xleft = xleft;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    const { leftvalue, rightvalue, instances } = this.props;
    const { leftvalue: leftold, rightvalue: rightold } = prevProps;

    if ((leftold !== leftvalue) || (rightvalue !== rightold)){
        const dpi_x = instances.axisView.dpi_x;

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
        <RectSVG 
            x={leftvalue_px}
            width={rightvalue_px-leftvalue_px}
            y={0}
            height={'100%'}

            fill={color}
            fillOpacity={opacity}

            tlgOnDragMove={ this.onDragMove }            
        />
    );
  }
}           

export default VerticalBox;
