import React, { PureComponent } from 'react';
import { getData } from './data';
import data from '../contest/alldata';

import {getXValues, getLines, monthNames, weekday, getPercentageStakedLines, getMarkerXMinIndex} from '../utils';

import { COLOR_DEFAULT, COLOR_NIGHT } from '../../../components/misc/color';

// const wmode = {name: 'White mode', color: 'white'};
// const dmode = {name: 'Night mode', color: 'black'};

function comvertData({data}){
  const { columns, types, names, colors } = data;
  const xvalues = getXValues({ columns, types });
  const lines = getLines({ columns, types, names, colors });
  return {xvalues, lines};
}

const CHART_TYPE_1 = 'CHART_TYPE_1';
const CHART_TYPE_2 = 'CHART_TYPE_2';

class Chart1 extends PureComponent {
    constructor(props){
        super(props);
        
        this.daydata = comvertData({data: getData()});
        this.overview = comvertData({data: data['1'].overview});

        this.state={
          chartType: CHART_TYPE_1
        }
    }


    render(){            
      return (
        <div>
        </div>
      )
    }
}

export default Chart1;