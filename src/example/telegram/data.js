import React, { Component } from 'react';
import View from '../../components/view';

import Lines from '../../components/lines/lines';
import SimpleLine from '../../components/lines/simpleline';
import VerticalLine from '../../components/lines/verticalline';
import DotsLine from '../../components/lines/dotsline';

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

    const { markerX1, markerX2, xvalues, lines} = props;

    this.xvalues = xvalues;
    this.lines = lines;

    this.xmin = Math.min(...this.xvalues);
    this.xmax = Math.max(...this.xvalues);    
    
    this.ymin = Math.min( ...lines.map( line => Math.min(...line.yvalues) ) );
    this.ymax = Math.max( ...lines.map( line => Math.max(...line.yvalues) ) );

    this.xlabels = [];

    this.state = {
      markerX1,
      markerX2,
      dotLines: []
    };
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
    return lines.map( line => ({yvalues: [line.yvalues[x1], line.yvalues[x2]], color: line.color }));
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
    const { markerX1, markerX2 } = this.props;
    const { marker, dotLines } = this.state;


    return (
        <View 
          width={500} 
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
            xstart={this.xmin}
            ytop={this.ymax}
            ybottom={this.ymin}
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
