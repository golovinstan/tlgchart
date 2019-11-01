import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// import TwoAxisChart from './example/twoaxischart';
// ReactDOM.render(<TwoAxisChart />, document.getElementById('root'));

import TelegramContest from './example/telegram';
ReactDOM.render(<TelegramContest />, document.getElementById('root'));

// import TelegramContestStage2 from './example/stage2';
// ReactDOM.render(<TelegramContestStage2 />, document.getElementById('root'));

// import DrawMousePath from './test/drawmousepath';
// ReactDOM.render(<DrawMousePath />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
