import React, { Component } from 'react';


class RightMarkerLabel extends Component {

    onMountText = (el, px, i) => {
        if (!el) { return; }

        const bbx = el.getBBox();
        const bw = bbx.width;
        const bh = bbx.height;

        el.setAttribute('x', px);
        el.setAttribute('y', bh*i+bh);
    }


    render() {
        const {key, labels, px, xlabel, color} = this.props;

        return (
            <g
                key={key}
            >
                <text 
                    x={px} 
                    y={0} 
                    key={0}
                    ref={ el => this.onMountText(el, px, 0) }
                    style={{'fill': `${color.text}`}}
                    
                >
                    {xlabel}
                </text>              
                {
                    labels.map( (label, i) => {
                        return (
                            <text 
                                x={px} 
                                y={0} 
                                key={key}
                                ref={ el => this.onMountText(el, px, i+1) }
                                style={{'fill':`${label.color}`}}
                            >
                                {`${label.name} ${label.value}`}
                            </text>
                        )
                    } )
                }
            </g>
        );
    }
}


export default RightMarkerLabel;