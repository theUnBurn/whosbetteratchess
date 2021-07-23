import { useEffect, useState } from "react";
import chessAPI from "api/chesscom";
import PlayerCard from "components/PlayerCard";
import TitleCard from "components/TitleCard";
import ScoreCompareCard from "components/ScoreCompareCard";
const VersusScreen = (props) => {

  const { name1, name2 } = props;

  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const player1Info = [];
    const player2Info = [];

    player1Info.push(chessAPI.getPlayer(name1));//.then(({ body }) => setPlayer1({ ...player1, ...body }));
    player1Info.push(chessAPI.getPlayerStats(name1))//.then(({ body }) => setPlayer1({ ...player1, ...body }));
    const promise1 = Promise.all(player1Info).then(bodies => setPlayer1({ ...bodies[0].body, ...bodies[1].body }))

    player2Info.push(chessAPI.getPlayer(name2));//.then(({ body }) => setPlayer1({ ...player1, ...body }));
    player2Info.push(chessAPI.getPlayerStats(name2))//.then(({ body }) => setPlayer1({ ...player1, ...body }));
    const promise2 = Promise.all(player2Info).then(bodies => setPlayer2({ ...bodies[0].body, ...bodies[1].body }))

    Promise.all([promise1, promise2]).finally(() => setLoading(false));
  }, []);
  console.log(loading);

  return loading ? <></> : (
    <div className="App">
      <header className="App-header">
        <TitleCard />
        <div style={styles.playerCard}>
          <PlayerCard player={player1} />
          <PlayerCard player={player2} />
        </div>
        <ScoreCompareCard player1={player1} player2={player2} />
      </header>
    </div>
  );
};

const styles = {
  playerCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  }
}

export default VersusScreen;