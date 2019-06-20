import React, { PureComponent } from 'react';
import AreaChart from '../common/areachart';
import AreaBarMarker from './areabarmarker';
import AreaMarker from './areamarker';
import PieChart from './pieline';
import ChartLabel from './chartlabel';

import data from '../contest/alldata';
import {getXValues, getLines, monthNames, weekday, getPercentageStakedLines, getMarkerXMinIndex} from '../utils';

import { COLOR_DEFAULT, COLOR_NIGHT } from '../../../components';

const wmode = {name: 'White mode', color: 'white'};
const dmode = {name: 'Night mode', color: 'black'};

class Chart5 extends PureComponent {
    constructor(props){
        super(props);

        const { columns, types, names, colors } = data["5"].overview;
    
        this.xvalues = getXValues({ columns, types });
        this.lines = getLines({ columns, types, names, colors });

        const startMarkerX1 = this.xvalues[Math.floor(this.xvalues.length/7*2)];
        const startMarkerX2 = this.xvalues[Math.floor(this.xvalues.length/7*4)];        

        const labels = this.lines.map( line => ({name: line.name, color: line.color}) );


        const {ymin, ymax, xmin, xmax} = this.calcMinMax({
          xvalues: this.xvalues, 
          lines: this.lines, 
          selected: labels, 
          markerX1: startMarkerX1, 
          markerX2: startMarkerX2
        });

        this.state = {
            charttype:'pie',
            backimage: null,
            backimageMarker: null,
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

    onChangeChartType = () => {
      const { charttype } = this.state;
      const chart = this.chart;
      const marker = this.marker;
      let backimage = null;
      let backimageMarker = null;
      if (chart) {
        backimage = chart.exportLinesToString();
      }
      if (marker){
        backimageMarker = marker.exportLinesToString();
      }

      if ( charttype == 'pie' ){
        this.setState({charttype: 'percentagestackedareachart', backimage, backimageMarker});
      } else {
        this.setState({charttype: 'pie', backimage, backimageMarker});
      }
    }

    onChangeMarkers = ({markerX1, markerX2}) => {
      this.setState({markerX1, markerX2});
    }

    onchangeSelected = ({name, selected}) => {
      const { selectedLabels, labels } = this.state;
      let new_sl;
      if (selected !== true){
          new_sl = selectedLabels.filter( l => l.name !== name );
      }
      if (selected !== false){
          new_sl = labels.find( lb => lb.name === name );
          new_sl = [...selectedLabels, new_sl];
      }
      const wmode = labels[labels.length-1];
      const nmode = labels[labels.length-2];

      if (selected === true){
          if ( (name === wmode.name)){
              new_sl = new_sl.filter( sl => sl.name !== nmode.name )
          }
          if ( (name === nmode.name)){
              new_sl = new_sl.filter( sl => sl.name !== wmode.name )
          }   
      }

      if (selected === false){
          if ( (name === nmode.name)){
              new_sl = [...new_sl, wmode];
          }
          if ( (name === wmode.name)){
              new_sl = [...new_sl, nmode];
          }   
      }        
   
      this.setState({selectedLabels: new_sl});
  }

    render(){            
      const { charttype, backimage, backimageMarker, markerX1, markerX2, selectedLabels, labels, ymin, ymax, xmin, xmax } = this.state;
      const color = this.getColor();
      const percentageStackedlines = getPercentageStakedLines({xvalues: this.xvalues, lines: this.lines.filter( line => selectedLabels.find( lb => lb.name === line.name ) ) });

      let Chart = AreaChart;
      let Marker = AreaMarker;      
      if (charttype == 'pie'){
        Chart = PieChart;
        Marker = AreaBarMarker;        
      }

      return (
        <div>
          <Chart
            ref={ el => this.chart = el }
            onChangeChartType={this.onChangeChartType}
            backimage={backimage}
            markerX1={markerX1}
            markerX2={markerX2}
            selectedLabels={selectedLabels}
            labels={labels}
            ymin={ymin}
            ymax={ymax}
            xmin={xmin}
            xmax={xmax}
            color={color}
            xvalues={this.xvalues}
            lines={this.lines}
            percentageStackedlines={percentageStackedlines}
          />
          <Marker
            ref={ el => this.marker = el }
            onChangeMarkers={this.onChangeMarkers}
            onChangeChartType={this.onChangeChartType}
            backimage={backimageMarker}
            markerX1={markerX1}
            markerX2={markerX2}
            selectedLabels={selectedLabels}
            labels={labels}
            ymin={ymin}
            ymax={ymax}
            xmin={xmin}
            xmax={xmax}
            color={color}
            xvalues={this.xvalues}
            lines={this.lines}
            percentageStackedlines={percentageStackedlines}
          />
          <ChartLabel
            width={'100%'}
            height={'50'}
            color={color}
            labels={labels}
            selectedLabels={selectedLabels}
            onSelect={this.onchangeSelected}
          />    
        </div>
      )
    }
}

export default Chart5;