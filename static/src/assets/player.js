import Webtorrent from 'webtorrent/webtorrent.min';
import controls from './controls';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["showControls","hideControls"] }] */

// TODO: Get Current state of already playing player.
class Player {
  /**
   * Creates Plyr player using provided video element,
   * renders video to html5 video element and set subscribers to control the video element.
   * @param {*} torrent
   * @param {*} vidElem
   */
  constructor(torrent, vidElem, playerStore) {
    this.vidElem = vidElem;
    this.torrent = torrent;
    this.playerStore = playerStore;
    // eslint-disable-next-line no-undef
    this.Player = new Plyr(this.vidElem,
      { controls, clickToPlay: false, keyboard: { global: false, focus: false } });
    this.hideControls();
    // setting event listener to player store
    this.unsubscribe = this.playerStore.subscribe(() => {
      const state = this.playerStore.getState();
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
            console.log('pausing');
            this.Player.pause();
            break;

          default:
            console.log('playing');
            this.Player.play();
            break;
        }

        this.Player.currentTime = state.playerState.currtime;
      }
    });

    // setting event listeners from playerStore to player.
    this.Player.on('play', () => {
      if (this.playerStore.getState().isremote) {
        this.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.Player.paused, currtime: this.Player.currentTime } });
      }
    });

    this.Player.on('pause', () => {
      if (this.playerStore.getState().isremote) {
        this.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.Player.paused, currtime: this.Player.currentTime } });
      }
    });

    this.Player.on('seeked', () => {
      if (this.playerStore.getState().isremote) {
        this.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: { paused: this.Player.paused, currtime: this.Player.currentTime } });
      }
    });

    // Sets torrent and render to player
    this.client = new Webtorrent();
    this.client.add(torrent, (e) => {
      const source = e.files.find((f) => f.name.endsWith('.mp4'));
      source.renderTo(this.vidElem, { controls: false });
      console.log(this.Player);

      this.client.on('error', (err) => {
        console.log(err);
      });
    });
  }

  /**
   * Hides play button and progress seeking from user
   */
  hideControls() {
    document.querySelectorAll('.remote-only').forEach((el) => {
      el.style.display = 'none';
      console.log('Hiding Controls');
    });
  }

  /**
   * Shows play button and progress seeking .
   */
  showControls() {
    document.querySelectorAll('.remote-only').forEach((el) => {
      el.style.display = '';
      console.log('Showing Controls');
    });
  }

  /**
   * Destroys player instance.
   */
  destroy() {
    this.client.remove(this.torrent);
    this.client.destroy();
    this.client = null;
    URL.revokeObjectURL(this.Player.source);
    this.Player.source = null;
    this.Player.destroy();
    this.Player = null;
    this.unsubscribe();
    this.vidElem = null;
    this.playerStore = null;
  }
}

export default Player;
