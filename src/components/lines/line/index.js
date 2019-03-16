import React, { Component } from 'react';

class Line extends Component {
  constructor(props){
    const { instances, xvalues, yvalues } = props;
    super(props);
    instances.lines.push(this)    

    if (xvalues.length !== yvalues.length) {
      throw new Error('Wrong data size');
    }

    this.state = {pathData: ''};
  }

  calcPath = () => {
    const { xvalues, yvalues } = this.props;

    let pathData = `M${xvalues[0]} ${yvalues[0]}`;
    for (let i=1; i<xvalues.length; i++){
      pathData = pathData + ` L${xvalues[i]} ${yvalues[i]}`
    }    
    this.setState({pathData})
  }

  render() {
    const { pathData } = this.state;

    return (
      <path d={pathData} />
    );
  }
}

export default Line;
