import React, { Component } from 'react';
import TestData from '../../testdata'

import View from '../../components/view';

import Lines from '../../components/lines/lines';
import SimpleLine from '../../components/lines/simpleline';
import DotsLine from '../../components/lines/dotsline';

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

  getxAxisLabel = ({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright }) => {
    const d = new Date(x);
    return <text x={px+axisWidth} y={labelHeight/2+5} key={key} >{`${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`}</text>
  }

  render() {
    const data = TestData[0];

    // const xvalues = data.columns[0].filter((e,i) => i !==0 ).map((e,i) => i-1);
    const xvalues = data.columns[0].filter((e,i) => i !==0 );
    const line1_yvalues = data.columns[1].filter((e,i) => i !==0 );
    const line2_yvalues = data.columns[2].filter((e,i) => i !==0 );

    const xmin = Math.min(...xvalues);
    const xmax = Math.max(...xvalues);    

    const dx = 0;// (xmax-xmin)/5;    

    return (
        <View width={500} height={200}>
          <Lines>
            <SimpleLine xvalues={xvalues} yvalues={line1_yvalues}/>
            <DotsLine xvalues={xvalues} yvalues={line1_yvalues}/>

            <SimpleLine xvalues={xvalues} yvalues={line2_yvalues}/>
            <DotsLine xvalues={xvalues} yvalues={line2_yvalues}/>
          </Lines>
          <Axes 
            xleft={xmin+dx}
            xright={xmax-dx}
            xstart={xmin}
            ytop={150}
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
              lineType={AXES_LINE_DOT_LINE}
              axisWidth={4}
              debugMode={false}
            />  
            <HorizontalAxis 
              position={AXES_POSITION_BOTTOM} 
              height={20}
              lineType={AXES_LINE_DOT_LINE}
              axisWidth={4}
              getAxisLabel={this.getxAxisLabel}
              debugMode={false}
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

/*




*/            

export default TestPage;
