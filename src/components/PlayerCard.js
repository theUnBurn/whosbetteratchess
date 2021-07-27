import isEmpty from "lodash.isempty";

const PlayerCard = (props) => {
  const { player } = props;

  return !isEmpty(player) ? (
    <div style={{ margin: 10 }}>
      <img src={player.avatar} width={150} height={150} />
      <p> {player.name || player.username} </p>
    </div>
  ) : (<></>)
};

export default PlayerCard;