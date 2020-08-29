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
function roomView(root, Room) {
  window.playerStore = createStore(playerReducer);
  root.innerHTML = room();
  Room.ontorrentlearned = (torrent) => {
    // eslint-disable-next-line no-unused-vars
    const TorrentPlayer = new Player(torrent, document.getElementById('videlem'));
  };
  Room.onremoteuserset = () => {
    window.playerStore.dispatch({ type: 'SET_REMOTE' });
  };

  Room.onremotestreamadded = (stream) => {
    console.log(stream);
    console.log(stream.getTracks());
    const aud = document.createElement('audio');
    if ('srcObject' in aud) {
      aud.srcObject = stream;
    } else {
      aud.src = window.URL.createObjectURL(stream); // for older browsers
    }
    stream.onended = () => {
      root.removeChild(aud);
    };
    root.appendChild(aud);
    aud.play();
  };
}

export default roomView;
