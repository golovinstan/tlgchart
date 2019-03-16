import React, { Component } from 'react';
import TestData from '../../testdata'

import View from '../../components/view';

import Lines from '../../components/lines/lines';
import Line from '../../components/lines/line';

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
  render() {
    const data = TestData[0];

    // const xvalues = data.columns[0].filter((e,i) => i !==0 ).map((e,i) => i-1);
    const xvalues = data.columns[0].filter((e,i) => i !==0 );
    const line1_yvalues = data.columns[1].filter((e,i) => i !==0 );
    const line2_yvalues = data.columns[2].filter((e,i) => i !==0 );

    const ymin = Math.min(...line1_yvalues, ...line2_yvalues);
    const ymax = Math.max(...line1_yvalues, ...line2_yvalues);

    const xmin = Math.min(...xvalues);
    const xmax = Math.max(...xvalues);    

    return (
        <View width={500} height={500}>
          <Lines>
            <Line xvalues={xvalues} yvalues={line1_yvalues}/>
            <Line xvalues={xvalues} yvalues={line2_yvalues}/>
          </Lines>
          <Axes 
            xleft={xmin}
            xright={xmax}
            xstart={xmin}
            ytop={ymax}
            ybottom={ymin}
            ystart={ymin}
            xformat={ASES_FORMAT_INDEX}
            yformat={ASES_FORMAT_INDEX}
            xonchart={false}
            yonchart={true}
          >
            <VericalAxis 
              scalecount={6} 
              position={AXES_POSITION_LEFT} 
              width={50} 
              line={AXES_LINE_LINE}
            />
            <HorizontalAxis 
              scalecount={6} 
              position={AXES_POSITION_BOTTOM} 
              height={50}
              line={AXES_LINE_DOT_LINE}
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
