import AudioCall from './AudioCall';
import FirebaseChannel from './firebase_channel';

class RoomManager {
  constructor(uid, name, rooms, stream, torrent = null, id = null) {
    this.uid = uid;
    this.stream = stream;
    this.name = name;
    this.torrent = torrent;
    this.onremoteuserlearned = null;
    this.ontorrentlearned = null;
    this.onremotetrackadded = null;
    this.onremotecontrolchannel = null;
    this.onmessagechannel = null;
    this.ondataremoved = null;
    if (id === null) {
      this.roomRef = rooms.push();
      console.log(this.connList);
      this.roomRef.set({
        torrent: this.torrent, remoteiswith: this.uid,
      });
      this.id = this.roomRef.key;
    } else {
      this.roomRef = rooms.child(id);
    }

    this.roomRef.child('remoteiswith').on('value', (Snapshot) => {
      if (this.onremoteuserlearned) {
        this.onremoteuserlearned(Snapshot.val());
      }
    });

    this.roomRef.child('torrent').once('value', (Snapshot) => {
      this.torrent = Snapshot.val();
      if (this.ontorrentlearned) {
        this.ontorrentlearned(this.torrent);
      }
    });

    this.currentUser = this.roomRef.child('connList').child(this.uid);
    this.currentUser.set('Krishap');

    // eslint-disable-next-line no-unused-vars
    this.roomRef.child('connList').on('child_added', (Snapshot, prevKey) => {
      if (Snapshot.key === this.uid) {
        return;
      }

      const ids = [Snapshot.key, this.uid];
      ids.sort();
      const channelref = this.roomRef.child(`channels/${ids[0]}/${ids[1]}`);
      const call = new AudioCall(this.stream, new FirebaseChannel(this.uid, channelref));

      call.onremotetrack = (e) => {
        if (this.onremotetrackadded) {
          this.onremotetrackadded(e);
        }
      };

      call.onremotecontrolchannel = (e) => {
        if (this.onremotecontrolchanneladded) {
          this.onremotecontrolchanneladded(e);
        }
      };
      call.onmessagechannel = (e) => {
        if (this.onmessagechanneladded) {
          this.onmessagechanneladded(e);
        }
      };
    });

    this.roomRef.child('connList').on('child_removed', (Snapshot) => {
      if (Snapshot.key === this.uid) {
        return;
      }

      if (this.ondataremoved) {
        this.ondataremoved(Snapshot.key);
      }
    });
  }

  ChangeRemote(uid) {
    this.roomRef.child('remoteiswith').set(uid);
  }
}
export default RoomManager;
