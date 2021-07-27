
const TIME_CLASSES = {
  RAPID: "rapid",
};

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === first.getFullYear() &&
    first.getMonth() === first.getMonth() &&
    first.getDate() === second.getDate();

const getGameResultForUser = (username, game) => {
  const { white , black } = game;

  if(white.username.toLowerCase() === username) {
    return white;  
  }
  else if(black.username.toLowerCase() === username) {
    return black;
  };
};

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

export const gamesWonLossDrawnToday = (currentPlayer, games) => {
  if(!games) return {
    wins: 0,
    losses: 0,
    draws: 0,
  };
  let wins = 0;
  let losses = 0;
  let draws = 0;
  const username = currentPlayer.toLowerCase();
  for (const game of getGamesForToday(games)) {
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

export const eloGainedToday = (currentPlayer, games) => {
  if(!games) return 0;
  const username = currentPlayer.toLowerCase();
  const todayGames = getGamesForToday(games).sort((a, b) => a.end_time - b.end_time);
  const ratedRapidGames = todayGames.filter(game => game.time_class === TIME_CLASSES.RAPID && game.rated);

  if(ratedRapidGames.length === 0) return 0;
  const firstGame = getGameResultForUser(username, ratedRapidGames[0]);
  const lastGame = getGameResultForUser(username, ratedRapidGames[ratedRapidGames.length - 1]);
  return lastGame.rating - firstGame.rating;
};