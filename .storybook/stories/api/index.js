import React from 'react';
import { storiesOf } from '@storybook/react';

import Chart5 from '../../../src/example/stage2/chart5';

import axismd from './axis.md';
import linesmd from './lines.md';
import viewmd from './view.md';
import background from './background.md';
import arealine from './arealine.md';


storiesOf('Api', module)
  
  .add('View', () =>(<div/>), { readme: { content: viewmd } }  )  
  .add('Axis', () => (<div/>), { readme: { content: axismd } }  )
  .add('Lines', () => ( <div/> ), { readme: { content: linesmd } } )      
  .add('AreaLine', () => ( <div/> ), { readme: { content: arealine } } )      
  .add('Background', () =>(<Chart5/>), { readme: { content: background } }  )  

  





