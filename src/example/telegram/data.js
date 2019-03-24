import React, { Component } from 'react';
import View from '../../components/view';

import Lines from '../../components/lines/lines';
import SimpleLine from '../../components/lines/simpleline';
import VerticalLine from '../../components/lines/verticalline';
import DotsLine from '../../components/lines/dotsline';

import BackgroundColor from '../../components/misc/background';


import Axes from '../../components/axes/axes';
import VericalAxis from '../../components/axes/verticalaxis';
import HorizontalAxis from '../../components/axes/horizontalaxis';
import LeftMarkerLabel from './leftlabelmarker';
import RightMarkerLabel from './rightlabelmarker';

import { 
  ASES_FORMAT_INDEX 
  ,AXES_POSITION_LEFT
  ,AXES_POSITION_BOTTOM
  ,AXES_POSITION_TOP
  ,AXES_LINE_LINE
  ,AXES_LINE_DOT_LINE
} from '../../components/axes/constants';

const monthNames = [
  "Jan", 
  "Feb", 
  "Mar", 
  "Apr", 
  "May", 
  "Jun",
  "Jul", 
  "Aug", 
  "Sep", 
  "Oct", 
  "Nov", 
  "Dec"
];

const weekday = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];


class DataChart extends Component {
  constructor(props){
    super(props);

    const { markerX1, markerX2, xvalues, lines, selected} = props;

    this.xvalues = xvalues;
    this.lines = lines;

    const {ymin, ymax, xmin, xmax} = this.calcMinMax({xvalues, lines, selected, markerX1, markerX2});

    this.xlabels = [];
    this.anim = [];    

    this.state = {
      markerX1,
      markerX2,
      dotLines: [],
      ymin, 
      ymax,
      xmin,
      xmax
    };

    setInterval(this.onInterval, 50);
  }

  onInterval = () => {
    const frame = this.anim.shift();
    if (frame){
      this.setState({...frame});
    }
  }  

  animMinMax = ({ymin, ymax, xmin, xmax}) => {
    const {
      ymin: yminPrev, 
      ymax: ymaxPrev, 
      xmin: xminPrev, 
      xmax: xmaxPrev,      
    } = this.state;

    const dymin = (yminPrev - ymin)/10;
    const dymax = (ymaxPrev - ymax)/10;
    const dxmin = (xminPrev - xmin)/10;
    const dxmax = (xmaxPrev - xmax)/10;

    const anim = [1,2,3,4,5,6,7,8,9].map( ind => ({
      ymin: yminPrev-dymin*ind,
      ymax: ymaxPrev-dymax*ind, 
      xmin: xminPrev-dxmin*ind,
      xmax: xmaxPrev-dxmax*ind
    }) );
    anim.push({ymin, ymax, xmin, xmax});

    this.anim.length = 0;
    this.anim.push(...anim);
  }

  calcMinMax = ({xvalues, lines, selected, markerX1, markerX2}) => {
    const inds = xvalues.map( (v,i) => ({value: v, ind: i}) ).filter( ({value}) => value>markerX1 && value<markerX2).map( ({ind}) => ind );

    const xmin = Math.min(...inds.map( i => xvalues[i] ));
    const xmax = Math.max(...inds.map( i => xvalues[i] ));    

    const visLines = lines.filter( line => selected.map(sl=>sl.name).includes(line.name) )


    const ymin = Math.min( ...visLines.map( line => Math.min(...inds.map( i => line.yvalues[i] )) ) );
    const ymax = Math.max( ...visLines.map( line => Math.max(...inds.map( i => line.yvalues[i] )) ) );

    return {ymin, ymax, xmin, xmax};
  }  
  
  componentDidUpdate(prevProps, prevState, snapshot){
    const {xvalues, lines, selected, markerX1, markerX2} = this.props;
    const {selected: selectedPrev, markerX1: markerX1Prev , markerX2: markerX2Prev} = prevProps;

    const names = selectedPrev.map( sel => sel.name );
    const equal = (selected.length === selectedPrev.length) && selected.reduce( (a, sel) => a && names.includes( sel.name ), true );

    if ((equal !== true) || (markerX1 !== markerX1Prev) || (markerX2 !== markerX2Prev) ) {
      const {ymin, ymax, xmin, xmax} = this.calcMinMax({xvalues, lines, selected, markerX1, markerX2 });
      this.animMinMax({ymin, ymax, xmin, xmax});
    }
  }  


  componentDidMount(){
    const marker = this.xvalues[Math.floor(this.xvalues.length/2)];
    this.updateMarker({marker})
  }

  getXLabels = ({xleft, xright, xstart, dpi_x}) => {
    const dx = (xright - xleft)/(5);
    let step = Math.floor((xstart - xleft)/dx)*dx || xstart;

    let xlabels = [];
    while (step < xright){
      if ((step >= (xleft-dx/2)) && (step <= (xright+dx/2))){
        xlabels.push(step);
      }
      step = step + dx;
    }
    this.xlabels = xlabels;
    return xlabels;
  }

