import Webtorrent from 'webtorrent/webtorrent.min';

class Player {
  constructor(torrent, vidElem) {
    this.vidElem.controls = false;
    this.client = new Webtorrent();
    this.client.add(torrent, (e) => {
      const source = e.files.find((f) => f.name.endsWith('.mp4'));

      source.renderTo(this.vidElem);
    });
  }
}

export default Player;
