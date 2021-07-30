import chessAPI from "chess-web-api";
import { TIME_CLASSES } from "utils/chessUtils";

const chessdotcom = new chessAPI();

const WAIT_IN_MS = 500;
const NUMBER_OF_RETRIES = 2;
const HEADERS = {
  "Content-Type": "application/json",
}

const wait = ms => {
  console.log("waiting");
  return new Promise(r => setTimeout(r, ms))
};

const retryOperation = (operation, options = {}, retries = NUMBER_OF_RETRIES) => {
  return operation();
}

const getNMonthAgo = (N) => {
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() - N);
  return { year: newDate.getFullYear(), month: (newDate.getMonth() % 12) + 1, }
};

export const getPlayer = async (player, shouldRetry=true) => {
  const apiCall = chessdotcom.getPlayer(player, {}, undefined).then(({ body }) => body).catch(() => shouldRetry ? wait(WAIT_IN_MS).getPlayer(player, false) : {});;
  return retryOperation(() => apiCall);
};


export const getPlayerStats = async (player, shouldRetry=true) => {
  const apiCall = chessdotcom.getPlayerStats(player, {}, undefined).then(({ body }) => body).catch(() => shouldRetry ? wait(WAIT_IN_MS).getPlayerStats(player, false) : {});
  return retryOperation(() => apiCall);
};

export const getPlayerGamesForMonth = (player, year, month, shouldRetry=true) => {
  const apiCall = chessdotcom.getPlayerCompleteMonthlyArchives(player, year, month, {}, undefined).then(({ body }) => {
    return body.games;
  }).catch(() => shouldRetry ? wait(WAIT_IN_MS).getPlayerGamesForMonth(player, year, month, false) : {});
  return retryOperation(() => apiCall);
};

export const getPlayerGamesForPastNMonths = (player, N) => {
  const reqs = [];
  for (let i = 0; i <= N; i++) {
    const { month, year } = getNMonthAgo(i);
    reqs.push(getPlayerGamesForMonth(player, year, month))
  };
  return Promise.allSettled(reqs).then(gamesPerMonth => gamesPerMonth.map((game) => game.value ? game.value : []).flat());
};

export const getPlayerInformation = (player, numberOfMonths = 1) => {
  const reqs = [];
  reqs.push(getPlayerStats(player));
  reqs.push(getPlayer(player));
  reqs.push(getPlayerGamesForPastNMonths(player, numberOfMonths));
  
  return Promise.allSettled(reqs).then(values => ({
    ...values[0].value,
    ...values[1].value,
    games: values[2].value ? values[2].value.filter(game => game.time_class === TIME_CLASSES.RAPID && game.rated).sort((a, b) => b.end_time - a.end_time) : [],
  })).catch(error => console.log("error", error));
};