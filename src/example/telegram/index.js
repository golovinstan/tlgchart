import React, { Component } from 'react';
import TestData from './testdata';
import Chart from './chart';


class TelegramContest extends Component {
    render() {
        return (
            <div>
                {
                    TestData.map( (data, i) => <Chart data={data} key={i} /> )
                }
            </div>
        );
    }
}

export default TelegramContest;
