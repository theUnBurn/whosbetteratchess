import isEmpty from "lodash.isempty";
import { compareRapidScores } from "utils/scoresUtils";

const ScoreCompareCard = (props) => {
  const { player1, player2 } = props;
  const { name: name1 } = player1;
  const { name: name2 } = player2;

  const eloDifference = compareRapidScores(player1, player2);
  const betterPlayer = eloDifference > 0 ? name1 : name2;
  const worsePlayer = eloDifference > 0 ? name2 : name1;
  let whosBetterString = `${betterPlayer} is better than ${worsePlayer} by ${Math.abs(eloDifference)} points`;
  if (eloDifference === 0) whosBetterString = "It's a tie!";
  return (
    <div>
      <h2> {whosBetterString} </h2>
    </div>
  );
};

export default ScoreCompareCard;