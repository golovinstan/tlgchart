import React, { Component } from 'react';

class VerticalLine extends Component {
  constructor(props){
    const { instances } = props;
    super(props);
    instances.lines.push(this)    

    this.state = {xvalue_px: null};
    this.dragging = false;
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


  componentDidUpdate(prevProps, prevState, snapshot){
    const { xvalue } = this.props;
    const { xvalue: oldx } = prevProps;

    if (oldx != xvalue){
        const dpi_x = this.dpi_x;
        const xleft = this.xleft;
        this.setState({ xvalue_px: (xvalue-xleft)*dpi_x });
    }
  }

  render() {
    const { xvalue_px } = this.state;
    const { color, width } = this.props;

    if (!xvalue_px){
      return null;
    }

    return (
        <line 
            x1={xvalue_px} 
            y1={0} 
            x2={xvalue_px} 
            y2={'100%'} 
            stroke={color}
            strokeWidth={width}

            onMouseLeave={ this.onMouseLeave  }
            onMouseDown={ this.onMouseDown }
            onMouseUp={ this.onMouseUp }             
        />
    );
  }
}           

export default VerticalLine;