  getXAxisLabel = ({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright }) => {
    const d1 = new Date(this.xlabels[0]);
    const d2 = new Date(this.xlabels[this.xlabels.length-1]);
    const df = Math.abs(d2 - d1);
    const dd = new Date(df);
    const d = new Date(x);    

    if (dd.getFullYear() > 1970){
      return <text x={px+axisWidth} y={labelHeight/2+5} key={key} >{`${monthNames[d.getMonth()]} ${d.getFullYear()}`}</text>
    } else {
      return <text x={px+axisWidth} y={labelHeight/2+5} key={key} >{`${d.getDate()} ${monthNames[d.getMonth()]}`}</text>      
    }    
  }

  getMarkerBound = ({marker}) => {
    const xs = this.xvalues;
    let x1 = 0;
    let x2 = 1;
    let complete = false;
    while ( (x2<xs.length) && !complete) {
      if ((xs[x1]<=marker) && (xs[x2]>=marker)){
        complete = true;
      } else {
        x1=x1+1;
        x2=x2+1;
      }
    }

    return [x1, x2]; 
  }

  getMarkerBoundDotsLines = ({x1,x2}) => {
    const { lines } = this.props;
    return lines.map( line => ({yvalues: [line.yvalues[x1], line.yvalues[x2]], color: line.color, name: line.name }));
  }

  getXAxisMarker = ({xleft, xright, xstart, dpi_x}) => {
    const { marker } = this.state;

    if (!((marker>xleft) && (marker<xright))){
      return [];
    }

    const [x1,x2] = this.getMarkerBound({marker: marker});
    this.xMarkersIndex = [x1,x2];
    return [this.xvalues[x1], this.xvalues[x2]];
  }

  getXAxisMarkerLabels = ({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright }) => {
    if (!x) { return null; };

    const xs = this.xvalues;
    const [x1,x2] = this.xMarkersIndex;

    const dt = new Date(x);
    const xlabel = `${weekday[dt.getDay()]}, ${monthNames[dt.getMonth()]} ${dt.getDate()} `;

    let labels;
    if (x===xs[x1]){
      labels = this.lines.map( line => ({name: line.name, value: line.yvalues[x1], color: line.color}) );

      return (
        <LeftMarkerLabel key={key} px={px} py={0} labels={labels} xlabel={xlabel} />
      );
    } else {
      labels = this.lines.map( line => ({name: line.name, value: line.yvalues[x2], color: line.color}) );

      return (
        <RightMarkerLabel key={key} px={px} py={0} labels={labels} xlabel={xlabel}/>
      );      
      
    }
  }

  updateMarker = ({marker}) => {
    const [x1,x2] = this.getMarkerBound({marker});
    this.xMarkersIndex = [x1,x2];    
    const dotLines = this.getMarkerBoundDotsLines({x1,x2});
    
    this.setState({marker, dotLines});    
  }


  onDragMarker = ({x, dx}) => {
    const marker = x+dx;
    this.updateMarker({marker});
  }

  viewOnMouseDown = ({dpi_y, dpi_x, clientX, movementX, xleft}) => {
    const x = clientX/dpi_x+xleft;
    this.updateMarker({marker: x});
  }

  render() {
    const { markerX1, markerX2, selected, backgroundcolor } = this.props;
    const { marker, dotLines, xmin, xmax, ymin, ymax } = this.state;

    return (
        <View 
          width={"100%"} 
          height={350}
        >
          <Lines>
            {
              this.lines.map( line => {
                return (
                  <SimpleLine 
                    xvalues={this.xvalues} 
                    yvalues={line.yvalues}
                    color={line.color}
                    width={4}
                    visible={selected.map(sl=>sl.name).includes(line.name)}
                  />                  
                );
              } )
            }
            {
              dotLines.map( line => {
                const [x1,x2] = this.xMarkersIndex;
                return (
                  <DotsLine
                    xvalues={[this.xvalues[x1], this.xvalues[x2]]}
                    yvalues={line.yvalues}
                    color={line.color} 
                    width={2}                  
                    radius={4}
                    visible={selected.map(sl=>sl.name).includes(line.name)}
                  />
                );
              })
            }
            <VerticalLine
              xvalue={marker} 
              color={'grey'}
              width={12}
              offset={-6}
              opacity={0.4}
              onDrag={this.onDragMarker}
            />
          </Lines>
          <Axes 
            xleft={markerX1}
            xright={markerX2}
            xstart={xmin}
            ytop={ymax}
            ybottom={ymin}
            ystart={0}
            xformat={ASES_FORMAT_INDEX}
            yformat={ASES_FORMAT_INDEX}
            onMouseDown={this.viewOnMouseDown}
          >
            <HorizontalAxis 
              position={AXES_POSITION_TOP} 
              height={120}
              lineType={AXES_LINE_DOT_LINE}
              getAxisLabel={this.getXAxisMarkerLabels}
              getXLabels={this.getXAxisMarker}
              debugMode={false}
              axisWidth={4}
              axisVisible={false}
              onchart={true}
            />            
            <VericalAxis 
              position={AXES_POSITION_LEFT} 
              width={120} 
              lineType={AXES_LINE_LINE}
              debugMode={false}
              axisWidth={4}
              axisVisible={true}
              onchart={true}
            />              
            <HorizontalAxis 
              position={AXES_POSITION_BOTTOM} 
              height={20}
              lineType={AXES_LINE_DOT_LINE}
              getAxisLabel={this.getXAxisLabel}
              getXLabels={this.getXLabels}
              debugMode={false}
              axisWidth={4}
              axisVisible={false}
              onchart={false}
            />
          </Axes>
        </View>
    );
  }
}


export default DataChart;
