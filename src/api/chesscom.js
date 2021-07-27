import chessAPI from "chess-web-api";

const chessdotcom = new chessAPI();

const WAIT_IN_MS = 500; 
const NUMBER_OF_RETRIES = 2; 

const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, delay=WAIT_IN_MS, retries=NUMBER_OF_RETRIES) => new Promise((resolve, reject) => {
  return operation
    .then(resolve)
    .catch((reason) => {
      if (retries > 0) {
        return wait(delay)
          .then(retryOperation.bind(null, operation, delay, retries - 1))
          .then(resolve)
          .catch(reject);
      }
      return reject(reason);
    });
});

const getNMonthAgo = (N) => {
  const newDate = new Date();
  newDate.setDate(newDate.getMonth() - N);
  return { year: newDate.getFullYear(), month: (newDate.getMonth() % 12) + 1, }
};

export const getPlayer = async (player) => {
  const apiCall = chessdotcom.getPlayer(player).then(({ body }) => body);
  return retryOperation(apiCall);
};


export const getPlayerStats = async (player) => {
  const apiCall = chessdotcom.getPlayerStats(player).then(({ body }) => body);
  return retryOperation(apiCall);
};

export const getPlayerGamesForMonth = (player, year, month) => { 
  const apiCall = chessdotcom.getPlayerCompleteMonthlyArchives(player, year, month).then(({body}) => {
    return body.games;
  });
  return retryOperation(apiCall);  
};


export const getPlayerGamesForPastNMonths = (player, N) => { 
  const reqs = [];
  for (let i = 0; i <= N; i++) {
    const { month, year } = getNMonthAgo(i);
    reqs.push(getPlayerGamesForMonth(player, year, month ))
  };
  return retryOperation(Promise.all(reqs)).then(gamesPerMonth => gamesPerMonth.flat());  
};