import isEmpty from "lodash.isempty";

const PlayerCard = (props) => {
  const { player } = props;

  console.log(player);

  return !isEmpty(player) ? (
    <div style={{ margin: 10 }}>
      <img src={player.avatar} width={150} height={150} />
      <p> {player.name} </p>
      <p> {"Rapid rating: " + player.chess_rapid.last.rating} </p>
    </div>
  ) : (<></>)
};

export default PlayerCard;