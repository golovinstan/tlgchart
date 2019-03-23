import React, { Component } from 'react';


class ChartCaption extends Component {
    render() {
        const {width, height, caption} = this.props;

        return (
            <svg
                width={width}
                height={height}
            >
                <text 
                    x={0} 
                    y={height/2} 
                >
                    {caption}
                </text>            
            </svg>
        );
    }
}

export default ChartCaption;
