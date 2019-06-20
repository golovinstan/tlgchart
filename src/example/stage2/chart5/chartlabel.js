import React, { Component } from 'react';
import { BackgroundAnimateColor, BackgroundAnimateTransparent } from '../../../components';


class LabelItem extends Component {
    constructor(props){
        super(props);
        const { list, selected } = props;
        list.push(this);

        this.state = {offset: 0, width: 0, selected};
    }

    setOffset = () => {
        const { list } = this.props;
        const ind = list.indexOf(this);
        const offset = list.filter( (e,i) => i<(ind) ).reduce( (a,v)=> a+v.width, 0 );
        this.offset = offset;
    }

    onMountText = (el) => {
        if (!el) { return; }
        const { width: prevWidth } = this.state;
        const { list, height } = this.props;
        const ind = list.indexOf(this);
        const next = list[ind+1];

        const bbx = el.getBBox();
        const bw = bbx.width;
        this.width = bw + Math.floor(height/2);

        if (next){
            next.setOffset();
        }
        if (prevWidth !== this.width){
            this.setState({width: this.width});
        }
    }    

    onSelect = () => {
        const { onSelect, label, selected } = this.props;

        if (onSelect){
            onSelect({name: label, selected: !selected});
        } 
    }

    render() {
        const { height, label, color, textColor, selected } = this.props;

        return (
            <g
                ref={ el => this.onMountText(el) }
            >
                {
                    selected && (
                        <circle 
                            cx={parseFloat(this.offset||0)+parseFloat(height/4)} 
                            cy={height/2} 
                            r={height/8}
                            fill={color}
                        />
                    )
                }

                <circle 
                    cx={parseFloat(this.offset||0)+parseFloat(height/4)} 
                    cy={height/2} 
                    r={height/6}
                    stroke={color}
                    fillOpacity={0.0}
                    strokeWidth={4}
                    onClick={this.onSelect}
                />                
                <text 
                    x={parseFloat(this.offset||0)+parseFloat(height/2) }
                    y={height/2+6}
                    fill={textColor.text}
                    
                >
                    {label}
                </text>                            
            </g>

        );
    }
}


class ChartLabel extends Component {
    list = [];

    render() {
        const {width, height, labels, selectedLabels, onSelect, color} = this.props;

        return (
            <svg
                width={width}
                height={height}
            >
                <BackgroundAnimateColor color={color.background} />
                {
                    labels.map( label => ( 
                        <LabelItem 
                            height={height} 
                            label={label.name} 
                            color={label.color} 
                            selected={selectedLabels.reduce( (a,v) => a || v.name === label.name, false  ) } 
                            list={this.list} 
                            onSelect={onSelect}
                            textColor={color}
                        /> 
                    ) )
                }
                <BackgroundAnimateTransparent color={color.background}/>        
            </svg>
        );
    }
}

export default ChartLabel;
