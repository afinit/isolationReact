import React, { useState } from "react";
import Game from "./containers/Game";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import NewGameForm from "./containers/NewGameForm";
import { PlayerConfig } from "./components/PlayerConfigForm";

export default function App() {
  const [p1, setP1] = useState<PlayerConfig>({
    name: "Human1",
    actor: "Human"
  })
  const [p2, setP2] = useState<PlayerConfig>({
    name: "AI2",
    actor: "AI"
  })
  const [boardSize, setBoardSize] = useState(9);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game" render={() => <Game boardSize={boardSize} p1={p1} p2={p2} />} />
        <Route
          path="/"
          render={() => (
            <NewGameForm
              p1={p1}
              p2={p2}
              boardSize={boardSize}
              setP1={setP1}
              setP2={setP2}
              setBoardSize={setBoardSize}
            />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}
