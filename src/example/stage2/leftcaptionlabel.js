import React, { Component } from 'react';
import {withDragSVG} from '../../components';

const TextComponent = React.forwardRef((props, ref) => (
    <text {...props} ref={ref} />
  ));
  const TextSVG = withDragSVG(TextComponent);


class LeftCaptionLabel extends Component {
    onMountText = (el, px, i) => {
        if (!el) { return; }

        const bbx = el.SVG.getBBox();
        const bw = bbx.width;
        const bh = bbx.height;

        el.SVG.setAttribute('x', px-bw);
        el.SVG.setAttribute('y', bh*i+bh);
    }


    render() {
        const {key, labels, px, xlabel, color, onDragStart} = this.props;

        return (
            <TextSVG 
                x={px} 
                y={0} 
                key={0}
                ref={ el => this.onMountText(el, px, 0) }
                style={{'fill': `${color}`}}
                tlgOnDragStart={onDragStart}
            >
                {xlabel}
            </TextSVG>            
        );
    }
}


export default LeftCaptionLabel;