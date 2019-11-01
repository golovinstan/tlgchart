import React, { Component } from 'react';


class RightCaptionLabel extends Component {
    onMountText = (el, px, i) => {
        if (!el) { return; }

        const bbx = el.getBBox();
        const bw = bbx.width;
        const bh = bbx.height;

        el.setAttribute('x', px-bw);
        el.setAttribute('y', bh*i+bh);
    }


    render() {
        const {key, labels, px, xlabel, color} = this.props;

        return (
            <text 
                x={px} 
                y={0} 
                key={0}
                ref={ el => this.onMountText(el, px, 0) }
                style={{'fill': `${color}`}}
                
            >
                {xlabel}
            </text>            
        );
    }
}


export default RightCaptionLabel;