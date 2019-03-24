import React, { Component } from 'react';

class VerticalAxis extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={labels: []};

    this.position = props.position;
    this.width = props.width;
    this.lineType = props.lineType;
    this.axisVisible = props.axisVisible;
    this.onchart = props.onchart;
    
    this.ylabels = [];
    instances.axes.push(this);
  }

  calcOffset = ({left, right}) => {
    const { width, yonchart: onchart } = this.props;
    if (left != null){
      if ( onchart !== true){
        return left + width;
      } else {
        return left;
      }
    }
    if (right != null){
      if ( onchart !== true){
        return right - width;
      } else {
        return right;
      }
    }
    throw new Error('Need some value');
  }

  setPosition({ left, right, top, bottom }){
    this.svg.setAttribute('x', left);
    this.svg.setAttribute('y', top);
    this.svg.setAttribute('width', right-left);
    this.svg.setAttribute('height', bottom-top);
  }

  getYLabels = ({ytop, ybottom, ystart, dpi_y}) => {
    const { getYLabels } = this.props;
    if (getYLabels){
      return getYLabels({ytop, ybottom, ystart, dpi_y});
    }

    const ylabels = [];
    const dy = (ytop - ybottom)/(5);
    let step = Math.floor((ystart - ybottom)/dy)*dy || ystart;

    while (step < ytop){
      if ((step >= ybottom) && (step <= ytop)){
        ylabels.push(step);
      }
      step = step + dy;
    }    
    return ylabels;
  }

  calcScale = ({ytop, ybottom, ystart, dpi_y, height_px}) => {
    const ylabels = this.getYLabels({ytop, ybottom, ystart, dpi_y});    
    this.ylabels.length = 0;
    this.ylabels.push(...ylabels);
    
    const labels = ylabels.map( y => {
      const ypi = height_px - (y-ybottom)*dpi_y;
      return {py: Math.floor(ypi), y};
    } );

    this.setState({labels});
  }  

  getYAxisLabel = ({y, py, labelWidth, labelHeight, key, axisWidth, ytop, ybottom, color}) => {
    const { getYAxisLabel } = this.props;
    if (getYAxisLabel){
      return getYAxisLabel({y, py, labelWidth, labelHeight, key, axisWidth, ytop, ybottom });
    }
    return <text x="0" y={py-axisWidth} key={key} style={{'fill': `${color.text}`}} >{`${Math.floor(y)}`}</text>
  }

  render() {
    const { width, axisWidth, ytop, ybottom, debugMode, color } = this.props;
    const { labels } = this.state;

    let labelHeight = 0;
    if (labels.length>1){
      labelHeight = labels[0].py - labels[1].py;
    }  

    let debugComponent = null;
    if (debugMode) {
      let labelPath = '';
      labels.forEach( ({py}) => {
        labelPath = labelPath + `M0 ${py} L${width} ${py} `;
      }); 
    
      debugComponent = (<path strokeWidth={axisWidth} stroke="black" d={labelPath} />);
    }

    return (
      <svg ref={ el => this.svg = el }>
        {debugComponent}
        {
          labels.map( ({y, py}, i) => this.getYAxisLabel({y, py, labelWidth: width, labelHeight, key: i, axisWidth, ytop, ybottom, color})  )
        }
      </svg>
    );
  }
}

export default VerticalAxis;
