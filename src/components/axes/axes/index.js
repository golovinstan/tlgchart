import React, { Component } from 'react';

class Axes extends Component {
  constructor(props){
    super(props);
    const { instances } = props;

    instances.axisView = this;
    instances.axes = [];
  } 

  calcScale = ({}) => {
    const { instances, xleft, xright, xstart, ytop, ybottom, ystart } = this.props;
    instances.axes.forEach( axis => axis.calcScale({xleft, xright, xstart, ytop, ybottom, ystart}) );
  }

  render() {
    const { children, instances, xonchart, yonchart } = this.props;
    
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { instances, xonchart, yonchart })
    );     

    return (
      <svg width={500} height={500}>
        {childrenWithProps}
      </svg>
    );
  }
}

export default Axes;
