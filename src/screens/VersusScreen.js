import { useEffect, useState } from "react";
import * as chessAPI from "api/chesscom";
import PlayerCard from "components/PlayerCard";
import TitleCard from "components/TitleCard";
import StatsTable from "components/StatsTable";
import ScoreCompareCard from "components/ScoreCompareCard";


const VersusScreen = (props) => {

  const { name1, name2 } = props;

  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const player1Info = [];
    const player2Info = [];
    const games = [];

    player1Info.push(chessAPI.getPlayer(name1));
    player1Info.push(chessAPI.getPlayerStats(name1));
    const promise1 = Promise.all(player1Info).then(bodies => setPlayer1({ ...bodies.reduce((body, acc) => ({...acc, ...body}), {})}))

    player2Info.push(chessAPI.getPlayer(name2));
    player2Info.push(chessAPI.getPlayerStats(name2));
    const promise2 = Promise.all(player2Info).then(bodies => setPlayer2({ ...bodies.reduce((body, acc) => ({...acc, ...body}), {})}));

    games.push(chessAPI.getPlayerGamesForPastNMonths(name1, 0).then(playerGames => setPlayer1(player1 => ({...player1, games: playerGames}))));
    games.push(chessAPI.getPlayerGamesForPastNMonths(name2, 0).then(playerGames => setPlayer2(player2 => ({...player2, games: playerGames}))));
    const gamesPromises = Promise.all(games);

    Promise.all([promise1, promise2, gamesPromises]).finally(() => setLoading(false));
  }, []);


  return loading ? <></> : (
    <div className="App">
      <header className="App-header">
        <TitleCard />
        <div style={styles.playerCard}>
          <PlayerCard player={player1} />
          <PlayerCard player={player2} />
        </div>
        <ScoreCompareCard player1={player1} player2={player2} />
        <StatsTable players={[player1, player2]}/>
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