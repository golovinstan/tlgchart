import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import TelegramContest from '../../src/example/telegram';
import TwoAxisChart from '../../src/example/twoaxischart';

storiesOf('Examples', module)
  .add('Telegramm contest (stage2) - firefox compatible issue', () => (
    <TwoAxisChart/>
  ))
  .add('Telegramm contest (stage1)', () => (
    <TelegramContest/>
  ));
  
