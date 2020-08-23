/* eslint-disable no-unused-vars */
const playerInitialState = {
  isremote: true,
  playerState: {
    paused: true,
    currtime: 0,
  },
};

function playerStateReducer(state = playerInitialState.playerState, action) {
  return action;
}

function player(state = playerInitialState, action) {
  switch (action.type) {
    case 'CHANGE_STATE':
      return { ...state, playerState: playerStateReducer(state.playerState, action.playerState) };

    case 'BECOME_REMOTE':
      return { ...state, isremote: !state.isremote };

    default:
      return state;
  }
}

const connectionInitialState = {
  uid: null,
  remoteiswith: null,
  connList: {},
};

function connection(state = connectionInitialState, action) {
  switch (action.type) {
    case 'SET_ID':
      if (state.uid == null) {
        return { ...state, uid: action.uid };
      }

    case 'ADD_CONN':
      return { ...state, connList: connListReducer(state.connList, action) };

    case 'GIVE_REMOTE':
      if (state.uid !== state.remoteiswith) {
        return { ...state, remoteiswith: action.uid };
      }

      return state;

    case 'SET_REMOTE':
      if (state.remoteiswith == null) {
        return { ...state, remoteiswith: action.uid };
      }

      return state;

    case 'REMOVE_CONN':
      return { ...state, connList: connListReducer(state.connList, action) };

    default:
      return state;
  }
}

export default player;
