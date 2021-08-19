import chessAPI from "chess-web-api";
import promiseRetry from "promise-retry";
import { TIME_CLASSES } from "utils/chessUtils";

const chessdotcom = new chessAPI();

const WAIT_IN_MS = 500;
const NUMBER_OF_RETRIES = 2;
const HEADERS = {
  "Content-Type": "application/json",
}

const getNMonthAgo = (N) => {
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() - N);
  return { year: newDate.getFullYear(), month: (newDate.getMonth() % 12) + 1, }
};

export const getPlayer = async (player) => {
  const apiCall = () => chessdotcom.getPlayer(player, {}, undefined).then(({ body }) => body);
  return promiseRetry(apiCall);
};


export const getPlayerStats = async (player) => {
  const apiCall = () => chessdotcom.getPlayerStats(player, {}, undefined).then(({ body }) => body);
  return promiseRetry(apiCall);
};

export const getPlayerGamesForMonth = (player, year, month) => {
  const apiCall = () => chessdotcom.getPlayerCompleteMonthlyArchives(player, year, month, {}, undefined).then(({ body }) => {
    return body.games;
  });
  return promiseRetry(apiCall, { retries: 10 });
};

export const getPlayerGamesForPastNMonths = (player, N) => {
  const reqs = [];
  for (let i = 0; i <= N; i++) {
    const { month, year } = getNMonthAgo(i);
    reqs.push(getPlayerGamesForMonth(player, year, month))
  };
  return Promise.allSettled(reqs).then(gamesPerMonth => gamesPerMonth.map((game) => game.value ? game.value : []).flat());
};

export const getRecentPlayerGames = (player) => {
  const reqs = [];
  const { month: currentMonth, year: currentYear } = getNMonthAgo(0);
  reqs.push(getPlayerGamesForMonth(player, currentYear, currentMonth));

  if ((new Date()).getDate() === 1) {
    const { month: previousMonth, year: previousYear } = getNMonthAgo(1);
    reqs.push(getPlayerGamesForMonth(player, previousYear, previousMonth));
  };
  return Promise.allSettled(reqs).then(gamesPerMonth => gamesPerMonth.map((game) => game.value ? game.value : []).flat());

};

export const getPlayerInformation = (player) => {
  const reqs = [];
  reqs.push(getPlayerStats(player));
  reqs.push(getPlayer(player));
  reqs.push(getRecentPlayerGames(player));

  return Promise.allSettled(reqs).then(values => {
    return {
      ...values[0].value,
      ...values[1].value,
      games: values[2].value ? values[2].value.filter(game => game.time_class === TIME_CLASSES.RAPID && game.rated).sort((a, b) => a.end_time - b.end_time) : [],
    }
  }).catch(error => console.log("error", error));
};