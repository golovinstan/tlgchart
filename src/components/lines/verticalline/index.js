import React, { Component } from 'react';
import withDragSVG from '../../hoc/withdragsvg';

const LineComponent = React.forwardRef((props, ref) => (
  <line {...props} ref={ref} />
));
const LineSVG = withDragSVG(LineComponent);

class VerticalLine extends Component {
  constructor(props){
    const { instances } = props;
    super(props);
    instances.lines.push(this)    
    this.dragging = false;

    this.state = {xvalue_px: null};
  }

  componentDidMount(){
    const { instances } = this.props;
    instances.onDragListeners.push(this.onDrag);
    instances.onEndDragListeners.push(this.onEndDrag);
  }


  calcPath = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
    const { xvalue } = this.props;
    this.setState({ xvalue_px: (xvalue-xleft)*dpi_x });

    this.dpi_x = dpi_x;
    this.xleft = xleft;
  }


  onEndDrag = () => {
    this.dragging = false;
  }

  onDrag = ({movementX, clientX}) => {
    const { onDrag } = this.props;      
    if (onDrag && this.dragging){
        onDrag({x: clientX/this.dpi_x+this.xleft , dx: movementX/this.dpi_x });
    } 
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

  tlgOnDragStart = () => {
    this.dragging = true;
  }

  tlgOnDragEnd = () => {
    this.dragging = false;
  }

  render() {
    const { xvalue_px } = this.state;
    const { color, width, opacity, offset } = this.props;

    if (!xvalue_px){
      return null;
    }

    return (
        <LineSVG 
            x1={xvalue_px+offset} 
            y1={0} 
            x2={xvalue_px+offset} 
            y2={'100%'} 
            stroke={color}
            strokeWidth={width}
            strokeOpacity={opacity}
            color={color}

            tlgOnDragStart={ this.tlgOnDragStart }
            tlgOnDragEnd={ this.tlgOnDragEnd }              
        />
    );
  }
}           

export default VerticalLine;
