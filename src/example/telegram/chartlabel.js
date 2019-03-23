import React, { Component } from 'react';



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
        const { onSelect, label } = this.props;
        const { selected } = this.state;

        if (onSelect){
            onSelect({name: label, selected: !selected});
        }
        this.setState({selected: !selected});
    }

    render() {
        const { height, label, color } = this.props;
        const { selected } = this.state;

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
                    fill={'black'}
                    
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
        const {width, height, labels, selectedLabels, onSelect} = this.props;

        return (
            <svg
                width={width}
                height={height}
            >
                {
                    labels.map( label => ( <LabelItem height={height} label={label.name} color={label.color} selected={selectedLabels.includes(label)} list={this.list} onSelect={onSelect} /> ) )
                }
            </svg>
        );
    }
}

export default ChartLabel;
