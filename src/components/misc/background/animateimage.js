import React, { PureComponent } from 'react';
import { generateUUID } from '../../utils';



class BackgroundAnimateImage extends PureComponent {
  constructor(props){
    super(props);

    this.UUID='flt'+generateUUID().split("-").join("");
    this.imgUUID='flt'+generateUUID().split("-").join("");    
 
  }

  doDeleteElement = () => {
      if (this.elementToDelete){
        this.elementToDelete.remove();
      }
  }

  render() {
    const { image } = this.props;      

    if (!image){
        return null;
    }
    const url64 = 'data:image/svg+xml;base64,' + btoa(image);

    return ( 
        <g ref={ el => {
            this.elementToDelete = el;
            this.timeid = setTimeout(this.doDeleteElement, 400);
        } } >
            <defs>
                <pattern id={`${this.imgUUID}`} width={"100%"} height={"100%"}>                
                    <svg x={0} y={"0"} width={"100%"} height={"100%"}  xmlns={"http://www.w3.org/2000/svg"} xmlnsXlink={"http://www.w3.org/1999/xlink"} >   
                        <image  width={"100%"} height={"100%"}  xlinkHref={url64}  /> 
                    </svg>
                </pattern>
                <filter id={`${this.UUID}`}>
                    <feMorphology operator={"dilate"} radius={"0"}>
                        <animate attributeName={"radius"} from={"0"} to={"30"} dur={"0.5s"} repeatCount={"infinite"} />
                    </feMorphology>        
                </filter>                   
            </defs>           

            <rect x={"0"} y={"0"} width={"100%"} height={"100%"} rx={"15"} ry={"15"}  fill={`url(#${this.imgUUID})`} filter={`url(#${this.UUID})`} >
                <animate attributeName={"opacity"} from={"1"} to={"0"} dur={"0.5s"} repeatCount={"freeze"} />
            </rect>               
        </g>

    );
  }
}

/*

                <animate attributeName={"opacity"} from={"1"} to={"0"} dur={"0.5s"} repeatCount={"freeze"} />
                <animate attributeName={"x"} from={"0"} to={"50%"} dur={"0.5s"} repeatCount={"freeze"} />
                <animate attributeName={"y"} from={"0"} to={"50%"} dur={"0.5s"} repeatCount={"freeze"} />
                <animate attributeName={"width"} from={"100%"} to={"0"} dur={"0.5s"} repeatCount={"freeze"} />
                <animate attributeName={"height"} from={"100%"} to={"0"} dur={"0.5s"} repeatCount={"freeze"} />



                <animateTransform ref={ el => {
                    if (!el){
                        return;
                    }
                    const rbb = el.parentElement.getBoundingClientRect();
                    el.setAttribute("from", `0 ${rbb.width/2} ${rbb.height/2}`);
                    el.setAttribute("to", `90 ${rbb.width/2} ${rbb.height/2}`);                    
                } } attributeName={"transform"} type={"rotate"} from={"0"} to={"90"} dur="0.5s" repeatCount="freeze" additive="sum" />

*/                

          

      

export default BackgroundAnimateImage;
