/* eslint-disable no-unused-vars */
const playerInitialState = {
  isremote: false,
  torrent: null,
  playerState: {
    paused: true,
    currtime: 0,
  },
};

function playerStateReducer(state = playerInitialState.playerState, action) {
  return action;
}

function playerReducer(state = playerInitialState, action) {
  switch (action.type) {
    case 'CHANGE_STATE':
      return { ...state, playerState: playerStateReducer(state.playerState, action.playerState) };

    case 'SET_REMOTE':
      return { ...state, isremote: !state.isremote };

    case 'TORRENT_LEARNED':
      return { ...state, torrent: action.torrent };

    default:
      return state;
  }
}

export default playerReducer;
