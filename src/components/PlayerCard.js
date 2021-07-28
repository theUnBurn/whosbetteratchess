import isEmpty from "lodash.isempty";

const PlayerCard = (props) => {
  const { player } = props;

  return !isEmpty(player) ? (
    <div style={{ margin: 10 }}>
      <img src={player.avatar} width={50} height={50} />
      <p style={{fontSize: 20}}> {player.name || player.username} </p>
    </div>
  ) : (<></>)
};

export default PlayerCard;