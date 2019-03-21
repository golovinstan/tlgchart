import React, { Component } from 'react';
import TestData from '../../containers/testpage/testdata'

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

    const {startMarkerX1, startMarkerX2, xvalues, lines} = props;

    this.xvalues = xvalues;
    this.lines = lines;

    this.xmin = Math.min(...this.xvalues);
    this.xmax = Math.max(...this.xvalues);    
    
    this.ymin = Math.min( ...lines.map( line => Math.min(...line.yvalues) ) );
    this.ymax = Math.max( ...lines.map( line => Math.max(...line.yvalues) ) );

    this.state = {
      markerX1: startMarkerX1,
      markerX2: startMarkerX2,
    };
  }

  onChangeMarkers = ({markerX1, markerX2}) => {
    const { onChangeMarkers } = this.props;
    if (onChangeMarkers){
      onChangeMarkers({markerX1, markerX2});
    }
  }

  onDragLeft = ({x, dx}) => {
    const { markerX2 } = this.state;
    const newx = x + dx;
    if ( (this.xmin<newx) && (this.xmax>newx) && (newx<markerX2) ){
      this.setState({markerX1: newx});
      this.onChangeMarkers({markerX1: newx, markerX2});
    }
  }

  onDragRight = ({x, dx}) => {
    const { markerX1 } = this.state;
    const newx = x + dx;
    if ( (this.xmin<newx) && (this.xmax>newx) && (newx>markerX1) ){
      this.setState({markerX2: newx});
      this.onChangeMarkers({markerX1, markerX2: newx});
    }
  } 

  onDragBox = ({x, dx}) => {
    const { markerX1, markerX2 } = this.state;
    const newx1 = markerX1 + dx;
    const newx2 = markerX2 + dx;
    if ( (this.xmin<newx1) && (this.xmax>newx2) && (newx1<newx2) ){
      this.setState({markerX1: newx1, markerX2: newx2});
      this.onChangeMarkers({markerX1: newx1, markerX2: newx2});
    }    
  }

  render() {
    const { markerX1, markerX2 } = this.state;

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
                  />                  
                );
              } )
            }

            <VerticalBox
              leftvalue={this.xmin}
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
              rightvalue={this.xmax}
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
            xleft={this.xmin}
            xright={this.xmax}
            xstart={this.xmin}
            ytop={this.ymax}
            ybottom={this.ymin}
            ystart={this.ymin}
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
