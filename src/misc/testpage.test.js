import React from 'react';
import ReactDOM from 'react-dom';
import TestPage from './testpage';

it('render TestPage without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TestPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
