import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  AXES_POSITION_TOP
  ,AXES_POSITION_BOTTOM
  ,AXES_POSITION_LEFT
  ,AXES_POSITION_RIGHT
} from './constants';

import withDragSVG from './withdragsvg';


const SVGComponent = React.forwardRef((props, ref) => (
  <svg {...props} ref={ref} />
));
const DragSVG = withDragSVG(SVGComponent);


class View extends Component {
  instances = {
    view: this,
  };

  constructor(props){
    super(props);

    this.updateTimer = null;
    this.prevTouch = {};
  }

  updateDimensions = () => {
    this.needUpdate();
  }

  componentDidMount(){
    window.addEventListener("resize", this.updateDimensions);
    this.fullUpdate();
  }


  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }  

  needUpdate = () => {
    if (!this.updateTimer){
      this.updateTimer = setTimeout(this.onUpdateTimer, 100);
    }
  }

  onUpdateTimer = () => {
    if (this.updateTimer){
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
      this.fullUpdate();
    }
  }

  fullUpdate = () => {
    const inst = this.instances;
    if (!this.viewSVG){
      return;
    }
    const svg = this.viewSVG.SVG;

    const bcr = svg.getBoundingClientRect();
    const width = bcr.width;
    const height = bcr.height;

    const ta = inst.axes.filter( axis => axis.position === AXES_POSITION_TOP );
    const ba = inst.axes.filter( axis => axis.position === AXES_POSITION_BOTTOM );
    const la = inst.axes.filter( axis => axis.position === AXES_POSITION_LEFT );
    const ra = inst.axes.filter( axis => axis.position === AXES_POSITION_RIGHT );

    const topOffset = ta.filter( a => a.onchart !== true ).reduce( (a, axis) => axis.calcOffset({top: a}) , 0 );
    const bottomOffset = ba.filter( a => a.onchart !== true ).reduce( (a, axis) => axis.calcOffset({bottom: a}), height );

    const leftOffset = la.filter( a => a.onchart !== true ).reduce( (a, axis) => axis.calcOffset({left: a}), 0 );
    const rightOffset = ra.filter( a => a.onchart !== true ).reduce( (a, axis) => axis.calcOffset({right: a}), width );

    let top = topOffset;
    let bottom = bottomOffset;    
    let left = leftOffset;    
    let right = rightOffset;
    inst.linesView.setPosition({ left, right, top, bottom });

    top = 0;
    ta.filter( a => a.onchart !== true ).forEach(axis => {
      bottom = top + axis.height;
      axis.setPosition({ left, right, top, bottom });
      top = bottom;
    });
    ta.filter( a => a.onchart !== false ).forEach(axis => {
      bottom = top + axis.height;
      axis.setPosition({ left, right, top, bottom });
      top = bottom;
    });    

    
    bottom = height;
    ba.reverse().filter( a => a.onchart !== true ).forEach(axis => {
      top = bottom - axis.height;
      axis.setPosition({ left, right, top, bottom });
      top = bottom;
    });
    ba.reverse().filter( a => a.onchart !== false ).forEach(axis => {
      top = bottom - axis.height;
      axis.setPosition({ left, right, top, bottom });
      top = bottom;
    });    

    top = topOffset;
    bottom = bottomOffset;    

    left = 0;    
    la.filter( a => a.onchart !== true ).forEach(axis => {
      right = left + axis.width;
      axis.setPosition({ left, right, top, bottom });
      left = right;
    });
    la.filter( a => a.onchart !== false ).forEach(axis => {
      right = left + axis.width;
      axis.setPosition({ left, right, top, bottom });
      left = right;
    });    


    right = width;
    ra.filter( a => a.onchart !== true ).forEach(axis => {
      left = right - axis.width;
      axis.setPosition({ left, right, top, bottom });
      right = left;
    });
    ra.filter( a => a.onchart !== false ).forEach(axis => {
      left = right - axis.width;
      axis.setPosition({ left, right, top, bottom });
      right = left;
    });    

    inst.axisView.calcScale({ width_px: (rightOffset-leftOffset), height_px: (bottomOffset-topOffset) });
  }


  onDragStart = ({clientX, clientY, movementX, movementY}) => {
    const { onDragStart } = this.props;
    if (onDragStart){
      onDragStart({clientX, clientY, movementX, movementY});
    }
  }

  tlgOnDragMove = ({clientX, clientY, movementX, movementY}) => {
    const { OnDragMove } = this.props;
    if (OnDragMove){
      OnDragMove({clientX, clientY, movementX, movementY});
    }    
  }

  onDragEnd = ({clientX, clientY, movementX, movementY}) => {
    const { onDragEnd } = this.props;
    if (onDragEnd){
      onDragEnd({clientX, clientY, movementX, movementY});
    }
  }

  exportToString = () => {
    if (!this.viewSVG){
      return '';
    }

    const svg = this.viewSVG.SVG.cloneNode(true);
    const list = svg.getElementsByTagName("animate");

    
    for (let i = 0; i < list.length; i++) {
      list[i].setAttribute('dur', '0.01s');

    }

    const bcr = this.viewSVG.SVG.getBoundingClientRect();
    const width = bcr.width;
    const height = bcr.height;
    const outerHTML = svg.outerHTML;
    svg.remove();
    
    return `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox='0 0 ${width} ${height}' width='100%' height='100%'><svg width='${width}' height='${height}'>`+outerHTML+'</svg></svg>';
  }

  exportLinesToString = () => {
    if (!this.instances.linesView){
      return '';
    }    

    const svg = this.instances.linesView.svg.cloneNode(true);
    const list = svg.getElementsByTagName("animate");
    
    for (let i = 0; i < list.length; i++) {
      list[i].setAttribute('dur', '0.01s');
    }

    const bcr = this.viewSVG.SVG.getBoundingClientRect();
    const width = bcr.width;
    const height = bcr.height;
    const outerHTML = svg.outerHTML;
    svg.remove();
    
    return `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox='0 0 ${width} ${height}' width='100%' height='100%'><svg width='${width}' height='${height}'>`+outerHTML+'</svg></svg>';
  }  

  render() {
    const {width, height, color} = this.props;
    const { children } = this.props;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances: this.instances })
    );    

    return (
      <DragSVG 
        className={'tlgChartViewSVG'}
        width={width} 
        height={height} 
        ref={ el => this.viewSVG = el }

        tlgOnDragStart={ this.onDragStart }
        tlgOnDragMove={this.tlgOnDragMove}
        tlgOnDragEnd={ this.onDragEnd }
      >  
        {childrenWithProps}
      </DragSVG>
    );
  }
}

View.propTypes = {
  // Ширина
  width: PropTypes.number,
  // Высота
  height: PropTypes.number,
  // Цвет
  color: PropTypes.object,
}

export default View;
