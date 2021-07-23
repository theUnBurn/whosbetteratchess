export const compareRapidScores = (player1, player2) => {
  return player1.chess_rapid.last.rating - player2.chess_rapid.last.rating
};