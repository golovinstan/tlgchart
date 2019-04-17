import React, { PureComponent } from 'react';
import data from '../contest/alldata'

import View from '../../../components/view';
import Axes from '../../../components/axes/axes';
import VericalAxis from '../../../components/axes/verticalaxis';
import HorizontalAxis from '../../../components/axes/horizontalaxis';

import Lines from '../../../components/lines/lines';
import AreaLine from '../../../components/lines/arealine';
import VerticalLine from '../../../components/lines/verticalline';
import DotsLine from '../../../components/lines/dotsline';

import HorizontalCaptionAxis from '../captionaxis';

import { BackgroundAnimateColor, BackgroundAnimateImage } from '../../../components/misc/background';
import {monthNames, weekday} from '../utils';

import { 
    ASES_FORMAT_INDEX 
    ,AXES_POSITION_LEFT
    ,AXES_POSITION_BOTTOM
    ,AXES_POSITION_TOP
    ,AXES_LINE_LINE
    ,AXES_LINE_DOT_LINE
  } from '../../../components/axes/constants';

class AreaChart extends PureComponent {
    constructor(props){
        super(props);
    }

    onCaptionDragStart = () => {
        const { onChangeChartType } = this.props;
        if (onChangeChartType){
            onChangeChartType();
        }
    }

    exportLinesToString = () => {
        if (this.view){
            return this.view.exportLinesToString();
        }
        return '';
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

    getXAxisLabel = ({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright, color }) => {
      const d1 = new Date(this.xlabels[0]);
      const d2 = new Date(this.xlabels[this.xlabels.length-1]);
      const df = Math.abs(d2 - d1);
      const dd = new Date(df);
      const d = new Date(x);    
  
      if (dd.getFullYear() > 1970){
        return <text x={px+axisWidth} y={labelHeight/2+5} key={key} fill={color.text} >{`${monthNames[d.getMonth()]} ${d.getFullYear()}`}</text>
      } else {
        return <text x={px+axisWidth} y={labelHeight/2+5} key={key} fill={color.text} >{`${d.getDate()} ${monthNames[d.getMonth()]}`}</text>      
      }    
    }    

    render(){
        const { backimage, markerX1, markerX2, selectedLabels, labels, ymin, ymax, xmin, xmax, color, xvalues, lines, percentageStackedlines } = this.props;              

        const leftDate = new Date(markerX1);
        const rightDate = new Date(markerX2);

        return (
        <View 
            width={"100%"} 
            height={350}
            ref={ el => this.view = el }
        >
            <BackgroundAnimateColor color={color.background} />
            <Lines>
              {
                percentageStackedlines.map( line => {
                  return (
                    <AreaLine 
                      xvalues={xvalues} 
                      yvalues1={line.yvalues1}
                      yvalues2={line.yvalues2}
                      color={line.color}
                      width={4}
                      visible={selectedLabels.map(sl=>sl.name).includes(line.name)}
                    />                  
                  );
                } )
              }
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
            >       
              <HorizontalCaptionAxis
                leftText={'pie chart'}
                rightText={`${leftDate.getDate()} ${monthNames[leftDate.getMonth()]} - ${rightDate.getDate()} ${monthNames[rightDate.getMonth()]}`}
                color={color}
                onDragStart={this.onCaptionDragStart}
              />

              <VericalAxis 
                position={AXES_POSITION_LEFT} 
                width={120} 
                lineType={AXES_LINE_LINE}            
                debugMode={false}
                axisWidth={4}
                axisVisible={true}
                onchart={true}
                color={color}
              />              
              <HorizontalAxis 
                position={AXES_POSITION_BOTTOM}
                getAxisLabel={this.getXAxisLabel}
                getXLabels={this.getXLabels}                
                height={20}
                lineType={AXES_LINE_DOT_LINE}
                debugMode={false}
                axisWidth={4}
                axisVisible={false}
                onchart={false}
                color={color}
              />
            </Axes>
            <BackgroundAnimateImage image={backimage} />
        </View>
        )
    }
}

export default AreaChart;