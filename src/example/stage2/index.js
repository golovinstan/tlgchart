import React, {PureComponent} from 'react';
import Chart1 from './chart1';
import Chart5 from './chart5';



class TelegramContestStage2 extends PureComponent {
    constructor(props){
        super(props);
    }

    render(){

        return (
            <div>
                <Chart5/>
            </div>
        )
    }
}

export default TelegramContestStage2;