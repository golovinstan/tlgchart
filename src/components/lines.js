import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Lines extends Component {
  constructor(props){
    super(props);
    const { instances } = props;

    this.animVB = {ytop:0, ybottom:0};
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

  animViewBox = ({height_px, width_px, ytop, ybottom, dpi_y}) => {
    const ytop_prev = this.animVB.ytop;
    const ybottom_prev = this.animVB.ybottom;
    this.animVB.ytop = ytop;
    this.animVB.ybottom = ybottom;

    const dytop = Math.floor((ytop_prev-ytop)*dpi_y);
    const dybottom = Math.floor((ybottom_prev-ybottom)*dpi_y);

    const w = Math.floor(width_px);
    const vb = `0 ${-dytop} ${w} ${height_px+dybottom+dytop}`;
    const new_vb = `${vb}; 0 0 ${w} ${height_px}`;
    this.svg.setAttribute("viewBox", vb);
    this.svg_anim.setAttribute("values", new_vb);
    this.svg_anim.beginElement();
    //this.svg.forceRedraw();
  }

  calcScale = ({dpi_x, dpi_y, xleft, xright, ytop, ybottom, height_px, width_px}) => {
    const { instances } = this.props;
    
    this.animViewBox({height_px, width_px, ytop, ybottom, dpi_y });
    setTimeout( () => instances.lines.forEach( line => line.calcPath({dpi_x, dpi_y, xleft, xright, ytop}) ), 1);
    // instances.lines.forEach( line => line.calcPath({dpi_x, dpi_y, xleft, xright, ytop}));
    
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
    const { children, instances, animtime } = this.props;
    
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances })
    );        

    return (
    <svg 
      className={'tlgChartLinesSVG'}
      ref={ el => this.svg = el }
      viewBox={"0 0 1 1"}
      preserveAspectRatio={"none"}
    >
      <animate ref={ el => this.svg_anim = el } values={""} attributeName={"viewBox"} begin={"0s"} dur={animtime?animtime:"0.5s"} fill={"freeze"}/>
      {childrenWithProps}
      {
        this.ylabels.filter( lb => !!lb).map( lb => lb.map( ({ypx, lineType}) => {
          return (
            <line 
              x1={0} 
              y1={ypx} 
              x2={"100%"} 
              y2={ypx} 
              stroke={"gray"} 
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
              stroke={"black"} 
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

Lines.defaultProps = {
  animtime: "0.01s",
};

Lines.propTypes = {
  // Время анимации показа графика
  animtime: PropTypes.string,
}

export default Lines;
