import DragDrop from 'drag-drop/buffer';
import path from 'path';
import parseTorrent from 'parse-torrent';
import RoomManager from '../room_manager';
import preRoom from '../templates/preRoom.handlebars';
import roomView from './room';

function isTorrentFile(file) {
  const extname = path.extname(file.name).toLowerCase();
  return extname === '.torrent';
}

function createRoom(root, User, LocalStream, RoomsRef) {
  const dropZone = document.getElementById('dropzone');
  const butt = document.getElementById('enteroom');
  butt.disabled = true;
  let torrent = null;
  butt.onclick = () => {
    if (User.displayName !== null) {
      const Room = new RoomManager(User.uid, User.displayName, RoomsRef, LocalStream, torrent);
      roomView(root, Room, User.uid);
    }
  };
  /* eslint-disable prefer-destructuring */
  // eslint-disable-next-line no-unused-vars
  DragDrop(dropZone, (files, pos, filelist, directories) => {
    if (isTorrentFile(files[0])) {
      const parsed = parseTorrent(files[0]);
      const FileInfo = parsed.files.find((file) => file.name.slice(-4) === '.mp4');
      if (FileInfo) {
        torrent = parseTorrent.toMagnetURI(parsed);
        document.getElementById('torrentname').innerHTML = `File to be played: ${FileInfo.name}`;
        butt.disabled = false;
        console.log(torrent);
      } else {
        alert('Forgot to mention this player only can play mp4 and your torrent doesnt have one');
      }
    } else {
      alert('Are you illiterate ? The box clearly says "DRAG AND DROP TORRENT FILE" ');
    }
  });
}

function joinRoom(root, User, LocalStream, RoomsRef, id) {
  document.getElementById('enteroom').onclick = () => {
    if (User.displayName !== undefined) {
      // eslint-disable-next-line no-unused-vars
      const Room = new RoomManager(User.uid, User.displayName, RoomsRef, LocalStream, null, id);
      roomView(root, Room, User.uid);
    }
  };
}

function setDisplayName(User) {
  const NameInput = document.getElementById('displayname');
  if (User.displayName) {
    NameInput.value = User.displayName;
  }
  NameInput.onchange = () => {
    User.updateProfile({ displayName: NameInput.value })
      .then(() => { });
  };
}
/**
 * Generates view for user when he uses a link or enters room id .
 * @param {*} root
 * @param {*} Router
 * @param {*} RoomsRef
 * @param {*} id
 */
function preRoomView(root, Router, RoomsRef, id = null) {
  root.innerHTML = preRoom({ isJoin: id });
  const gum = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  window.Auth.onAuthStateChanged((User) => {
    setDisplayName(User);
    document.getElementById('enteroom').disabled = false;
    if (id) {
      RoomsRef.child(id).once('value', (Snapshot) => {
        console.log(Snapshot);
        if (Snapshot.val() === null) {
          Router.navigate('/');
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
