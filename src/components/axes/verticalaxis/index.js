import React, { Component } from 'react';
import PropTypes from 'prop-types';



class DisableLabel extends Component {
  state = { complete: false }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevProps.old_py !== this.props.old_py){
      this.setState({complete: false})
    }
  }

  render(){
    const { getYAxisLabel, y, new_py, old_py, labelWidth, labelHeight, key, axisWidth, ytop, ybottom, color } = this.props;
    const { complete } = this.state;

    if (complete === true){
      return null;
    }

    setTimeout(() => this.setState({complete: true}), 400);

    return (
      <g key={key} >

        {
          getYAxisLabel({y: y, py: new_py, labelWidth, labelHeight, key, axisWidth, ytop, ybottom, color})
        }

        <animateTransform attributeName="transform"
          type="translate"
          from={`0 `}
          to={`0 ${(old_py-new_py)*10}`}
          begin={`0.0s`}
          dur="0.4s"
          repeatCount="indefinite"
        />

    </g>
    );
  }
}



class VerticalAxis extends Component {
  constructor(props){
    super(props);
    const { instances } = props;
    this.state={labels: [], ylabels_old: []};

    this.position = props.position;
    this.width = props.width;
    this.lineType = props.lineType;
    this.axisVisible = props.axisVisible;
    this.onchart = props.onchart;
    
    this.ylabels = [];
    this.oldlabels= [];
    this.crntlabels= [];

    this.new_render=false;
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
    const { labels: labels_old } = this.state;
    const ylabels = this.getYLabels({ytop, ybottom, ystart, dpi_y});    

    const ylabels_old = labels_old.map ( ({y}) => {
      const ypi = height_px - (y-ybottom)*dpi_y;
      return {py: Math.floor(ypi), y};      
    } );

    this.ylabels.length = 0;
    this.ylabels.push(...ylabels);
    
    const labels = ylabels.map( y => {
      const ypi = height_px - (y-ybottom)*dpi_y;
      return {py: Math.floor(ypi), y};
    } );

    this.setState({labels, ylabels_old});
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
    const { labels, ylabels_old } = this.state;

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



    const ind = [];
    for ( let i=0; i<Math.min(ylabels_old.length, labels.length); i++){
      ind.push(i);
    }


    return (
      <svg ref={ el => this.svg = el }>
        {debugComponent}
        {
          ind.map( i => {
            const oldl = ylabels_old[i];
            const newl = labels[i];

            return (<DisableLabel
              getYAxisLabel={this.getYAxisLabel}
              y={oldl.y}
              new_py={newl.py}
              old_py={oldl.py}
              labelWidth={width}
              labelHeight={labelHeight}
              key={i}
              axisWidth={axisWidth}
              ytop={ytop}
              ybottom={ybottom}
              color={color}
            />);

            return (
              <g key={i} >

                {
                  this.getYAxisLabel({y: oldl.y, py: newl.py, labelWidth: width, labelHeight, key: i, axisWidth, ytop, ybottom, color})
                }

                <animateTransform attributeName="transform"
                  type="translate"
                  from={`0 `}
                  to={`0 ${newl.py-oldl.py}`}
                  begin={`0.00s`}
                  dur="0.2s"
                  repeatCount="indefinite"
                />

              </g>
            )
          })
        }
        {
          labels.map( ({y, py}, i) => this.getYAxisLabel({y, py, labelWidth: width, labelHeight, key: i, axisWidth, ytop, ybottom, color})  )
        }      
      </svg>
    );
  }
}

VerticalAxis.propTypes = {
  // расположение оси AXES_POSITION_TOP - AXES_POSITION_BOTTOM - AXES_POSITION_LEFT - AXES_POSITION_RIGHT
  position: PropTypes.object,
  // ширина оси
  width: PropTypes.number,
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

export default VerticalAxis;
