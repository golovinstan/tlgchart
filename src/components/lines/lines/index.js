import React, { Component } from 'react';

class Lines extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.ylabels = [];
    this.xlabels = [];
    this.state = { axisDrawCount: 0 };

    this.childCount = props.children.length;

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

  calcYAxisLine = ({ylabels, lineType, ybottom, dpi_y, key, axisVisible, height_px}) => {
    const labels = ylabels.map( y => {
      return {ypx: height_px-(y-ybottom)*dpi_y, lineType}
    });
    this.ylabels[key] = axisVisible?labels:[];
  }

  calcXAxisLine = ({xlabels, lineType, xleft, dpi_x, key, axisVisible}) => {
    const labels = xlabels.map( x => {
      return {xpx: (x-xleft)*dpi_x, lineType}
    });
    this.xlabels[key] = axisVisible?labels:[];
  }

  drawAxisLine = ({xlength, ylength}) => {
    const { axisDrawCount } = this.state;
    this.ylabels.length = ylength;
    this.xlabels.length = xlength;
    this.setState({axisDrawCount: (axisDrawCount+1)});
  } 

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { instances } = this.props;

    if (this.childCount !== this.props.children.length) {
      this.childCount = this.props.children.length;
      instances.view.needUpdate();
    }

  }

  render() {
    const { children, instances } = this.props;
    
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances })
    );        

    return (
    <svg ref={ el => this.svg = el } >
      {childrenWithProps}
      {
        this.ylabels.filter( lb => !!lb).map( lb => lb.map( ({ypx, lineType}) => {
          return (
            <line 
              x1={0} 
              y1={ypx} 
              x2="100%" 
              y2={ypx} 
              stroke="gray" 
              strokeDasharray={lineType.strokeDasharray} 
              fillOpacity={lineType.fillOpacity} 
              strokeOpacity={lineType.strokeOpacity} 
            />
          );
        } ) )
      }
      {
        this.xlabels.filter( lb => !!lb).map( lb => lb.map( ({xpx, lineType}) => {
          return (
            <line 
              x1={xpx} 
              y1={0} 
              x2={xpx} 
              y2={'100%'} 
              stroke="black" 
              strokeDasharray={lineType.strokeDasharray} 
              fillOpacity={lineType.fillOpacity} 
              strokeOpacity={lineType.strokeOpacity} 
            />
          );
        } ) )
      }      
    </svg>);
  }
}

export default Lines;