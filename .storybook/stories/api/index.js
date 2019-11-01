import React from 'react';
import { storiesOf } from '@storybook/react';

import Chart5 from '../../../src/example/stage2/chart5';

import axismd from './axis.md';
import linesmd from './lines.md';
import viewmd from './view.md';
import background from './background.md';
import arealine from './arealine.md';
import backgroundanimatecolor from './backgroundanimatecolor.md';
import backgroundanimateimage from './backgroundanimateimage.md';
import backgroundanimatetransparent from './backgroundanimatetransparent.md';
import bararealine from './bararealine.md';
import dotsline from './dotsline.md';
import horizontaxis from './horizontaxis.md';
import pieline from './pieline.md';
import simpleline from './simpleline.md';
import verticalbox from './verticalbox.md';
import verticalaxis from './verticalaxis.md';
import verticalline from './verticalline.md';


storiesOf('Components', module)
  
  .add('View', () =>(<div/>), { readme: { content: viewmd } }  )  
  .add('Axis', () => (<div/>), { readme: { content: axismd } }  )
  .add('HorizontAxis', () => (<div/>), { readme: { content: horizontaxis } }  )
  .add('VericalAxis', () => (<div/>), { readme: { content: verticalaxis } }  )
  .add('Lines', () => ( <div/> ), { readme: { content: linesmd } } )      
  .add('AreaLine', () => ( <div/> ), { readme: { content: arealine } } )      
  .add('BarAreaLine', () => ( <div/> ), { readme: { content: bararealine } } )      
  .add('DotsLine', () => ( <div/> ), { readme: { content: dotsline } } )        
  .add('PieLine', () => ( <div/> ), { readme: { content: pieline } } )        
  .add('SimpleLine', () => ( <div/> ), { readme: { content: simpleline } } )        
  .add('VericalLine', () => ( <div/> ), { readme: { content: verticalline } } )        
  .add('VerticalBox', () => ( <div/> ), { readme: { content: verticalbox } } )        
  .add('Background', () =>(<div/>), { readme: { content: background } }  )  
  .add('BackgroundAnimateColor', () =>(<div/>), { readme: { content: backgroundanimatecolor } }  )  
  .add('BackgroundAnimateImage', () =>(<div/>), { readme: { content: backgroundanimateimage } }  )  
  .add('BackgroundAnimateTransparent', () =>(<div/>), { readme: { content: backgroundanimatetransparent } }  )  

  





