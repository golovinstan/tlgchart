import React, { Component } from 'react';

class VerticalBox extends Component {
  constructor(props){
    const { instances } = props;
    super(props);
    instances.lines.push(this);
    this.dragging = false;    

    this.state = {leftvalue_px: null, rightvalue_px: null};
  }

  componentDidMount(){
    const { instances } = this.props;
    instances.onDragListeners.push(this.onDrag);
    instances.onEndDragListeners.push(this.onEndDrag);
  }  

  onMouseDown = (e) => {
    this.dragging = true;
  }

  onMouseUp = (e) => {
    this.dragging = false;
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

  calcPath = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
    const { leftvalue, rightvalue } = this.props;
    this.setState({ leftvalue_px: (leftvalue-xleft)*dpi_x, rightvalue_px: (rightvalue-xleft)*dpi_x });

    this.dpi_x = dpi_x;
    this.xleft = xleft;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    const { leftvalue, rightvalue } = this.props;
    const { leftvalue: leftold, rightvalue: rightold } = prevProps;

    if ((leftold !== leftvalue) || (rightvalue !== rightold)){
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

            onMouseLeave={ this.onMouseLeave  }
            onMouseDown={ this.onMouseDown }
            onMouseUp={ this.onMouseUp }                
        />
    );
  }
}           

export default VerticalBox;
