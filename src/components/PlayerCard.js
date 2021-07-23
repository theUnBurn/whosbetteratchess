const PlayerCard = (props) => {
  const { player } = props;

  console.log(player);

  return player ? (
    <div>
      <img src={player.avatar} width={300} height={300} />
      <p> {"player info: " + player.name} </p>
      <p> {"Rapid rating: " + player.chess_rapid.last.rating} </p>
    </div>
  ) : (<></>)
};

export default PlayerCard;