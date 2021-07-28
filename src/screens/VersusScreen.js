import { useEffect, useState } from "react";
import * as chessAPI from "api/chesscom";
import PlayerCard from "components/PlayerCard";
import TitleCard from "components/TitleCard";
import StatsTable from "components/StatsTable";
import ScoreCompareCard from "components/ScoreCompareCard";


const VersusScreen = (props) => {

  const { names } = props;

  const [players, setPlayers] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reqs = [];
    setLoading(true);

    for (const name of names) {
      reqs.push(chessAPI.getPlayerInformation(name).then((data) => setPlayers(players => ({...players, [name]: data}))));
    };
    
    Promise.all(reqs).then(() => setLoading(false)).catch(console.log);
  }, []);
 
  const renderPlayerCards = () => {
    const cards = [];
    for (const name of names) {
      cards.push(<PlayerCard player={players[name]} />)
    };
    return cards;
  };

  return loading ? <></> : (
    <div className="App">
      <header className="App-header">
        <TitleCard />
        <div style={styles.playerCard}>
          {renderPlayerCards()}
        </div>
        <ScoreCompareCard player1={players[names[0]]} player2={players[names[1]]} />
        <StatsTable players={names.map(name => players[name])}/>
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