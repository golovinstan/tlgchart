import React, { PureComponent } from 'react';
import data from '../contest/alldata'

import View from '../../../components/view';
import Axes from '../../../components/axes/axes';
import VericalAxis from '../../../components/axes/verticalaxis';
import HorizontalAxis from '../../../components/axes/horizontalaxis';

import Lines from '../../../components/lines/lines';
import BarAreaLine from '../../../components/lines/bararealine';
import VerticalLine from '../../../components/lines/verticalline';
import DotsLine from '../../../components/lines/dotsline';

import HorizontalCaptionAxis from '../captionaxis';

import { BackgroundAnimateColor, BackgroundAnimateImage } from '../../../components/misc/background';

import { 
    ASES_FORMAT_INDEX 
    ,AXES_POSITION_LEFT
    ,AXES_POSITION_BOTTOM
    ,AXES_POSITION_TOP
    ,AXES_LINE_LINE
    ,AXES_LINE_DOT_LINE
  } from '../../../components/axes/constants';

class PercentageStackedAreaBarMarker extends PureComponent {
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

    render(){
        const { backimage, markerX1, markerX2, selectedLabels, labels, ymin, ymax, xmin, xmax, color, xvalues, lines, percentageStackedlines } = this.props;              

        return (
        <View 
            width={"100%"} 
            height={50}
            ref={ el => this.view = el }
        >
            <BackgroundAnimateColor color={color.background} />
            <Lines
              animtime={"0.01s"}
            >
              {
                percentageStackedlines.map( line => {
                  return (
                    <BarAreaLine 
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
            </Axes>
            <BackgroundAnimateImage image={backimage} />
        </View>
        )
    }
}

export default PercentageStackedAreaBarMarker;