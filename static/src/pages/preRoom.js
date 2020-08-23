import DragDrop from 'drag-drop/buffer';
import path from 'path';
import parseTorrent from 'parse-torrent';
import RoomManager from '../room_manager';
import preRoom from '../templates/preRoom.handlebars';
// import room from '../templates/room.handlebars';

let Router;
let RoomsRef;
let id;
let root;
let LocalStream;
let User;

window.Auth.onAuthStateChanged((NewUser) => {
  User = NewUser;
});

console.log(parseTorrent);
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
  LocalStream = stream;
}).catch((err) => {
  alert(err);
});

function isTorrentFile(file) {
  const extname = path.extname(file.name).toLowerCase();
  return extname === '.torrent';
}

function createRoom() {
  const dropZone = document.getElementById('dropzone');
  let torrent;
  document.getElementById('enteroom').onclick = () => {
    if (User.displayName !== undefined && torrent !== undefined) {
    // eslint-disable-next-line no-unused-vars
      const Room = new RoomManager(User.uid, User.displayName, RoomsRef, LocalStream, torrent);
    }
  };
  /* eslint-disable prefer-destructuring */
  // eslint-disable-next-line no-unused-vars
  DragDrop(dropZone, (files, pos, filelist, directories) => {
    if (isTorrentFile(files[0])) {
      torrent = parseTorrent.toMagnetURI(files[0]);
      console.log(torrent);
    }
  });
}

function joinRoom() {
  document.getElementById('enteroom').onclick = () => {
    if (User.displayName !== undefined) {
    // eslint-disable-next-line no-unused-vars
      const Room = new RoomManager(User.uid, User.displayName, RoomsRef, LocalStream, null, id);
    }
  };
}

function preRoomGen() {
  const NameInput = document.getElementById('displayname');
  if (User.displayName) {
    NameInput.value = User.displayName;
  }
  NameInput.onchange = () => {
    User.updateProfile({ displayName: NameInput.value })
      .then(() => { });
  };
  if (id === null) {
    console.log('createroommode');
    createRoom();
  } else {
    console.log('joinroommode');
    joinRoom();
  }
}

function checkId(newRoot, NewRouter, NewRoomsRef, newId = null) {
  root = newRoot;
  id = newId;
  RoomsRef = NewRoomsRef;
  Router = NewRouter;
  root.innerHTML = preRoom({ isJoin: id });
  if (id) {
    RoomsRef.child(id).once('value', (Snapshot) => {
      console.log(Snapshot);
      if (Snapshot.val()) {
        preRoomGen();
      } else {
        alert('Room Does Not Exist');
        Router.navigate('/');
      }
    });
  } else {
    preRoomGen();
  }
}

export default checkId;
