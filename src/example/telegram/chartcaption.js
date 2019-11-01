import React, { Component } from 'react';
import { BackgroundAnimateColor, BackgroundAnimateTransparent } from '../../components';
import {withDragSVG} from '../../components';

const SVGComponent = React.forwardRef((props, ref) => (
    <svg {...props} ref={ref} />
  ));
const DragSVG = withDragSVG(SVGComponent);

class ChartCaption extends Component {
    render() {
        const {width, height, caption, color, onDragStart} = this.props;

        return (
            <DragSVG
                width={width}
                height={height}
                tlgOnDragStart={onDragStart}
            >
                <BackgroundAnimateColor color={color.background} />
                <text 
                    x={0} 
                    y={height/2} 
                    style={{'fill': `${color.text}`}}
                >
                    {caption}
                </text>
                <BackgroundAnimateTransparent color={color.background}/>        
            </DragSVG>
        );
    }
}

export default ChartCaption;
