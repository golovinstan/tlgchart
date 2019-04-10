import React, { Component } from 'react';

class Axes extends Component {
  constructor(props){
    super(props);
    const { instances } = props;

    this.dpi_x = 0;
    this.dpi_y = 0;    

    instances.axisView = this;
    instances.axes = [];
  } 

  componentDidUpdate(){
    const { instances } = this.props;
    instances.view.needUpdate();
  }

  calcScale = ({width_px, height_px}) => {
    const { instances, xleft, xright, xstart, ytop, ybottom, ystart } = this.props;

    const dpi_x = width_px/(xright-xleft);
    const dpi_y = height_px/(ytop-ybottom);

    this.dpi_x = dpi_x;
    this.dpi_y = dpi_y;

    const args = {xleft, xright, xstart, ytop, ybottom, ystart, dpi_x, dpi_y, height_px};
    instances.axes.forEach( axis => axis.calcScale(args) );
    instances.linesView.calcScale({dpi_x, dpi_y, xleft, xright, ytop, ybottom, height_px, width_px});
    let ykey = 0;
    let xkey = 0;
    instances.axes.forEach( (axis) => {
      if (axis.ylabels){
        instances.linesView.calcYAxisLine({ylabels: axis.ylabels, lineType: axis.lineType, ybottom, dpi_y, key: ykey, axisVisible: axis.axisVisible, height_px });
        ykey = ykey + 1;
      } else {
        instances.linesView.calcXAxisLine({xlabels: axis.xlabels, lineType: axis.lineType, xleft, dpi_x, key: xkey, axisVisible: axis.axisVisible});
        xkey = xkey + 1;
      }
    });
    instances.linesView.drawAxisLine({xlength: xkey, ylength: ykey});
  }


  render() {
    const { children, instances, xonchart, yonchart, xleft, xright, ytop, ybottom } = this.props;
    
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances, xonchart, yonchart, xleft, xright, ytop, ybottom })
    );     

    return (
      <svg 
        className={'tlgChartAxisSVG'}
        width={"100%"} 
        height={"100%"}
      >
        {childrenWithProps}
      </svg>
    );
  }
}

export default Axes;
