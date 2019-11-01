import data from '../contest/alldata';
import {getXValues, getLines} from '../utils';


const appendToArray = ({ data, xvalues, joined, left }) => {
    const { columns, types, names, colors } = data;

    const local_xvalues = getXValues({ columns, types });
    const local_lines = getLines({ columns, types, names, colors });

    xvalues.push(...local_xvalues);
    joined.push(...local_lines[0].yvalues);
    left.push(...local_lines[1].yvalues);
}

export const getData = () => {

    const d2018 = data['1']['2018'];
    const d2019 = data['1']['2019'];

    const xvalues = [];
    const joined = []; 
    const left = [];

    appendToArray({data: d2018['12']['30'], xvalues, joined, left});
    appendToArray({data: d2018['12']['31'], xvalues, joined, left});
    appendToArray({data: d2019['1']['1'], xvalues, joined, left});
    appendToArray({data: d2019['1']['2'], xvalues, joined, left});

    const lines = {
      colors: {y0: "#4BD964", y1: "#FE3C30"},
      names: {y0: "Joined", y1: "Left"},
      types: {y0: "line", y1: "line", x: "x"},
      columns:[
        ["x", ...xvalues],
        ["y0", ...joined],
        ["y1", ...left]
      ]
    };    

    return lines;
}