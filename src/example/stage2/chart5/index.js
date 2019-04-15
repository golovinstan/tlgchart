import React, { PureComponent } from 'react';
import PercentageStackedAreaChart from './percentagestackedareachart';
import PieChart from './pieline'


class Chart5 extends PureComponent {
    constructor(props){
        super(props);
        this.state={
          charttype:'pie',
          backimage: null
        }
    }

    onChangeChartType = () => {
      const { charttype } = this.state;
      const chart = this.chart;
      let backimage = '';
      if (chart) {
        backimage = chart.exportLinesToString();
      }

      if ( charttype == 'pie' ){
        this.setState({charttype: 'percentagestackedareachart', backimage});
      } else {
        this.setState({charttype: 'pie', backimage});
      }
    }

    render(){            
      const { charttype, backimage } = this.state;
      let Chart = PercentageStackedAreaChart;
      if (charttype == 'pie'){
        Chart = PieChart;
      }

      return (
        <Chart
          ref={ el => this.chart = el }
          onChangeChartType={this.onChangeChartType}
          backimage={backimage}
        />
      )
    }
}

export default Chart5;