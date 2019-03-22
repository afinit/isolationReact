import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import Game from './containers/Game/Game';


ReactDOM.render(
  <Game boardSize={5} />,
  document.getElementById('root')
);