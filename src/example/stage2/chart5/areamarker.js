import React, { PureComponent } from 'react';
import data from '../contest/alldata'

import {View, Axes, VericalAxis, HorizontalAxis, Lines, AreaLine, VerticalLine,VerticalBox }  from '../../../components';
import HorizontalCaptionAxis from '../captionaxis';
import { BackgroundAnimateColor, BackgroundAnimateImage } from '../../../components';

import { 
    ASES_FORMAT_INDEX 
    ,AXES_POSITION_LEFT
    ,AXES_POSITION_BOTTOM
    ,AXES_POSITION_TOP
    ,AXES_LINE_LINE
    ,AXES_LINE_DOT_LINE
  } from '../../../components';

const DRAG_MARKER1 = {};
const DRAG_MARKER2 = {};
const NO_MARKER_DRAG = {};

class AreaMarker extends PureComponent {
    constructor(props){
        super(props);

        this.xmin = props.xvalues[0];
        this.xmax = props.xvalues[props.xvalues.length-1];
    }

    onCaptionDragStart = () => {
        const { onChangeChartType } = this.props;
        if (onChangeChartType){
            onChangeChartType();
        }
    }

    exportLinesToString = () => {
        if (this.view){
            return this.view.exportLinesToString();
        }
        return '';
    }    

    onChangeMarkers = ({markerX1, markerX2}) => {
      const { onChangeMarkers } = this.props;
      if (onChangeMarkers){
        onChangeMarkers({markerX1, markerX2});
      }
    }    

    onDragLeft = ({x, dx}) => {
      const { markerX2 } = this.props;
      const newx = x + dx;
      if ( (this.xmin<newx) && (this.xmax>newx) && (newx<markerX2) ){
        this.onChangeMarkers({markerX1: newx, markerX2});
      }
    }
  
    onDragRight = ({x, dx}) => {
      const { markerX1 } = this.props;
      const newx = x + dx;
      if ( (this.xmin<newx) && (this.xmax>newx) && (newx>markerX1) ){
        this.onChangeMarkers({markerX1, markerX2: newx});
      }
    }     

    onDragBox = ({x, dx}) => {
      const { markerX1, markerX2 } = this.props;
      const newx1 = markerX1 + dx;
      const newx2 = markerX2 + dx;
      if ( (this.xmin<newx1) && (this.xmax>newx2) && (newx1<newx2) ){
        this.onChangeMarkers({markerX1: newx1, markerX2: newx2});
      }    
    }    

    onDragEnd = ({}) => {
      this.dragtype = NO_MARKER_DRAG;
    }
      
  
    OnViewDragMove = ({clientX, clientY, movementX, movementY}) => {
      const { markerX1, markerX2 } = this.props;
  
      let dx = 0;
      let dpi_x = 1;
      if (this.view){
        dpi_x = this.view.instances.axisView.dpi_x;
        dx = 6/dpi_x;
      }    
  
      if (this.dragtype === DRAG_MARKER1){
        this.onDragLeft({x: clientX/dpi_x+this.xmin , dx: movementX/dpi_x });
      }
  
      if (this.dragtype === DRAG_MARKER2){
        this.onDragRight({x: clientX/dpi_x+this.xmin , dx: movementX/dpi_x });
      }    
    }
  
    onViewDragStart = ({clientX}) => {
      const { markerX1, markerX2 } = this.props;
      if (this.view){
        const dpi_x = this.view.instances.axisView.dpi_x;
        const px1 = (markerX1-this.xmin)*dpi_x;
        const px2 = (markerX2-this.xmin)*dpi_x;
        const dx = 6;
  
        if ( (clientX>(px1-dx)) && (clientX<(px1+dx)) ){
          this.dragtype = DRAG_MARKER1;
        }
        if ( (clientX>(px2-dx)) && (clientX<(px2+dx)) ){
          this.dragtype = DRAG_MARKER2;
        }      
      }
    }    

    render(){
        const { backimage, markerX1, markerX2, selectedLabels, labels, ymin, ymax, color, xvalues, lines, percentageStackedlines } = this.props;              


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
            <Lines
                animtime={"0.01s"}
            >
              {
                percentageStackedlines.map( line => {
                  return (
                    <AreaLine 
                      xvalues={xvalues} 
                      yvalues1={line.yvalues1}
                      yvalues2={line.yvalues2}
                      color={line.color}
                      width={4}
                      visible={selectedLabels.map(sl=>sl.name).includes(line.name)}
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
                leftvalue={this.xmin}
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
                rightvalue={this.xmax}
                color={'grey'}
                opacity={0.5}
              />

            </Lines>
            <Axes 
              xleft={this.xmin}
              xright={this.xmax}
              xstart={this.xmin}
              ytop={ymax}
              ybottom={ymin}
              ystart={0}
              xformat={ASES_FORMAT_INDEX}
              yformat={ASES_FORMAT_INDEX}
            >       
            </Axes>
            <BackgroundAnimateImage image={backimage} />
        </View>
        )
    }
}

export default AreaMarker;