import React, { Component } from 'react';

const pi = 22/7;
const pi2 = 2*pi;
const radius = 100;
const fullLength = pi2*radius;

class PieLine extends Component {
  constructor(props){
    super(props);
  }

  calcPath = ({dpi_x, dpi_y, xleft, xright, ytop}) => {
  }

  render() {
    const { data } = this.props;
    let offset = 0;
    let textOffset = 0;

    return (
      <svg x={0} y={0} width={"100%"} height={"100%"} viewBox={`0 0 ${4*radius} ${4*radius}`} preserveAspectRatio="xMidYMid meet">      
        {
          data.map( (d,i) => {
            const length = fullLength*d.value;
            const offsetLength = fullLength*offset;
            offset = offset + d.value;

            const cmpnt = (
                <circle 
                r={`${radius}`} 
                cx={`${2*radius}`} 
                cy={`${2*radius}`}  
                stroke={`${d.color}`} 
                fill={'none'}
                strokeWidth={`${radius*2}`} 
                strokeDashoffset={`${-offsetLength}`} 
                strokeDasharray={`${length} ${fullLength}`} 
                />               
            );
            
            return cmpnt;
          })
        }
        {
          data.map( (d,i) => {
            const angle = Math.floor((textOffset+d.value/2)*360)+90;

            const cmpnt = (
              <text
                x={`${2*radius}`} 
                y={`${radius/4}`} 
                stroke={'white'} 
                strokeWidth={"2"} 
                fontSize={"16"}
                transform={`rotate(${angle} ${2*radius} ${2*radius} )`}              
              >
                {`${Math.floor(d.value*100)}%`}
              </text>
            );

            textOffset = textOffset + d.value;
            return cmpnt;

          } )
        }
      </svg>
    );
  }
}

// 

export default PieLine;
