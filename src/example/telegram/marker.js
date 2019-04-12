import React, { Component } from 'react';

import View from '../../components/view';

import Lines from '../../components/lines/lines';
import SimpleLine from '../../components/lines/simpleline';
import VerticalLine from '../../components/lines/verticalline';
import VerticalBox from '../../components/lines/verticalbox';

import { BackgroundAnimateColor, BackgroundAnimateTransparent } from '../../components/misc/background';

import Axes from '../../components/axes/axes';

import { 
  ASES_FORMAT_INDEX 
} from '../../components/axes/constants';

const DRAG_MARKER1 = {};
const DRAG_MARKER2 = {};
const NO_MARKER_DRAG = {};

class MarkerChart extends Component {
  constructor(props){
    super(props);

    const {startMarkerX1, startMarkerX2, xvalues, lines, selected} = props;

    this.dragtype = NO_MARKER_DRAG;
    this.view = null;
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
  }

  componentDidMount(){
    const {xvalues, lines, selected} = this.props;
    const { markerX1, markerX2 } = this.state;
    const {ymin, ymax, xmin, xmax} = this.calcMinMax({xvalues, lines, selected});
    this.setState({ymin, ymax, xmin, xmax});
    this.onChangeMarkers({markerX1, markerX2});    
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    const {xvalues, lines, selected} = this.props;
    const {selected: selectedPrev} = prevProps;

    const names = selectedPrev.map( sel => sel.name );
    const equal = (selected.length === selectedPrev.length) && selected.reduce( (a, sel) => a && names.includes( sel.name ), true );

    if (equal !== true) {
      const {ymin, ymax, xmin, xmax} = this.calcMinMax({xvalues, lines, selected});
      this.setState({ymin, ymax, xmin, xmax});
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

  onDragEnd = ({}) => {
    this.dragtype = NO_MARKER_DRAG;
  }
    

  OnViewDragMove = ({clientX, clientY, movementX, movementY}) => {
    const { markerX1, markerX2, xmin, xmax } = this.state;

    let dx = 0;
    let dpi_x = 1;
    if (this.view){
      dpi_x = this.view.instances.axisView.dpi_x;
      dx = 6/dpi_x;
    }    

    if (this.dragtype === DRAG_MARKER1){
      this.onDragLeft({x: clientX/dpi_x+xmin , dx: movementX/dpi_x });
    }

    if (this.dragtype === DRAG_MARKER2){
      this.onDragRight({x: clientX/dpi_x+xmin , dx: movementX/dpi_x });
    }    
  }

  onViewDragStart = ({clientX}) => {
    const { markerX1, markerX2, xmin, xmax } = this.state;
    if (this.view){
      const dpi_x = this.view.instances.axisView.dpi_x;
      const px1 = (markerX1-xmin)*dpi_x;
      const px2 = (markerX2-xmin)*dpi_x;
      const dx = 6;

      if ( (clientX>(px1-dx)) && (clientX<(px1+dx)) ){
        this.dragtype = DRAG_MARKER1;
      }
      if ( (clientX>(px2-dx)) && (clientX<(px2+dx)) ){
        this.dragtype = DRAG_MARKER2;
      }      
    }
  }

  render() {
    const { markerX1, markerX2, ymin, ymax, xmax, xmin } = this.state;
    const { selected, color } = this.props;

    let dx = 0;
    if (this.view){
      const dpi_x = this.view.instances.axisView.dpi_x;
      dx = 6/dpi_x;
    }

    return (
        <View 
          width={"100%"} 
          height={50} 
          ref={ el => this.view = el } 
          onDragStart={this.onViewDragStart}
          OnDragMove={this.OnViewDragMove}
          onDragEnd={this.onDragEnd}
        >
          <BackgroundAnimateColor color={color.background} />
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

            <VerticalLine
              xvalue={markerX1} 
              color={'grey'}
              width={12}
              opacity={0.6}
            />
            <VerticalLine
              xvalue={markerX2} 
              color={'grey'}
              width={12}
              opacity={0.6}
            />      

            <VerticalBox
              leftvalue={xmin}
              rightvalue={markerX1-dx}
              color={'grey'}
              opacity={0.5}
            />
            <VerticalBox
              leftvalue={markerX1+dx}
              rightvalue={markerX2-dx}
              color={'grey'}
              opacity={0.1}
              borderwidth={6}
              borderopacity={0.6}
              xoffset={6}
              onDrag={this.onDragBox}
            />                        
            <VerticalBox
              leftvalue={markerX2+dx}
              rightvalue={xmax}
              color={'grey'}
              opacity={0.5}
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
          <BackgroundAnimateTransparent color={color.background}/>
        </View>
    );
  }
}


export default MarkerChart;
