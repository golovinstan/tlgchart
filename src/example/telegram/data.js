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

    this.state = {
      markerX1,
      markerX2,
    };
  }

  getxAxisLabel = ({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright }) => {
    const d = new Date(x);
    return <text x={px+axisWidth} y={labelHeight/2+5} key={key} >{`${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`}</text>
  }

  onDragLeft = ({x, dx}) => {
    const newx = x + dx;
    if ( (this.xmin<newx) && (this.xmax>newx) ){
      this.setState({markerX1: newx});
    }
  }

  onDragRight = ({x, dx}) => {
    const newx = x + dx;
    if ( (this.xmin<newx) && (this.xmax>newx) ){
      this.setState({markerX2: newx});
    }
  } 

  onDragBox = ({x, dx}) => {
    const { markerX1, markerX2 } = this.state;
    const newx1 = markerX1 + dx;
    const newx2 = markerX2 + dx;
    if ( (this.xmin<newx1) && (this.xmax>newx2) ){
      this.setState({markerX1: newx1, markerX2: newx2});
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
              debugMode={false}
              axisWidth={4}
              axisVisible={true}
            />  
            <HorizontalAxis 
              position={AXES_POSITION_BOTTOM} 
              height={20}
              lineType={AXES_LINE_DOT_LINE}
              getAxisLabel={this.getxAxisLabel}
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
