import { createStore } from 'redux';
import room from '../templates/room.handlebars';
import Player from '../assets/player';
import playerReducer from '../assets/reducers';
// eslint-disable-next-line no-unused-vars

/**
 * Generates view for the room.
 * @param {*} root
 * @param {*} Room
 */
function roomView(root, Room ) {
  window.playerStore = createStore(playerReducer);
  root.innerHTML = room();
  Room.ontorrentlearned = (torrent) => {
    console.log(torrent);
    // eslint-disable-next-line no-unused-vars
    const TorrentPlayer = new Player(torrent, document.getElementById('videlem'));
  };
  Room.onremoteuserset = () => {
    window.playerStore.dispatch({ type: 'SET_REMOTE' });
  };
}

export default roomView;
