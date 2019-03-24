import React, { Component } from 'react';
import {
  AXES_POSITION_TOP
  ,AXES_POSITION_BOTTOM
  ,AXES_POSITION_LEFT
  ,AXES_POSITION_RIGHT
} from '../axes/constants';

class View extends Component {
  instances = {
    view: this,
    onDragListeners: [],
    onEndDragListeners: []
  };

  constructor(props){
    super(props);

    this.dragging = false;
    this.updateTimer = null;
  }

  updateDimensions = () => {
    this.needUpdate();
  }

  componentDidMount(){
    window.addEventListener("resize", this.updateDimensions);
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
    const svg = this.viewSVG;

    const width = svg.clientWidth;
    const height = svg.clientHeight;

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

  onMouseMove = (e) => {
    const {movementX, clientX, movementY, clientY} = e;
    if (this.dragging){
      this.instances.onDragListeners.forEach( listener => listener({movementX, clientX, movementY, clientY, dragging: this.dragging}) );
    }
  }

  endDragListeners = () => {
    this.dragging = false;
    this.instances.onEndDragListeners.forEach( listener => listener() );
  }

  onMouseLeave = (e) => {
    this.endDragListeners();
  }

  onMouseUp = (e) => {
    this.endDragListeners();
  }     

  onMouseDown = (e) => {
    this.dragging = true;
    this.instances.axisView.onMouseDown(e);
  }

  render() {
    const {width, height, color} = this.props;
    const { children } = this.props;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances: this.instances })
    );    

    return (
      <svg 
        width={width} 
        height={height} 
        style={{'background-color': `${color?color.background:''}`}}
        ref={ el => this.viewSVG = el }
        onresize={this.updateDimensions}

        onMouseMove={ this.onMouseMove  }
        onMouseLeave={ this.onMouseLeave  }
        onMouseDown={ this.onMouseDown }
        onMouseUp={ this.onMouseUp }  
      >
        {childrenWithProps}
      </svg>
    );
  }
}

export default View;
