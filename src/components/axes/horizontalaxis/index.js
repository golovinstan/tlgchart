import React, { Component } from 'react';

class HorizontAxis extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={ xlabels: [] };

    this.position = props.position;
    this.height = props.height;
    this.scalecount = props.scalecount;
    instances.axes.push(this);
  }    

  calcOffset = ({top, bottom}) => {
    const { height, xonchart: onchart } = this.props;
    if (top != null){
      if (onchart !== true){
        return top + height;
      } else {
        return top;
      }
    }
    if (bottom != null){
      if (onchart !== true){
        return bottom - height;
      } else {
        return bottom;
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

  calcScale = ({xleft, xright, xstart, dpi_x}) => {
    const { scalecount } = this.props;
    const dx = (xright - xleft)/(scalecount);
    let step = Math.floor((xstart - xleft)/dx)*dx || xstart;
    const xlabels = [];

    while (step < xright){
      if ((step >= xleft) && (step <= xright)){
        const xpi = (step-xleft)*dpi_x;
        xlabels.push({px: Math.floor(xpi), x: step});
      }
      step = step + dx;
    }

    this.setState({xlabels});
  } 

  getAxisLabel = ({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright }) => {
    const { getAxisLabel } = this.props;
    if (getAxisLabel){
      return getAxisLabel({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright });
    }    
    return <text x={px} y={labelHeight/2} key={key} >{`${Math.floor(x)}`}</text>
  }

  render() {
    const { height, axisWidth, xleft, xright } = this.props;
    const { xlabels } = this.state;

    let labelPath = '';
    xlabels.forEach( ({px}) => {
      labelPath = labelPath + `M${px} 0 L${px} ${height} `;
    }); 
    let labelWidth = 0;
    if (xlabels.length>1){
      labelWidth = xlabels[1].px - xlabels[0].px;
    }    

    return (
      <svg ref={ el => this.svg = el }>
        <path strokeWidth="4" stroke="black" d={labelPath} />
        {
          xlabels.map( ({x, px}, i) => this.getAxisLabel({x, px, labelHeight: height, labelWidth, key: i, axisWidth, xleft, xright})  )
        }        
      </svg>
    );
  }
}

export default HorizontAxis;
