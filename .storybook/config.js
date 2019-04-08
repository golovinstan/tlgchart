import { configure } from '@storybook/react';

function loadStories() {
  require('./stories/examples.js');
  require('./stories/misc.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);