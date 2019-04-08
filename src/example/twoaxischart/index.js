import React, { Component } from 'react';
import TestData from './testdata';

import View from '../../components/view';
import Axes from '../../components/axes/axes';
import VericalAxis from '../../components/axes/verticalaxis';
import HorizontalAxis from '../../components/axes/horizontalaxis';
import Lines from '../../components/lines/lines';
import SimpleLine from '../../components/lines/simpleline';

import { COLOR_DEFAULT, COLOR_NIGHT } from '../../components/misc/color';

import { 
    ASES_FORMAT_INDEX,
    AXES_POSITION_TOP,
    AXES_LINE_DOT_LINE,
    AXES_LINE_LINE,
    AXES_POSITION_LEFT
  } from '../../components/axes/constants';

const getXValues = ({ columns, types }) => {
    const xname = Object.entries(types).find( ([name,value]) => value === "x")[0];        
    return columns.find( itm => itm[0] === types[xname] ).filter((e,i) => i !==0 );
}

const getLines = ({ columns, types, names: linesName, colors: linesColors }) => {
    const ent_names = Object.entries(types).filter( ([name,value]) => value === "line" ).map( ([name]) => name );
    const yvalues = ent_names.map( name => columns.find( itm => itm[0] === name ).filter((e,i) => i !==0 ) )
    const names = ent_names.map( name => linesName[name]  );
    const colors = ent_names.map( name => linesColors[name]);

    return ent_names.map( (e,i) => ({ yvalues: yvalues[i], name: names[i], color: colors[i] }) );
}

class TwoAxisChart extends Component {
    constructor(props){
        super(props);

        const data = TestData[0];
        const { columns, types, names, colors } = data;

        this.xvalues = getXValues({ columns, types });
        this.lines = getLines({ columns, types, names, colors });

        this.startMarkerX1 = this.xvalues[Math.floor(this.xvalues.length/3)];
        this.startMarkerX2 = this.xvalues[Math.floor(this.xvalues.length/3)*2];  
        
        this.xmin = Math.min(...this.xvalues);
        this.xmax = Math.max(...this.xvalues);     
        
        
        const inds = this.xvalues.map( (v,i) => ({value: v, ind: i}) ).filter( ({value}) => value>this.startMarkerX1 && value<this.startMarkerX2).map( ({ind}) => ind );
        this.ymin = 0;// Math.min( ...visLines.map( line => Math.min(...inds.map( i => line.yvalues[i] )) ) );
        this.ymax = Math.max( ...this.lines.map( line => Math.max(...inds.map( i => line.yvalues[i] )) ) );
    
    }

    render(){
        return (
            <View 
              width={"100%"} 
              height={350}
              color={COLOR_DEFAULT}
            >
                <Lines>
                {
                    this.lines.map( (line, i) => {
                        return (
                        <SimpleLine 
                            key={i}
                            xvalues={this.xvalues} 
                            yvalues={line.yvalues}
                            color={line.color}
                            width={4}
                            visible={true}
                        />                  
                        );
                    } )
                }                    
                </Lines>            

                <Axes 
                    xleft={this.startMarkerX1}
                    xright={this.startMarkerX2}
                    xstart={this.xmin}
                    ytop={this.ymax}
                    ybottom={this.ymin}
                    ystart={0}
                    xformat={ASES_FORMAT_INDEX}
                    yformat={ASES_FORMAT_INDEX}
                >
                    <HorizontalAxis 
                        position={AXES_POSITION_TOP} 
                        height={120}
                        lineType={AXES_LINE_DOT_LINE}
                        debugMode={true}
                        axisWidth={4}
                        axisVisible={false}
                        onchart={true}
                        color={COLOR_DEFAULT}
                    />            
                    <VericalAxis 
                        position={AXES_POSITION_LEFT} 
                        width={120} 
                        lineType={AXES_LINE_LINE}
                        debugMode={true}
                        axisWidth={4}
                        axisVisible={true}
                        onchart={true}
                        color={COLOR_DEFAULT}
                    />                   
                </Axes>            
            </View>
        );
    }
}

export default TwoAxisChart;