import isEmpty from "lodash.isempty";

const PlayerCard = (props) => {
  const { player } = props;

  console.log(player);

  return !isEmpty(player) ? (
    <div style={{ margin: 20 }}>
      <img src={player.avatar} width={200} height={200} />
      <p> {player.name} </p>
      <p> {"Rapid rating: " + player.chess_rapid.last.rating} </p>
    </div>
  ) : (<></>)
};

export default PlayerCard;