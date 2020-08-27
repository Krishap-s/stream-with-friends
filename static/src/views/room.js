import { createStore } from 'redux';
import room from '../templates/room.handlebars';
import Player from '../player';
import player from '../reducers';
// eslint-disable-next-line no-unused-vars
function roomView(root, Room, UID) {
  window.playerStore = createStore(player);
  // window.playerStore.dispatch({ type: 'SET_REMOTE' });
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
