import React, { Component } from 'react';

import View from '../../components/view';

import Lines from '../../components/lines/lines';
import SimpleLine from '../../components/lines/simpleline';
import VerticalLine from '../../components/lines/verticalline';
import VerticalBox from '../../components/lines/verticalbox';

import Axes from '../../components/axes/axes';


import { 
  ASES_FORMAT_INDEX 
} from '../../components/axes/constants';

class MarkerChart extends Component {
  constructor(props){
    super(props);

    const {startMarkerX1, startMarkerX2, xvalues, lines, selected} = props;

    this.xvalues = xvalues;
    this.lines = lines;

    const {ymin, ymax, xmin, xmax} = this.calcMinMax({xvalues, lines, selected});
    this.anim = [];

    this.state = {
      markerX1: startMarkerX1,
      markerX2: startMarkerX2,
      ymin,
      ymax,
      xmin,
      xmax
    };

    setInterval(this.onInterval, 50);
  }

  onInterval = () => {
    const frame = this.anim.shift();
    if (frame){
      this.setState({...frame});
    }
  }

  animMinMax = ({ymin, ymax, xmin, xmax}) => {
    const {ymin: yminPrev, ymax: ymaxPrev, xmin: xminPrev, xmax: xmaxPrev} = this.state;

    const dymin = (yminPrev - ymin)/10;
    const dymax = (ymaxPrev - ymax)/10;
    const dxmin = (xminPrev - xmin)/10;
    const dxmax = (xmaxPrev - xmax)/10;

    const anim = [1,2,3,4,5,6,7,8,9].map( ind => ({
      ymin: yminPrev-dymin*ind,
      ymax: ymaxPrev-dymax*ind, 
      xmin: xminPrev-dxmin*ind,
      xmax: xmaxPrev-dxmax*ind
    }) );
    anim.push({ymin, ymax, xmin, xmax});

    this.anim.push(...anim);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    const {xvalues, lines, selected} = this.props;
    const {selected: selectedPrev} = prevProps;

    const names = selectedPrev.map( sel => sel.name );
    const equal = (selected.length === selectedPrev.length) && selected.reduce( (a, sel) => a && names.includes( sel.name ), true );

    if (equal !== true) {
      const {ymin, ymax, xmin, xmax} = this.calcMinMax({xvalues, lines, selected});
      this.animMinMax({ymin, ymax, xmin, xmax});
    }
  }

  calcMinMax = ({xvalues, lines, selected}) => {
    const xmin = Math.min(...xvalues);
    const xmax = Math.max(...xvalues);    

    const visLines = lines.filter( line => selected.map(sl=>sl.name).includes(line.name) )
    
    const ymin = Math.min( ...visLines.map( line => Math.min(...line.yvalues) ) );
    const ymax = Math.max( ...visLines.map( line => Math.max(...line.yvalues) ) );

    return {ymin, ymax, xmin, xmax};
  }

  onChangeMarkers = ({markerX1, markerX2}) => {
    const { onChangeMarkers } = this.props;
    if (onChangeMarkers){
      onChangeMarkers({markerX1, markerX2});
    }
  }

  onDragLeft = ({x, dx}) => {
    const { markerX2, xmin, xmax } = this.state;
    const newx = x + dx;
    if ( (xmin<newx) && (xmax>newx) && (newx<markerX2) ){
      this.setState({markerX1: newx});
      this.onChangeMarkers({markerX1: newx, markerX2});
    }
  }

  onDragRight = ({x, dx}) => {
    const { markerX1, xmax, xmin } = this.state;
    const newx = x + dx;
    if ( (xmin<newx) && (xmax>newx) && (newx>markerX1) ){
      this.setState({markerX2: newx});
      this.onChangeMarkers({markerX1, markerX2: newx});
    }
  } 

  onDragBox = ({x, dx}) => {
    const { markerX1, markerX2, xmin, xmax } = this.state;
    const newx1 = markerX1 + dx;
    const newx2 = markerX2 + dx;
    if ( (xmin<newx1) && (xmax>newx2) && (newx1<newx2) ){
      this.setState({markerX1: newx1, markerX2: newx2});
      this.onChangeMarkers({markerX1: newx1, markerX2: newx2});
    }    
  }

  render() {
    const { markerX1, markerX2, ymin, ymax, xmax, xmin } = this.state;
    const { selected } = this.props;

    return (
        <View width={500} height={50}>
          <Lines>
            {
              this.lines.map( line => {
                return (
                  <SimpleLine 
                    xvalues={this.xvalues} 
                    yvalues={line.yvalues}
                    color={line.color}
                    width={4}
                    visible={selected.map(sl=>sl.name).includes(line.name)}
                  />                  
                );
              } )
            }

            <VerticalBox
              leftvalue={xmin}
              rightvalue={markerX1}
              color={'grey'}
              opacity={0.5}
            />
            <VerticalBox
              leftvalue={markerX1}
              rightvalue={markerX2}
              color={'grey'}
              opacity={0.1}
              borderwidth={6}
              borderopacity={0.6}
              xoffset={6}
              onDrag={this.onDragBox}
            />                        
            <VerticalBox
              leftvalue={markerX2}
              rightvalue={xmax}
              color={'grey'}
              opacity={0.5}
            />

            <VerticalLine
              xvalue={markerX1} 
              color={'grey'}
              width={6}
              offset={-3}
              opacity={0.6}
              onDrag={this.onDragLeft}
            />
            <VerticalLine
              xvalue={markerX2} 
              color={'grey'}
              width={6}
              offset={3}
              opacity={0.6}
              onDrag={this.onDragRight}
            />            
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
            xonchart={true}
            yonchart={true}
          />
        </View>
    );
  }
}


export default MarkerChart;
