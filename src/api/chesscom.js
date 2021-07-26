import chessAPI from "chess-web-api";
const chessdotcom = new chessAPI();

const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, delay, retries) => new Promise((resolve, reject) => {
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

export const getPlayer = async (player) => {
  const apiCall = chessdotcom.getPlayer(player).then(({ body }) => body);
  return retryOperation(apiCall, 500, 2);
};


export const getPlayerStats = async (player) => {
  const apiCall = chessdotcom.getPlayerStats(player).then(({ body }) => body);
  return retryOperation(apiCall, 500, 2);
};
