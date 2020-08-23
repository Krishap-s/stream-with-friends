window.playerStore.subscribe((e) => {
  const state = window.playerStore.getState();
  if (!state.isremote) {
    switch (state.playerState.paused) {
      case true:
        this.vidElem.pause();
        break;

      case false:
        this.vidElem.play();
        break;
    }

    this.vidElem.currentTime = state.playerState.currtime;
  }
});

this.vidElem.onplay = (e) => {
  if (window.playerStore.getState().isremote) {
    window.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.vidElem.paused, currtime: this.vidElem.currentTime } });
  }
};

this.vidElem.onpause = (e) => {
  if (window.playerStore.getState().isremote) {
    window.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.vidElem.paused, currtime: this.vidElem.currentTime } });
  }
};

this.vidElem.onseeked = (e) => {
  if (window.playerStore.getState().isremote) {
    window.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.vidElem.paused, currtime: this.vidElem.currentTime } });
  }
};
