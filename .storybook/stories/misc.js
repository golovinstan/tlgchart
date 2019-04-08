import React from 'react';
import { storiesOf } from '@storybook/react';
import CommonSVG from '../../src/components/commonsvg';

storiesOf('Misc', module)
  .add('Common SVG', () => (
    <CommonSVG/>
  ));