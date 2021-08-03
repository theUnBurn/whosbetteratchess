import isEmpty from "lodash.isempty";

const PlayerCard = (props) => {
  const { player } = props;

  return !isEmpty(player) ? (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <span>
        <img src={player.avatar} width={50} height={50} />
      </span>
      <span style={{ fontSize: 15 }}> {player.name || player.username} </span>
    </span>
  ) : (
    <></>
  );
};

export default PlayerCard;
