import Webtorrent from 'webtorrent/webtorrent.min';
import controls from './controls';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["showControls","hideControls"] }] */
class Player {
  constructor(torrent, vidElem) {
    this.vidElem = vidElem;
    console.log(this.vidElem);
    // eslint-disable-next-line no-undef
    this.Player = new Plyr(this.vidElem, { controls, ratio: '21:9', clicktoPlay: 'false' });
    this.hideControls();
    // setting event listener to player store
    window.playerStore.subscribe(() => {
      const state = window.playerStore.getState();
      console.log(state.isremote);
      switch (state.isremote) {
        case true:
          this.showControls();
          break;

        default:
          this.hideControls();
          break;
      }
      if (!state.isremote) {
        switch (state.playerState.paused) {
          case true:
            this.Player.pause();
            break;

          default:
            this.Player.play();
            break;
        }

        this.Player.currentTime = state.playerState.currtime;
      }
    });

    // setting event listeners from playerStore to player.
    this.Player.onplay = () => {
      if (window.playerStore.getState().isremote) {
        window.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.Player.paused, currtime: this.Player.currentTime } });
      }
    };

    this.Player.onpause = () => {
      if (window.playerStore.getState().isremote) {
        window.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.Player.paused, currtime: this.Player.currentTime } });
      }
    };

    this.Player.onseeked = () => {
      if (window.playerStore.getState().isremote) {
        window.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.Player.paused, currtime: this.Player.currentTime } });
      }
    };

    // Sets torrent and render to player
    this.client = new Webtorrent();
    this.client.add(torrent, (e) => {
      console.log(e);
      const source = e.files.find((f) => f.name.endsWith('.mp4'));
      source.renderTo(this.vidElem, { controls: false });
      console.log(this.Player);

      this.client.on('error', (err) => {
        console.log(err);
      });
    });
  }

  // hides and shows player controls by using CSS display property
  hideControls() {
    document.querySelectorAll('.remote-only').forEach((el) => {
      el.style.display = 'none';
      console.log('Hiding Controls');
    });
  }

  showControls() {
    document.querySelectorAll('.remote-only').forEach((el) => {
      el.style.display = '';
      console.log('Showing Controls');
    });
  }
}

export default Player;
