import React, { Component } from 'react';
import MarkerChart from './marker';

const getXValues = ({ columns, types }) => {
    const xname = Object.entries(types).find( ([name,value]) => value == "x")[0];        
    return columns.find( itm => itm[0] == types[xname] ).filter((e,i) => i !==0 );
}

const getLines = ({ columns, types, names: linesName, colors: linesColors }) => {
    const ent_names = Object.entries(types).filter( ([name,value]) => value == "line" ).map( ([name]) => name );
    const yvalues = ent_names.map( name => columns.find( itm => itm[0] == name ).filter((e,i) => i !==0 ) )
    const names = ent_names.map( name => linesName[name]  );
    const colors = ent_names.map( name => linesColors[name]);

    return ent_names.map( (e,i) => ({ yvalues: yvalues[i], name: names[i], color: colors[i] }) );
}


class Chart extends Component {
    constructor(props){
        super(props);
        const { columns, types, names, colors } = props.data;
    
        this.xvalues = getXValues({ columns, types });
        this.lines = getLines({ columns, types, names, colors });

        this.xmin = Math.min(...this.xvalues);
        this.xmax = Math.max(...this.xvalues);         
    
        this.state = {
          markerX1: this.xvalues[Math.floor(this.xvalues.length/3)],
          markerX2: this.xvalues[Math.floor(this.xvalues.length/3)*2],
        };
    }


    render() {
        const { markerX1, markerX2 } = this.state;
        return (
            <div>
                <MarkerChart
                    markerX1={markerX1}
                    markerX2={markerX2}
                    xvalues={this.xvalues}
                    lines={this.lines}
                />
            </div>
        );
    }
}

export default Chart;