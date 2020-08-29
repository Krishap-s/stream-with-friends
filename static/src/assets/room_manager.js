import AudioCall from './AudioCall';
import FirebaseChannel from './firebase_channel';

class RoomManager {
  /**
   * Creates or joins a room using firebase database.
   * @param {*} uid
   * @param {*} name
   * @param {*} rooms
   * @param {*} stream
   * @param {*} torrent
   * @param {*} id
   */
  constructor(uid, name, rooms, stream, torrent = null, id = null) {
    this.uid = uid;
    this.stream = stream;
    console.log(this.stream);
    this.name = name;
    this.torrent = torrent;
    this.connList = {};
    this.remoteuser = null;
    this.onremoteuserset = null;
    this.ontorrentlearned = null;
    this.onremotestreamadded = null;
    this.onremotecontrolchannel = null;
    this.onmessagechannel = null;
    this.ondataremoved = null;
    // Creates room if no id is entered
    if (id === null) {
      this.roomRef = rooms.push();
      this.roomRef.set({
        torrent: this.torrent, remoteiswith: this.uid,
      }).then(() => {
        if (this.ontorrentlearned) {
          this.ontorrentlearned(this.torrent);
        }
        if (this.onremoteuserset) {
          this.onremoteuserset();
        }
      });

      this.roomRef.onDisconnect().remove();
      this.id = this.roomRef.key;
    } else {
      this.roomRef = rooms.child(id);
      this.roomRef.child('torrent').once('value', (Snapshot) => {
        this.torrent = Snapshot.val();
        if (this.ontorrentlearned) {
          this.ontorrentlearned(this.torrent);
        }
      });
    }

    this.roomRef.child('remoteiswith').on('value', (Snapshot) => {
      if (Snapshot.val() === this.uid) {
        // If there is no one else in the room delete the room on disconnecting
        if (Object.keys(this.connList).length === 0) {
          this.roomRef.onDisconnect().remove();
        } else {
        // If someone else is there in room give the remote to the person on disconnecting
          this.roomRef.child('remoteiswith').onDisconnect().set(Object.keys(this.connList)[0]);
        }
        if (this.onremoteuserset) {
          this.onremoteuserset();
        }
      }

      this.remoteuser = Snapshot.val();
    });

    this.currentUser = this.roomRef.child('connList').child(this.uid);
    this.currentUser.set(this.name);
    // Delete user from connection list on disconnecting
    this.currentUser.onDisconnect().remove();

    // The callback is run for every user in the server connList.
    this.roomRef.child('connList').on('child_added', (Snapshot) => {
      if (Snapshot.key === this.uid) {
        return;
      }
      if (Object.keys(this.connList).length === 0) {
        this.roomRef.onDisconnect().cancel();
        /* onDisconnect() had to be called again since cancel()
        removes all the onDisconnect listeners in the room.
        */
        this.currentUser.onDisconnect().remove();
      }
      this.connList[Snapshot.key] = { name: Snapshot.val() };
      if (this.uid === this.remoteuser) {
        this.roomRef.child('remoteiswith').onDisconnect().set(Object.keys(this.connList)[0]);
      }
      const ids = [Snapshot.key, this.uid];
      // The ids are sorted and the first id in the array sends offer and second sends the answer.
      ids.sort();
      const channelref = this.roomRef.child(`channels/${ids[0]}/${ids[1]}`);
      const isCaller = this.uid === ids[0];
      const Call = new AudioCall(isCaller, this.stream, new FirebaseChannel(this.uid, channelref));

      Call.pc.on('error', (err) => {
        console.log(err);
      });

      Call.pc.on('connect', () => {
        this.connList[Snapshot.key].peer = Call;
        Call.fchannel.onmessage = null;
      });

      Call.pc.on('stream', (remoteStream) => {
        if (this.onremotestreamadded) {
          this.onremotestreamadded(remoteStream);
        }
      });
    });
    /* If someone leaves or disconnects delete the user from local connList
    and run a callback function. */
    this.roomRef.child('connList').on('child_removed', (Snapshot) => {
      if (Snapshot.key === this.uid) {
        return;
      }
      this.connList[Snapshot.key].peer.pc.destroy();
      this.connList[Snapshot.key].peer = null;

      delete this.connList[Snapshot.key];
      console.log(this.connList);
      if (this.ondataremoved) {
        this.ondataremoved(Snapshot.key);
      }
    });
  }

  /**
   * Give the remote to someone else if you are the remote.
   * @param {*} uid
   */
  ChangeRemote(uid) {
    this.roomRef.child('remoteiswith').set(uid);
    if (this.onremoteuserset) {
      this.remoteuserset();
    }
    this.roomReF.child('remoteiswith').onDisconnect().cancel();
  }
}
export default RoomManager;
