import React, { Component } from 'react';


class ChartCaption extends Component {
    render() {
        const {width, height, caption, color} = this.props;

        return (
            <svg
                width={width}
                height={height}
                style={{'background-color': `${color.background}`}}
            >
                <text 
                    x={0} 
                    y={height/2} 
                    style={{'fill': `${color.text}`}}
                >
                    {caption}
                </text>            
            </svg>
        );
    }
}

export default ChartCaption;
