import React, { Component } from 'react';
import MarkerChart from './marker';
import DataChart from './data';
import ChartLabel from './chartlabel';
import ChartCaption from './chartcaption';

import { COLOR_DEFAULT, COLOR_NIGHT } from '../../components';



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

const wmode = {name: 'White mode', color: 'white'};
const dmode = {name: 'Night mode', color: 'black'};

class Chart extends Component {
    constructor(props){
        super(props);
        const { columns, types, names, colors } = props.data;
    
        this.xvalues = getXValues({ columns, types });
        this.lines = getLines({ columns, types, names, colors });

        this.xmin = Math.min(...this.xvalues);
        this.xmax = Math.max(...this.xvalues);

        this.startMarkerX1 = this.xvalues[Math.floor(this.xvalues.length/3)];
        this.startMarkerX2 = this.xvalues[Math.floor(this.xvalues.length/3)*2];
    
        const labels = this.lines.map( line => ({name: line.name, color: line.color}) );


        this.state = {
          markerX1: this.startMarkerX1,
          markerX2: this.startMarkerX2,
          labels: [...labels, dmode, wmode],
          selectedLabels: [...labels, wmode]
        };
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

    onCaptionDragStart = () => {
        if (this.dataChart){
            console.log( this.dataChart.exportToString() );
        }
    }


    render() {
        const { markerX1, markerX2, labels, selectedLabels } = this.state;
        const { caption } = this.props;

        let color;
        if (selectedLabels.includes(wmode)) {
            color = COLOR_DEFAULT;
        } else {
            color = COLOR_NIGHT;
        }

        return (
            <div>
                <ChartCaption
                    width={"100%"}
                    height={50}
                    caption={caption}
                    color={color}
                    onDragStart={this.onCaptionDragStart}
                />
                <DataChart
                    ref={ el => this.dataChart = el }
                    markerX1={markerX1}
                    markerX2={markerX2}
                    xvalues={this.xvalues}
                    lines={this.lines}
                    selected={selectedLabels}
                    color={color}
                />
                <MarkerChart
                    startMarkerX1={this.startMarkerX1}
                    startMarkerX2={this.startMarkerX2}
                    xvalues={this.xvalues}
                    lines={this.lines}
                    onChangeMarkers={this.onChangeMarkers}
                    selected={selectedLabels}
                    backgroundcolor={'black'}
                    color={color}
                />
                <ChartLabel
                    width={"100%"}
                    height={50}
                    labels={labels}
                    selectedLabels={selectedLabels}
                    onSelect={this.onchangeSelected}
                    color={color}
                />
            </div>
        );
    }
}

export default Chart;