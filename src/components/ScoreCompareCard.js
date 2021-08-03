import { compareRapidScores } from "utils/scoresUtils";

const ScoreCompareCard = (props) => {
  const { player1, player2 } = props;
  const { name: name1, username: username1 } = player1;
  const { name: name2, username: username2 } = player2;

  const player1Name = name1 || username1;
  const player2Name = name2 || username2;

  const eloDifference = compareRapidScores(player1, player2);
  const betterPlayer = eloDifference > 0 ? player1Name : player2Name;
  const worsePlayer = eloDifference > 0 ? player2Name : player1Name;
  let whosBetterString = `${betterPlayer} is better than ${worsePlayer} by ${Math.abs(
    eloDifference
  )} points`;
  if (eloDifference === 0) whosBetterString = "It's a tie!";
  return (
    <div>
      <h4 align="center"> {whosBetterString} </h4>
    </div>
  );
};

export default ScoreCompareCard;
