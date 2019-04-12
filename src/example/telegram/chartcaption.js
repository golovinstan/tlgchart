import React, { Component } from 'react';
import { BackgroundAnimateColor, BackgroundAnimateTransparent } from '../../components/misc/background';


class ChartCaption extends Component {
    render() {
        const {width, height, caption, color} = this.props;

        return (
            <svg
                width={width}
                height={height}
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
            </svg>
        );
    }
}

export default ChartCaption;
