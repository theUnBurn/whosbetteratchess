import chessAPI from "chess-web-api";

const chessdotcom = new chessAPI();

const WAIT_IN_MS = 500; 
const NUMBER_OF_RETRIES = 2; 

const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, options = {}, retries = NUMBER_OF_RETRIES) => {
  return operation()
    .then(res => res)
    .catch(error => {
      console.log("error", error, retries);
      if (retries > 0) {
        return wait(WAIT_IN_MS).then(() => retryOperation(operation, options, retries - 1))
      } else {
        console.log("final error");
        return {};
      }
    })
}

const getNMonthAgo = (N) => {
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() - N);
  return { year: newDate.getFullYear(), month: (newDate.getMonth() % 12) + 1, }
};

export const getPlayer = async (player) => {
  const apiCall = chessdotcom.getPlayer(player).then(({ body }) => body);
  return retryOperation(() => apiCall);
};


export const getPlayerStats = async (player) => {
  const apiCall = chessdotcom.getPlayerStats(player).then(({ body }) => body);
  return retryOperation(() => apiCall);
};

export const getPlayerGamesForMonth = (player, year, month) => { 
  const apiCall = chessdotcom.getPlayerCompleteMonthlyArchives(player, year, month).then(({body}) => {
    return body.games;
  });
  return retryOperation(() => apiCall);  
};

export const getPlayerGamesForPastNMonths = (player, N) => { 
  const reqs = [];
  for (let i = 0; i <= N; i++) {
    const { month, year } = getNMonthAgo(i);
    reqs.push(getPlayerGamesForMonth(player, year, month ))
  };
  return Promise.all(reqs).then(gamesPerMonth => gamesPerMonth.flat());  
};

export const getPlayerInformation = (player, numberOfMonths = 0) => {
  const reqs = [];
  reqs.push(getPlayerStats(player));
  reqs.push(getPlayer(player));
  reqs.push(getPlayerGamesForPastNMonths(player, numberOfMonths));
  return Promise.all(reqs).then(values => ({
    ...values[0],
    ...values[1],
    games: values[2]
  }));
};