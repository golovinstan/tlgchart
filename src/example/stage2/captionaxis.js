import React, { PureComponent } from 'react';
import HorizontalAxis from '../../components/axes/horizontalaxis';
import LeftCaptionLabel from './leftcaptionlabel';
import RightCaptionLabel from './rightcaptionlabel';

import { 
    AXES_POSITION_TOP,
    AXES_LINE_DOT_LINE
  } from '../../components/axes/constants';


class HorizontalCaptionAxis extends PureComponent{
    getCaptionLabels = ({x, px, labelWidth, labelHeight, key, axisWidth, xleft, xright }) => {
        const {color, leftText, rightText, onDragStart} = this.props;
        if (x === xleft){
          return <LeftCaptionLabel onDragStart={onDragStart} px={px+150} y={labelHeight/2} xlabel={leftText} color={color.text} key={1} />
        }
        if (x === xright){
          return <RightCaptionLabel px={px-350} y={labelHeight/2} xlabel={rightText} color={color.text} key={2} />
        }      
      }
  
      getXCaption = ({xleft, xright, xstart, dpi_x}) => {
        return [xleft, xright];
      }
      
      render(){
          const { color } = this.props;

          return (
              <HorizontalAxis
                {...this.props}
                position={AXES_POSITION_TOP} 
                height={40}
                lineType={AXES_LINE_DOT_LINE}
                getAxisLabel={this.getCaptionLabels}
                getXLabels={this.getXCaption}                    
                debugMode={false}
                axisWidth={4}
                axisVisible={false}
                onchart={false}
                color={color}              
              />
          );
      }

}

export default HorizontalCaptionAxis;