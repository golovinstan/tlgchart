import React, { PureComponent } from 'react';
import data from '../contest/alldata'
import {getXValues, getLines, monthNames, weekday, getPercentageStakedLines} from '../utils';

import View from '../../../components/view';
import Axes from '../../../components/axes/axes';
import VericalAxis from '../../../components/axes/verticalaxis';
import HorizontalAxis from '../../../components/axes/horizontalaxis';

import Lines from '../../../components/lines/lines';
import AreaLine from '../../../components/lines/arealine';
import VerticalLine from '../../../components/lines/verticalline';
import DotsLine from '../../../components/lines/dotsline';

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



class Chart5 extends PureComponent {
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

    calcMinMax = ({xvalues, lines, selected, markerX1, markerX2}) => {
        const inds = xvalues.map( (v,i) => ({value: v, ind: i}) ).filter( ({value}) => value>markerX1 && value<markerX2).map( ({ind}) => ind );

        const xmin = Math.min(...inds.map( i => xvalues[i] ));
        const xmax = Math.max(...inds.map( i => xvalues[i] ));    

        const visLines = lines.filter( line => selected.map(sl=>sl.name).includes(line.name) )

        let ymin = 0;// Math.min( ...visLines.map( line => Math.min(...inds.map( i => line.yvalues[i] )) ) );
        let ymax = 100;// Math.max( ...visLines.map( line => Math.max(...inds.map( i => line.yvalues[i] )) ) );

        return {ymin, ymax, xmin, xmax};
    }     



    render(){
        const { markerX1, markerX2, labels, selectedLabels, ymin, ymax, xmin, xmax } = this.state;

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
              {
                this.percentageStackedlines.map( line => {
                  return (
                    <AreaLine 
                      xvalues={this.xvalues} 
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
                height={20}
                lineType={AXES_LINE_DOT_LINE}
                debugMode={false}
                axisWidth={4}
                axisVisible={false}
                onchart={false}
                color={color}
              />
            </Axes>
            <BackgroundAnimateTransparent color={color.background}/>
        </View>
        )
    }
}

export default Chart5;