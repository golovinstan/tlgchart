import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HorizontAxis extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={ labels: [] };

    this.position = props.position;
    this.height = props.height;
    this.lineType = props.lineType;
    this.axisVisible = props.axisVisible;
    this.onchart = props.onchart;

    this.xlabels = [];
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

  getXLabels = ({xleft, xright, xstart, dpi_x}) => {
    const { getXLabels } = this.props;
    if (getXLabels){
      return getXLabels({xleft, xright, xstart, dpi_x});
    }

    const dx = (xright - xleft)/(5);
    let step = Math.floor((xstart - xleft)/dx)*dx || xstart;

    let xlabels = [];
    while (step < xright){
      if ( (step >= xleft) && (step <= xright)  ){
        xlabels.push(step);
      }
      step = step + dx;                 
    }
    return xlabels;
  }

  calcScale = ({xleft, xright, xstart, dpi_x}) => {
    const xlabels = this.getXLabels({xleft, xright, xstart, dpi_x});
    this.xlabels.length = 0;
    this.xlabels.push(...xlabels);

    const labels = xlabels.map( x => {
      const xpi = (x-xleft)*dpi_x;
      return {px: Math.floor(xpi), x};
    });

    this.setState({labels});
  } 

  getAxisLabel = ({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright, color }) => {
    const { getAxisLabel } = this.props;
    if (getAxisLabel){
      return getAxisLabel({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright, color });
    }    
    return <text x={px} y={labelHeight/2} key={key} fill={color.text} >{`${Math.floor(x)}`}</text>
  }

  render() {
    const { height, axisWidth, xleft, xright, debugMode, color } = this.props;
    const { labels } = this.state;

    let labelWidth = 0;
    if (labels.length>1){
      labelWidth = labels[1].px - labels[0].px;
    }    

    let debugComponent = null;
    if (debugMode) {
      let labelPath = '';
      labels.forEach( ({px}) => {
        labelPath = labelPath + `M${px} 0 L${px} ${height} `;
      }); 
    
      debugComponent = (<path strokeWidth={axisWidth} stroke="black" d={labelPath} />);
    }


    return (
      <svg ref={ el => this.svg = el }>
        {debugComponent}
        {
          labels.map( ({x, px}, i) => this.getAxisLabel({x, px, labelHeight: height, labelWidth, key: i, axisWidth, xleft, xright, color})  )
        }        
      </svg>
    );
  }
}


HorizontAxis.propTypes = {
  // расположение оси AXES_POSITION_TOP - AXES_POSITION_BOTTOM - AXES_POSITION_LEFT - AXES_POSITION_RIGHT
  position: PropTypes.object,
  // высота оси
  height: PropTypes.number,
  // тип линий оси
  lineTyp: PropTypes.object,
  // callback для вывода меток на оси
  getAxisLabel: PropTypes.func,
  // callback получения значений Х позиций меток на оси Х
  getXLabels: PropTypes.func,
  // Режим отладки, при котором отображаются метки Х позиций и вспомогательная информация
  debugMode: PropTypes.bool,
  // ТОлщина линии
  axisWidth: PropTypes.number,
  // Видимость оси (при этом ось участвует в рассчете позиций)
  axisVisible: PropTypes.bool,
  // Ось распологается на графике
  onchart: PropTypes.bool,
  // Объект параметров ццветов
  color: PropTypes.object,
}

export default HorizontAxis;
