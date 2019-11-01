import React, { Component } from 'react';
import TestData from './testdata';
import Chart from './chart';
import ChartCaption from './chartcaption';
import { COLOR_DEFAULT } from '../../components';


class TelegramContest extends Component {
    render() {
        return (
            <div>
                <ChartCaption
                    width={"100%"}
                    height={50}
                    caption={`https://github.com/golovinstan/tlgchart`}
                    color={COLOR_DEFAULT}
                />                
                {
                    TestData.map( (data, i) => <Chart data={data} caption={`Telegram contest data № ${i+1}`} key={i} /> )
                }
            </div>
        );
    }
}

export default TelegramContest;
