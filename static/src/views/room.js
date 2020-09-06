import { createStore } from 'redux';
import room from '../templates/room.handlebars';
import Player from '../assets/player';
import playerReducer from '../assets/reducers';
import watcherListObject from '../templates/watcher.handlebars';
import messageListObject from '../templates/message.handlebars';

/**
 * Generates view for the room.
 * @param {*} root
 * @param {*} Room
 */
function roomView(root, Room) {
  // Create redux store
  const playerStore = createStore(playerReducer);
  let TorrentPlayer;
  // Render View
  root.innerHTML = room();
  // Set torrent for player
  Room.ontorrentlearned = (torrent) => {
    // eslint-disable-next-line no-unused-vars
    TorrentPlayer = new Player(torrent, document.getElementById('videlem'), playerStore);
  };
  // Tells player if it is remote or not.
  Room.onremoteuserset = () => {
    playerStore.dispatch({ type: 'SET_REMOTE' });
    document.querySelectorAll('.give-remote').forEach((button) => {
      console.log(button);
      if (button.style.display === 'none') {
        button.style.display = '';
        button.onclick = () => {
          Room.changeRemote(button.parentElement.id);
          button.onclick = null;
        };
      } else {
        button.style.display = 'none';
      }
    });
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
  const unsubscribe = playerStore.subscribe(() => {
    const state = playerStore.getState();
    if (state.isremote) {
      Room.control(state.playerState);
    }
  });

  // Recieves any change for player if it does not have the remote.
  Room.oncontrolmessage = (playerState) => {
    playerStore.dispatch({ type: 'CHANGE_STATE', playerState });
  };

  // Add watcher to visible watcher list
  Room.onuseradded = (watcher) => {
    const { isremote } = playerStore.getState();
    const html = watcherListObject({ uid: watcher.uid, displayName: watcher.displayname });
    const node = document.createRange().createContextualFragment(html);
    node.lastElementChild.lastElementChild.onclick = () => {
      Room.changeRemote(watcher.uid);
      node.lastElementChild.lastElementChild.onclick = null;
    };
    if (isremote) {
      node.lastElementChild.lastElementChild.style = '';
    }
    document.getElementById('watchers').appendChild(node);
  };

  // Delete watcher from list if he disconnects
  Room.onuserremoved = (watcherUID) => {
    document.getElementById('watchers').removeChild(document.getElementById(watcherUID));
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

  // Disconnect button.
  document.getElementById('disconnectbutt').onclick = () => {
    Room.disconnect();
    TorrentPlayer.destroy();
    unsubscribe();
    window.router.resume();
    window.router.navigate('/');
    document.getElementById('mutebutt').onclick = null;
    document.getElementById('disconnectbutt').onclick = null;
  };

  // When a message is recieved
  Room.onmessage = (message) => {
    console.log(message.message);
    const html = messageListObject({ displayName: message.displayName, message: message.message });
    const node = document.createRange().createContextualFragment(html);
    document.getElementById('chat').appendChild(node);
  };

  // When a message is sent
  document.getElementById('send').onclick = () => {
    console.log(document.getElementById('message').value);
    Room.broadcast(document.getElementById('message').value);
  };
}

export default roomView;
