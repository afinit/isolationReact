import React from "react";

export default () => (
  <div className="rules">
    <h3>Rules</h3>
    <ul>
      <li>2 players trade turns moving the game piece (ø)</li>
      <li>
        The game piece (ø) can be moved like a queen in chess. Horizontally,
        vertically, diagonally.
      </li>
      <li>
        Moves cannot be to or through previous moves, these will be marked as
        (#)
      </li>
      <li>First move can go anywhere</li>
      <li>Last player to be able to move wins the game</li>
    </ul>
  </div>
);
