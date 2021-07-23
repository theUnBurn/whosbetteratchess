import { useEffect, useState } from "react";
import chessAPI from "api/chesscom";
import PlayerCard from "components/PlayerCard";

const VersusScreen = (props) => {
  const { name1, name2 } = props;

  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});

  useEffect(() => {
    chessAPI.getPlayer(name1).then(({ body }) => setPlayer1({ ...player1, ...body }));
    chessAPI.getPlayerStats(name1).then(({ body }) => setPlayer1({ ...player1, ...body }));

    chessAPI.getPlayer(name2).then(({ body }) => setPlayer2({ ...player2, ...body }));
    chessAPI.getPlayerStats(name2).then(({ body }) => setPlayer2({ ...player2, ...body }));
  }, []);

  console.log(player1);
  return (
    <div className="App">
      <header className="App-header">
        <PlayerCard player={player1} />
        <PlayerCard player={player2} />
      </header>
    </div>
  );
};

export default VersusScreen;