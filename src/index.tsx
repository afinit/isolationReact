import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import Game from './containers/Game';


ReactDOM.render(
  <Game boardSize={7} />,
  document.getElementById('root')
);