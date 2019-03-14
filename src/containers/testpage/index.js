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

class TestPage extends Component {
  render() {
    const data = TestData[0];

    const xvalues = data.columns[0].filter((e,i) => i !==0 );
    const line1_yvalues = data.columns[1].filter((e,i) => i !==0 );
    const line2_yvalues = data.columns[2].filter((e,i) => i !==0 );

    const ymin = Math.min([line1_yvalues, line2_yvalues]);
    const ymax = Math.max([line1_yvalues, line2_yvalues]);

    const xmin = Math.min(xvalues);
    const xmax = Math.max(xvalues);    

    const yvalues = null;    

    return (
        <View width={500} height={500}>
          <Lines>
            <Line xvalues={xvalues} yvalues={line1_yvalues}/>
            <Line xvalues={xvalues} yvalues={line2_yvalues}/>
          </Lines>
          <Axes 
            xrange={{start: xmin, end: xmax}} 
            yrange={{start: ymin, end: ymax}}
          >
            <VericalAxis />
            <HorizontalAxis />
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
