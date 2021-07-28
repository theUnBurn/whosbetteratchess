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
    const reqs = [];
    setLoading(true);
    reqs.push(chessAPI.getPlayerInformation(name1).then(setPlayer1));
    reqs.push(chessAPI.getPlayerInformation(name2).then(setPlayer2));
    
    Promise.all(reqs).then(() => setLoading(false)).catch(console.log);
  }, []);
 
  console.log(loading, player1?.games?.length, player2?.games?.length);
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