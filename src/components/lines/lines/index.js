import React, { Component } from 'react';

class Lines extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={left:0, top:0, right:1, bottom:1 };    

    instances.linesView = this;
    instances.lines = [];
  }

  setPosition({ left, right, top, bottom }){
    this.svg.setAttribute('x', left);
    this.svg.setAttribute('y', top);
    this.svg.setAttribute('width', right-left);
    this.svg.setAttribute('height', bottom-top);
  }

  calcScale = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
    const { instances } = this.props;
    instances.lines.forEach( line => line.calcPath({dpi_x, dpi_y, xleft, xright, ytop}) );
  }

  render() {
    const { children, instances } = this.props;
    
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances })
    );        

    return (
    <svg ref={ el => this.svg = el }>
      {childrenWithProps}
    </svg>);
  }
}

export default Lines;
