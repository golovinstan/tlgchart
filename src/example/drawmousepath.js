import React, { PureComponent } from 'react';
import withDragSVG from '../components/hoc/withdragsvg';

const SVGComponent = (props) => (<svg {...props} />);
const CommonSVG = withDragSVG(SVGComponent);


export default class DrawMousePath extends PureComponent{
    constructor(props){
        super(props);
		this.state = {
			points: []
		};        
    }

    onDragMove = ({clientX, clientY, movementX, movementY}) => {
        const points = this.state.points;
        if (points.length > 50) {
            points.shift();
        }
        points.push({
            x: clientX+movementX,
            y: clientY+movementY
        });
        this.setState(points);		
    }

    render(){
        let points = <circle cx="100" cy="100" r="1" />;
        
		if (this.state.points.length > 0) {
            const allPoints = this.state.points;
            let d = '';
            allPoints.forEach((point, i) => {
                const first = (i === 0);
                if (first) {
                    d += 'M ';
                }
                d += ' ' + point.x + ' ' + point.y;
                if (first) {
                    d += ' L ';
                }
            })
            points = <path stroke="black" fill="none" stroke-width="2" d={d} />;
        }

        return (
            <CommonSVG
                tlgOnDragMove={this.onDragMove}
                width={'100%'}
                height={'100%'}
            >
                {points}
            </CommonSVG>
        );
    }
}