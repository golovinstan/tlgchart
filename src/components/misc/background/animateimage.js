import React, { PureComponent } from 'react';
import { generateUUID } from '../../utils';





class BackgroundAnimateImage extends PureComponent {
  constructor(props){
    super(props);

    this.UUID='flt'+generateUUID().split("-").join("");
    this.imgUUID='flt'+generateUUID().split("-").join("");    
 
  }

  componentDidMount(){
  }


  render() {
    const { image } = this.props;      

    if (!image){
        return null;
    }
    const url64 = 'data:image/svg+xml;base64,' + btoa(image);

    return ( 
        <g>
            <defs>
                <pattern id={`${this.imgUUID}`} width="100%" height="100%">                
                    <svg width="100%" height="100%"  xmlns={"http://www.w3.org/2000/svg"} xmlnsXlink={"http://www.w3.org/1999/xlink"} >   
                        <image  width="100%" height="100%"  xlinkHref={url64}  />
                        <filter id={`${this.UUID}`}>
                            <feMorphology operator={"dilate"} radius={"0"}>
                                <animate attributeName={"radius"} from={"0"} to={"50"} dur={"5s"} repeatCount={"infinite"} />
                            </feMorphology>        
                        </filter>    
                    </svg>
                </pattern>
            </defs>
            <rect filter={`url(#${this.UUID})`} x={0} y={0} width={'100%'} height={'100%'} fill={`url(#${this.imgUUID})`} >            
            </rect>                      
        </g>

    );
  }
}

//           <animate attributeName={"opacity"} values={`1;0`} dur={"1s"} fill={"freeze"} />        
/*

                



        <g  className={"BackgroundAnimateImage"} pointerEvents={"none"} > 
            <pattern ref={ el => this.pattern = el } id={`${this.imgUUID}`} width={"100%"} height={"100%"}>
            </pattern>

            <filter id={`${this.UUID}`}>
                    <feMorphology operator={"dilate"} radius={"0"}>
                        <animate ref={ el => this.anim = el } attributeName={"radius"} from={"0"} to={"50"} dur={"5s"} repeatCount={"infinite"} />
                    </feMorphology>        
            </filter>                 
 
        </g>

*/        

export default BackgroundAnimateImage;
