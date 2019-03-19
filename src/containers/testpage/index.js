import React, { Component } from 'react';
import TestData from '../../testdata'

import View from '../../components/view';

import Lines from '../../components/lines/lines';
import SimpleLine from '../../components/lines/simpleline';
import DotsLine from '../../components/lines/dotsline';
import VerticalLine from '../../components/lines/verticalline';

import Axes from '../../components/axes/axes';
import VericalAxis from '../../components/axes/verticalaxis';
import HorizontalAxis from '../../components/axes/horizontalaxis';

import Markers from '../../components/markers/markers';
import HeaderMarker from '../../components/markers/headermarker';
import VertLineMarker from '../../components/markers/vertlinemarker';


import { 
  ASES_FORMAT_INDEX 
  ,AXES_POSITION_LEFT
  ,AXES_POSITION_BOTTOM
  ,AXES_LINE_LINE
  ,AXES_LINE_DOT_LINE
} from '../../components/axes/constants';

class TestPage extends Component {
  constructor(props){
    super(props);

    const data = TestData[0];

    this.xvalues = data.columns[0].filter((e,i) => i !==0 );
    this.line1_yvalues = data.columns[1].filter((e,i) => i !==0 );
    this.line2_yvalues = data.columns[2].filter((e,i) => i !==0 );

    this.xmin = Math.min(...this.xvalues);
    this.xmax = Math.max(...this.xvalues);        

    this.state = {
      markerX1: this.xvalues[11],
      markerX2: this.xvalues[90],
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

  render() {
    const { markerX1, markerX2 } = this.state;
    const dx = 0;

    return (
        <View width={500} height={200}>
          <Lines>
            <SimpleLine 
              xvalues={this.xvalues} 
              yvalues={this.line1_yvalues}
              color={'#3DC23F'}
              width={4}
            />
            <DotsLine 
              xvalues={[this.xvalues[10], this.xvalues[11]]} 
              yvalues={[this.line1_yvalues[10], this.line1_yvalues[11]]}
              color={'#3DC23F'}
              width={4}
              radius={5}
            />
            <VerticalLine
              xvalue={markerX1} 
              color={'#3DC23F'}
              width={4}
              onDrag={this.onDragLeft}
            />
            <VerticalLine
              xvalue={markerX2} 
              color={'#3DC23F'}
              width={4}
              onDrag={this.onDragRight}
            />            

            <SimpleLine 
              xvalues={this.xvalues} 
              yvalues={this.line2_yvalues}
              color={'#F34C44'}
              width={4}
            />
          </Lines>
          <Axes 
            xleft={this.xmin+dx}
            xright={this.xmax-dx}
            xstart={this.xmin}
            ytop={250}
            ybottom={0}
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
          <Markers>
            <HeaderMarker />
            <VertLineMarker />
          </Markers>
        </View>
    );
  }
}

export default TestPage;
