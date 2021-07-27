const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === first.getFullYear() &&
    first.getMonth() === first.getMonth() &&
    first.getDate() === second.getDate();

export const getGamesForToday = (games) => {
  if(!games) return [];

  const todayGames = [];
  const today = new Date();
  for (const game of games) {
    const pgnDate = new Date(game.end_time * 1000);
    if(datesAreOnSameDay(today, pgnDate)) {
      todayGames.push(game);
    }; 
  };
  return todayGames;
};

export const gamesWonLossDrawn = (currentPlayer, games) => {
  if(!games) return [];
  let wins = 0;
  let losses = 0;
  let draws = 0;
  const username = currentPlayer.toLowerCase();
  for (const game of games) {
    const { white, black } = game;
    if(white.result === black.result) {
      draws++;
    }
    else if(white.username.toLowerCase() === username) {
      white.result === "win" ? wins++ : losses++;  
    }
    else if(black.username.toLowerCase() === username) {
      black.result === "win" ? wins++ : losses++;
    };
  };
  return {
    wins, losses, draws
  }
};