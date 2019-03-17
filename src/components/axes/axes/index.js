import React, { Component } from 'react';

class Axes extends Component {
  constructor(props){
    super(props);
    const { instances } = props;

    instances.axisView = this;
    instances.axes = [];
  } 

  calcScale = ({width_px, height_px}) => {
    const { instances, xleft, xright, xstart, ytop, ybottom, ystart } = this.props;

    const dpi_x = width_px/(xright-xleft);
    const dpi_y = height_px/(ytop-ybottom);

    const args = {xleft, xright, xstart, ytop, ybottom, ystart, dpi_x, dpi_y, height_px};
    instances.axes.forEach( axis => axis.calcScale(args) );
    instances.linesView.calcScale({dpi_x, dpi_y, xleft, xright, ytop});
  }

  render() {
    const { children, instances, xonchart, yonchart, xleft, xright, ytop, ybottom } = this.props;
    
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances, xonchart, yonchart, xleft, xright, ytop, ybottom })
    );     

    return (
      <svg width={500} height={500}>
        {childrenWithProps}
      </svg>
    );
  }
}

export default Axes;
