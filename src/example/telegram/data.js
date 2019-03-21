import React, { Component } from 'react';
import View from '../../components/view';

import Lines from '../../components/lines/lines';
import SimpleLine from '../../components/lines/simpleline';

import Axes from '../../components/axes/axes';
import VericalAxis from '../../components/axes/verticalaxis';
import HorizontalAxis from '../../components/axes/horizontalaxis';

import { 
  ASES_FORMAT_INDEX 
  ,AXES_POSITION_LEFT
  ,AXES_POSITION_BOTTOM
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
    };
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

  render() {
    const { markerX1, markerX2 } = this.props;

    return (
        <View width={500} height={350}>
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
            xonchart={false}
            yonchart={true}
          >

            <VericalAxis 
              position={AXES_POSITION_LEFT} 
              width={30} 
              lineType={AXES_LINE_LINE}
              debugMode={true}
              axisWidth={4}
              axisVisible={true}
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
            />

          </Axes>
        </View>
    );
  }
}


export default DataChart;
