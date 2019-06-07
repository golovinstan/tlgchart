import React from 'react';
import { storiesOf } from '@storybook/react';

import markdownhelp from './markdownhelp.md';
import readmehelp from './readmehelp.md';

storiesOf('Misc', module)
  .add('Шпаргалка по Markdown', () =>(<div/>), { readme: { content: markdownhelp } }  )
  .add('Storybook README addon', () => (<div/>), { readme: { content: readmehelp } } )      
