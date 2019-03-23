import React, { Component } from 'react';
import TestData from './testdata';
import Chart from './chart';


class TelegramContest extends Component {
    render() {
        return (
            <div>
                {
                    TestData.map( (data, i) => <Chart data={data} caption={`Telegram contest data № ${i+1}`} key={i} /> )
                }
            </div>
        );
    }
}

export default TelegramContest;
