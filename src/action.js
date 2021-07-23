import chessAPI from "chess-web-api";

import * as types from "actionTypes";

const chessdotcom = new chessAPI();

const getPlayerData = (playerName) => {
    // chessdotcom.getPlayer(playerName).then()
    return {
        types: types.GET_PLAYER_INFO,
    }
}

const increment = () => ({type: INCREMENT_COUNTER});
const decrement = () => ({type: DECREMENT_COUNTER});

export {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER,
  increment,
  decrement
}