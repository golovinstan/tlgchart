import React, { PureComponent } from 'react';
import data from '../contest/alldata'
import {getXValues, getLines, monthNames, weekday, getPercentageStakedLines, getMarkerXMinIndex, getPieData} from '../utils';

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

import { BackgroundAnimateColor, BackgroundAnimateTransparent } from '../../../components/misc/background';
import { COLOR_DEFAULT, COLOR_NIGHT } from '../../../components/misc/color';

import { 
    ASES_FORMAT_INDEX 
    ,AXES_POSITION_LEFT
    ,AXES_POSITION_BOTTOM
    ,AXES_POSITION_TOP
    ,AXES_LINE_LINE
    ,AXES_LINE_DOT_LINE
  } from '../../../components/axes/constants';


const wmode = {name: 'White mode', color: 'white'};
const dmode = {name: 'Night mode', color: 'black'};



class PieChart extends PureComponent {
    constructor(props){
        super(props);

        const { columns, types, names, colors } = data["5"].overview;
    
        this.xvalues = getXValues({ columns, types });
        this.lines = getLines({ columns, types, names, colors });
        this.percentageStackedlines = getPercentageStakedLines({xvalues: this.xvalues, lines: this.lines});

        const startMarkerX1 = this.xvalues[Math.floor(this.xvalues.length/3)];
        const startMarkerX2 = this.xvalues[Math.floor(this.xvalues.length/3)*2];        

        const labels = this.lines.map( line => ({name: line.name, color: line.color}) );

        const {ymin, ymax, xmin, xmax} = this.calcMinMax({
            xvalues: this.xvalues, 
            lines: this.lines, 
            selected: labels, 
            markerX1: startMarkerX1, 
            markerX2: startMarkerX2
        });

        this.state = {
            markerX1: startMarkerX1,
            markerX2: startMarkerX2,
            labels: [...labels, dmode, wmode],
            selectedLabels: [...labels, wmode],
            dotLines: [],
            ymin, 
            ymax,
            xmin,
            xmax            
          };        

    }

    getColor = () => {
      const { selectedLabels } = this.state;

      if (selectedLabels.includes(wmode)) {
          return COLOR_DEFAULT;
      } else {
          return COLOR_NIGHT;
      }  
    }

    calcMinMax = ({xvalues, lines, selected, markerX1, markerX2}) => {
        // const inds = xvalues.map( (v,i) => ({value: v, ind: i}) ).filter( ({value}) => value>markerX1 && value<markerX2).map( ({ind}) => ind );
        const indX1 = getMarkerXMinIndex({xvalues, marker: markerX1});
        const indX2 = getMarkerXMinIndex({xvalues, marker: markerX2})+1;

        let xmin = xvalues[indX1];
        let xmax = xvalues[indX2];

        for (let i=indX1; i!=indX2; i++){
            if (xvalues[i]<xmin){ xmin = xvalues[i] };
            if (xvalues[i]>xmax){ xmax = xvalues[i] };
        }

        let ymin = 0;
        let ymax = 100;

        return {ymin, ymax, xmin, xmax};
    }     

    onCaptionDragStart = () => {
        const { onChangeChartType } = this.props;
        if (onChangeChartType){
            onChangeChartType();
        }
    }

    exportToString = () => {
        if (this.view){
            return this.view.exportToString();
        }
        return '';
    }

    render(){
        const { markerX1, markerX2, labels, selectedLabels, ymin, ymax, xmin, xmax } = this.state;

        const pieData = getPieData({markerX1, markerX2, xvalues: this.xvalues, lines: this.lines });

        let color;
        if (selectedLabels.includes(wmode)) {
            color = COLOR_DEFAULT;
        } else {
            color = COLOR_NIGHT;
        }                

        return (
        <View 
            width={"100%"} 
            height={350}
            ref={ el => this.view = el }
        >
            <BackgroundAnimateColor color={color.background} />
            <Lines>
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
                leftText={'left'}
                rightText={'right'}
                color={color}
                onDragStart={this.onCaptionDragStart}
              />

            </Axes>
        </View>
        )
    }
}

export default PieChart;