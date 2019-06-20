import React, { Component } from 'react';


class BackgroundAnimateColor extends Component {
  constructor(props){
    super(props);
  }

  resetAnim = ({color}) => {
    if (!this.svg_anim && !this.svg_src){
      return;
    }
    const cmp_style = window.getComputedStyle(this.svg_src, null);
    const crnt = cmp_style.fill;
    const values = `${crnt};${color}`;

    this.svg_src.setAttribute("fill", crnt);
    this.svg_anim.setAttribute('values', values);
    this.svg_anim.beginElement();
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    const { color } = this.props;
    this.resetAnim({color});
  }

  componentDidMount(){
    const { color } = this.props;
    this.resetAnim({color});    
  }

  render() {
    const {color} = this.props;

    return (
      <rect pointerEvents={"none"} ref={ el => this.svg_src = el } x={0} y={0} width={"100%"} height={"100%"}  >
        <animate ref={ el => this.svg_anim = el } attributeName={"fill"} values={`white;${color}`} dur={"0.5s"} fill={"freeze"} />        
      </rect>
    );
  }
}

export default BackgroundAnimateColor;
