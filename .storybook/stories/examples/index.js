import React from 'react';
import { storiesOf } from '@storybook/react';

import TelegramContest from '../../../src/example/telegram';
import TelegramContestStage2 from '../../../src/example/stage2';

import telegramstage1 from './telegramstage1.md';
import telegramstage2 from './telegramstage2.md';

storiesOf('Examples', module)
  .add('Telegramm contest (stage1)', () => (<TelegramContest/>), { readme: { content: telegramstage1 } }  )
  .add('Telegramm contest (stage2)', () => ( <TelegramContestStage2/> ), { readme: { content: telegramstage2 } } )      




