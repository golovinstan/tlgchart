export const getXValues = ({ columns, types }) => {
    const xname = Object.entries(types).find( ([name,value]) => value === "x")[0];        
    return columns.find( itm => itm[0] === types[xname] ).filter((e,i) => i !==0 );
}

export const getLines = ({ columns, types, names: linesName, colors: linesColors }) => {
    const ent_names = Object.entries(types).filter( ([name,value]) => value !== "x" ).map( ([name]) => name );
    const yvalues = ent_names.map( name => columns.find( itm => itm[0] === name ).filter((e,i) => i !==0 ) )
    const names = ent_names.map( name => linesName[name]  );
    const colors = ent_names.map( name => linesColors[name]);

    return ent_names.map( (e,i) => ({ yvalues: yvalues[i], name: names[i], color: colors[i] }) );
}

export const getPieData = ({markerX1, markerX2, xvalues, lines, selectedLabels}) => {
  let indX1 = getMarkerXMinIndex({xvalues, marker: markerX1});
  let indX2 = getMarkerXMinIndex({xvalues, marker: markerX2}) + 1;
  const summ = [];

  const ln = lines.filter( line => selectedLabels.find( lb => lb.name === line.name ) );

  let line_sum;
  ln.forEach( (line,j) => {
    line_sum = 0;
    for (let i=indX1; i!=indX2; i++){
      line_sum = line_sum + line.yvalues[i];
    }
    summ[j] = line_sum;
  } );
  const all_summ = summ.reduce( (a,v) => a+v , 0 );

  return ln.map( (line, i) => ({
    name: line.name,
    color: line.color,
    value: summ[i]/all_summ
  }) )
}

export const getMarkerXMinIndex = ({marker, xvalues}) => {
  let ind = 0;

  for (let i=0; i<xvalues.length; i++){
    if (xvalues[i]<marker){ 
      ind = i; 
    } else {
      break;
    }
  }
  return ind;
}

export const getPercentageStakedLines = ({xvalues, lines}) => {

  const yvalues_sum = [];
  const yvalues_val = [];
  const yvalues_prv = [];
  let cnct = 0;
  xvalues.map( (e,i) => {
    cnct = 0;
    lines.forEach( line => {
      cnct = cnct + line.yvalues[i];
    } );
    yvalues_sum.push(cnct);
    yvalues_val.push(0);
    yvalues_prv.push(0);
  } );


  return lines.reverse().map( line => {
    const yvls = line.yvalues.map( (e,i) => {
      yvalues_prv[i] = yvalues_val[i];
      yvalues_val[i] = yvalues_val[i] + e;
      const v1 = yvalues_prv[i]/yvalues_sum[i];
      const v2 = yvalues_val[i]/yvalues_sum[i];
      return {v1: v1*100, v2: v2*100};
    } );

    return {
      yvalues1: yvls.map( v => v.v1 ),
      yvalues2: yvls.map( v => v.v2 ),
      name: line.name,
      color: line.color
    }
  } );
}

export const TimeToString = (x) => {
  
}

export const monthNames = [
    "Jan", 
    "Feb", 
    "Mar", 
    "Apr", 
    "May", 
    "Jun",
    "Jul", 
    "Aug", 
    "Sep", 
    "Oct", 
    "Nov", 
    "Dec"
  ];
  
  export const weekday = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];