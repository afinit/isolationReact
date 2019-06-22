import React, { useState } from "react";
import Game from "./containers/Game";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import NewGameForm from "./containers/NewGameForm";

export default function App() {
  const [p1Name, setP1Name] = useState("P1");
  const [p2Name, setP2Name] = useState("AI");
  const [boardSize, setBoardSize] = useState(9);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game" render={() => <Game boardSize={boardSize} />} />
        <Route
          path="/"
          render={() => (
            <NewGameForm
              p1Name={p1Name}
              p2Name={p2Name}
              boardSize={boardSize}
              setP1Name={setP1Name}
              setP2Name={setP2Name}
              setBoardSize={setBoardSize}
            />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}
