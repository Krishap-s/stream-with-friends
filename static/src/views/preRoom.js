import DragDrop from 'drag-drop/buffer';
import path from 'path';
import WebTorrent from 'webtorrent/webtorrent.min';
import RoomManager from '../assets/room_manager';
import preRoom from '../templates/preRoom.handlebars';
import roomView from './room';

/**
 * Checks if file is torrent file.
 * @param {*} file
 */
function isTorrentFile(file) {
  const extname = path.extname(file.name).toLowerCase();
  return extname === '.torrent';
}

/**
 * Creates Room and calls the room view.
 * @param {*} root
 * @param {*} User
 * @param {*} LocalStream
 * @param {*} RoomsRef
 */
function createRoom(root, User, LocalStream, RoomsRef) {
  const client = new WebTorrent();
  let remove = null;
  let validTorrent = null;
  let butt = document.getElementById('enteroombutt');
  const mp4Check = (torrentId) => {
    client.add(torrentId, (torrent) => {
      torrent.pause();
      const file = torrent.files.find((f) => f.name.endsWith('.mp4'));
      if (file) {
        validTorrent = torrent.magnetURI;
        butt.disabled = false;
        document.getElementById('torrentname').innerHTML = `File to be played: ${file.name}`;
      } else {
        alert("Forgot to mention, the player only supports .mp4 files which your torrent doesnt have, soooo \n you can't use this torrent");
      }
      torrent.destroy();
    });
    document.getElementById('torrentname').innerHTML = 'Checking ...';
  };
  butt.disabled = true;
  butt.onclick = () => {
    if (document.getElementById('displayname').value !== '') {
      remove();
      const Room = new RoomManager(User.uid, document.getElementById('displayname').value, RoomsRef, LocalStream, validTorrent);
      window.router.pause();
      window.router.navigate(`/rooms/${Room.id}`);
      butt.onclick = null;
      butt = null;
      client.destroy();
      roomView(root, Room);
    }
  };
  document.getElementById('magneturi').onchange = () => {
    const magnetURI = `${document.getElementById('magneturi').value.trim()}&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com`;
    console.log(magnetURI);
    mp4Check(magnetURI);
  };
  /* eslint-disable prefer-destructuring */
  // Sets the drag and drop zone.
  remove = DragDrop(document.getElementById('dropzone'), (files) => {
    if (isTorrentFile(files[0])) {
      mp4Check(files[0]);
    } else {
      alert('Please use a torrent file');
    }
  });
}

/**
 * Joins a room using given room id.
 * @param {*} root
 * @param {*} User
 * @param {*} LocalStream
 * @param {*} RoomsRef
 * @param {*} id
 */
function joinRoom(root, User, LocalStream, RoomsRef, id) {
  document.getElementById('enteroombutt').onclick = () => {
    if (document.getElementById('displayname').value) {
      // eslint-disable-next-line no-unused-vars
      const Room = new RoomManager(User.uid, document.getElementById('displayname').value, RoomsRef, LocalStream, null, id);
      document.getElementById('enteroombutt').onclick = null;
      roomView(root, Room);
    }
  };
}

function setDisplayName(User) {
  if (User.displayName) {
    document.getElementById('enteroombutt').disabled = false;
    document.getElementById('displayname').value = User.displayName;
  }
  document.getElementById('displayname').onchange = () => {
    User.updateProfile({ displayName: document.getElementById('displayname').value })
      .then(() => { });

    if (document.getElementById('displayname').value !== '') {
      document.getElementById('enteroombutt').disabled = false;
    } else {
      document.getElementById('enteroombutt').disabled = true;
    }
  };
}
/**
 * Generates view for user when he uses a link or enters room id .
 * @param {*} root
 * @param {*} Router
 * @param {*} RoomsRef
 * @param {*} id
 */
function preRoomView(root, RoomsRef, id = null) {
  root.innerHTML = preRoom({ isJoin: id });
  const gum = navigator.mediaDevices.getUserMedia({
    audio:
     {
       autoGainControl: false, echoCancellation: true, noiseSuppression: true, volume: 0.5,
     },
  });
  window.Auth.onAuthStateChanged((User) => {
    setDisplayName(User);
    if (id) {
      RoomsRef.child(id).once('value', (Snapshot) => {
        if (Snapshot.val() === null) {
          window.router.navigate('/');
          alert('Room Not Found');
        }
        gum.then((stream) => { joinRoom(root, User, stream, RoomsRef, id); })
          .catch((err) => { alert(err); });
        console.log('Joinroom mode');
      });
    } else {
      gum.then((stream) => { createRoom(root, User, stream, RoomsRef); })
        .catch((err) => { alert(err); });
      console.log('createroommode');
    }
  });
}

export default preRoomView;
