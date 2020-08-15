const playerInitialState = {
	isremote:true,
	playerState:{
	paused:true,
	currtime:0,
	},
}

function playerStateReducer(state=playerInitialState.playerState,action){
	return action;
}

function player (state=playerInitialState, action) {
	
	switch(action.type){

		case 'CHANGE_STATE':
			return {...state,playerState:playerStateReducer(state.playerState,action.playerState)};

		case 'BECOME_REMOTE':
			return {...state,isremote:!state.isremote};

		default:
			return state;
	}
}

export default player;
