function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h < 10 ? `0${h}` : `${h}`;
  var mDisplay = m < 10 ? `0${m}` : `${m}`;
  var sDisplay = s < 10 ? `0${s}` : `${s}`;
  return `${hDisplay}:${mDisplay}:${sDisplay}`;
}

export const TIME_CLASSES = {
  RAPID: "rapid",
};

const CHESS_COLORS = {
  WHITE: "white",
  BLACK: "black",
}

const MS_IN_A_DAY = 86400000;

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();


const getColorOfPlayer = (username, game) => {
  const { white, black } = game;

  if (white.username.toLowerCase() === username) {
    return CHESS_COLORS.WHITE;
  }
  else if (black.username.toLowerCase() === username) {
    return CHESS_COLORS.BLACK;
  };
};

const getGameResultForUser = (username, game) => {
  const { white, black } = game;

  if (white.username.toLowerCase() === username) {
    return white;
  }
  else if (black.username.toLowerCase() === username) {
    return black;
  };
};

export const getGamesForToday = (games) => {
  if (!games) return [];

  const todayGames = [];
  const today = new Date();
  for (const game of games) {
    const pgnDate = new Date(game.end_time * 1000);
    if (datesAreOnSameDay(today, pgnDate)) {
      todayGames.push(game);
    };
  };
  return todayGames;
};

const getLastGameBeforeToday = (games) => {
  if (!games) return [];

  const beforeGames = [];
  const today = new Date();
  for (const game of games) {
    const pgnDate = new Date(game.end_time * 1000);
    if ((!datesAreOnSameDay(today, pgnDate))) {
      beforeGames.push(game);
    };
  };

  beforeGames.sort((a, b) => a.end_time - b.end_time);

  if (beforeGames.length === 0) {
    return undefined;
  };

  return beforeGames[beforeGames.length - 1];
};

export const gamesWonLossDrawnToday = (currentPlayer) => {
  const { username: currentUsername, games } = currentPlayer;
  if (!games) return {
    wins: 0,
    losses: 0,
    draws: 0,
  };
  let wins = 0;
  let losses = 0;
  let draws = 0;
  const username = currentUsername.toLowerCase();
  for (const game of getGamesForToday(games)) {
    const { white, black } = game;
    if (white.result === black.result) {
      draws++;
    }
    else if (white.username.toLowerCase() === username) {
      white.result === "win" ? wins++ : losses++;
    }
    else if (black.username.toLowerCase() === username) {
      black.result === "win" ? wins++ : losses++;
    };
  };
  return {
    wins, losses, draws
  }
};

export const getTimeInChessGamesToday = (currentPlayer) => {
  const { games } = currentPlayer;

  const METADATA_REGEX = /(?<=\[)(Start|End)Time.+?(?=\])/g;
  let totalTime = 0;
  for (const game of getGamesForToday(games)) {
    const pgn = game.pgn;
    let startTime = 0;
    let endTime = 0;
    for (const time of [...pgn.matchAll(METADATA_REGEX)]) {
      const timestamp = time[0].split(" ")[1].replaceAll("\"", "");
      if (time[1] === "Start") {
        startTime = Date.parse(`01 Jan 1970 ${timestamp} UTC`)
      } else {
        endTime = Date.parse(`01 Jan 1970 ${timestamp} UTC`)
      }
    };

    if (startTime > endTime) {
      endTime = endTime + MS_IN_A_DAY;
    };

    totalTime += (endTime - startTime);
  };
  return secondsToHms(totalTime / 1000);
};

export const getMostRecentResult = (currentPlayer) => {
  const { username: currentUsername, games } = currentPlayer;
  const UNKNOWN = "unknown";
  if (!games) return UNKNOWN;
  const username = currentUsername.toLowerCase();

  const lastGame = games[games.length - 1];
  if (!lastGame) {
    return UNKNOWN;
  };
  return getColorOfPlayer(username, lastGame) == CHESS_COLORS.WHITE ? lastGame.white.result : lastGame.black.result;
};

export const eloGainedToday = (currentPlayer) => {
  const { username: currentUsername, games } = currentPlayer;
  if (!games) return 0;
  const username = currentUsername.toLowerCase();

  const ratedRapidGames = getGamesForToday(games)
  const lastOldGame = getLastGameBeforeToday(games);

  if (ratedRapidGames.length === 0) return 0;
  const firstRating = lastOldGame ? getGameResultForUser(username, lastOldGame).rating : getGameResultForUser(username, ratedRapidGames[0]).rating;
  const recentGameRating = getGameResultForUser(username, ratedRapidGames[ratedRapidGames.length - 1]).rating;

  return recentGameRating - firstRating;
};