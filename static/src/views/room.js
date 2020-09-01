import { createStore } from 'redux';
import room from '../templates/room.handlebars';
import Player from '../assets/player';
import playerReducer from '../assets/reducers';
import watcherListObject from '../templates/watcher.handlebars';

/**
 * Generates view for the room.
 * @param {*} root
 * @param {*} Room
 */
function roomView(root, Room) {
  // Create redux store
  const playerStore = createStore(playerReducer);
  // Render View
  root.innerHTML = room();
  // Set torrent for player
  Room.ontorrentlearned = (torrent) => {
    // eslint-disable-next-line no-unused-vars
    const TorrentPlayer = new Player(torrent, document.getElementById('videlem'), playerStore);
  };
  // Tells player if it is remote or not.
  Room.onremoteuserset = () => {
    playerStore.dispatch({ type: 'SET_REMOTE' });
  };

  // Add Stream audio to document.
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

  // Sends any change in player to others if you are remote.
  playerStore.subscribe(() => {
    const state = playerStore.getState();
    if (state.isremote) {
      console.log('broadcast');
      Room.control(state.playerState);
    }
  });

  // Recieves any change for player if it does not have the remote.
  Room.oncontrolmessage = (playerState) => {
    playerStore.dispatch({ type: 'CHANGE_STATE', playerState });
  };

  // Add watcher to visible watcher list
  Room.onuseradded = (watcher) => {
    const html = watcherListObject({ uid: watcher.uid, displayName: watcher.displayname });
    const node = document.createElement('div');
    node.innerHTML = html;
    document.getElementById('watchers').appendChild(node);
  };

  // Toggle mute button.
  document.getElementById('mutebutt').onclick = () => {
    const muteButt = document.getElementById('mutebutt');
    if (Room.muted) {
      muteButt.innerHTML = 'Mute';
    } else {
      muteButt.innerHTML = 'UNMute';
    }
    Room.toggleMute();
  };
}

export default roomView;
