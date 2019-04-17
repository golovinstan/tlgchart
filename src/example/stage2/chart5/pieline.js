import React, { PureComponent } from 'react';

import {getPieData} from '../utils';

import View from '../../../components/view';
import Axes from '../../../components/axes/axes';
import VericalAxis from '../../../components/axes/verticalaxis';
import HorizontalAxis from '../../../components/axes/horizontalaxis';

import Lines from '../../../components/lines/lines';
import AreaLine from '../../../components/lines/arealine';
import VerticalLine from '../../../components/lines/verticalline';
import DotsLine from '../../../components/lines/dotsline';
import PieLine from '../../../components/lines/pieline';

import HorizontalCaptionAxis from '../captionaxis';

import { BackgroundAnimateColor, BackgroundAnimateTransparent, BackgroundAnimateImage } from '../../../components/misc/background';


import { 
    ASES_FORMAT_INDEX 
    ,AXES_POSITION_LEFT
    ,AXES_POSITION_BOTTOM
    ,AXES_POSITION_TOP
    ,AXES_LINE_LINE
    ,AXES_LINE_DOT_LINE
  } from '../../../components/axes/constants';


class PieChart extends PureComponent {
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
        const { backimage, markerX1, markerX2, selectedLabels, labels, ymin, ymax, xmin, xmax, color, xvalues, lines } = this.props;
        const pieData = getPieData({markerX1, markerX2, xvalues, lines, selectedLabels });               

        return (
        <View 
            width={"100%"} 
            height={350}
            ref={ el => this.view = el }
        >
            <BackgroundAnimateColor color={color.background} />
            <Lines
                animtime={"0.01s"}
            >
              <PieLine data={pieData}/>
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
                leftText={'area chart'}
                rightText={'right'}
                color={color}
                onDragStart={this.onCaptionDragStart}
              />

            </Axes>
            <BackgroundAnimateImage image={backimage} />
        </View>
        )
    }
}

export default PieChart;