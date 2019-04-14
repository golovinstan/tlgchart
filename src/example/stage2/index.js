import React, {PureComponent} from 'react';

import data from './contest/alldata'

const getXValues = ({ columns, types }) => {
    const xname = Object.entries(types).find( ([name,value]) => value === "x")[0];        
    return columns.find( itm => itm[0] === types[xname] ).filter((e,i) => i !==0 );
}

const getLines = ({ columns, types, names: linesName, colors: linesColors }) => {
    const ent_names = Object.entries(types).filter( ([name,value]) => value !== "x" ).map( ([name]) => name );
    const yvalues = ent_names.map( name => columns.find( itm => itm[0] === name ).filter((e,i) => i !==0 ) )
    const names = ent_names.map( name => linesName[name]  );
    const colors = ent_names.map( name => linesColors[name]);

    return ent_names.map( (e,i) => ({ yvalues: yvalues[i], name: names[i], color: colors[i] }) );
}

const wmode = {name: 'White mode', color: 'white'};
const dmode = {name: 'Night mode', color: 'black'};

class TelegramContestStage2 extends PureComponent {
    constructor(props){
        super(props);

        const { columns, types, names, colors } = data["5"].overview;
    
        this.xvalues = getXValues({ columns, types });
        this.lines = getLines({ columns, types, names, colors });

        this.xmin = Math.min(...this.xvalues);
        this.xmax = Math.max(...this.xvalues);

        const startMarkerX1 = this.xvalues[Math.floor(this.xvalues.length/3)];
        const startMarkerX2 = this.xvalues[Math.floor(this.xvalues.length/3)*2];        

        const labels = this.lines.map( line => ({name: line.name, color: line.color}) );        

        this.state = {
            markerX1: startMarkerX1,
            markerX2: startMarkerX2,
            labels: [...labels, dmode, wmode],
            selectedLabels: [...labels, wmode]
          };        

    }

    render(){

        return (
            <div>
            </div>
        )
    }
}

export default TelegramContestStage2;