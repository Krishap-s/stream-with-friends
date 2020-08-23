import CreatePlayer from './player.js';

const torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent';
function MessageResolver(messJSON) {
  switch (messJSON.type) {
    case 'connected':
      alert('Connected');
      document.body.appendChild(CreatePlayer(torrentId));
      break;

    case 'playerstatechange':
      if (window.playerStore.getState().isremote == false) {
        window.playerStore.dispatch({ type: 'CHANGE_STATE', playerState: messJSON.playerState });
      }
      break;

    default:
      console.log(messJSON);
      break;
  }
}

function CreateConn() {
  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  const peerconnection = new RTCPeerConnection(configuration);

  let x;
  for (x of localstream.getTracks()) {
    peerconnection.addTrack(x);
  }
  const channel = peerconnection.createDataChannel('controller', { negotiated: true, id: 0 });

  channel.onopen = (e) => {
    channel.send(JSON.stringify({ type: 'connected' }));
  };

  channel.onmessage = (e) => {
    MessageResolver(JSON.parse(e.data));
  };

  window.playerStore.subscribe(() => {
    const state = window.playerStore.getState();
    channel.send(JSON.stringify({ type: 'playerstatechange', playerState: state.playerState }));
  });

  peerconnection.onicegatheringstatechange = (e) => {
    switch (peerconnection.iceGatheringState) {
      case 'complete':
        offer_disp.innerHTML = JSON.stringify(peerconnection.localDescription);
        break;

      default:
    }
  };

  peerconnection.ontrack = (e) => {
    console.log(e);
    remotestream.addTrack(e.track);
  };

  peerconnection.oniceconnectionstatechange = (e) => {
    switch (peerconnection.iceConnectionState) {
      case 'connected':
        console.log('iceconnected');
        break;

      case 'failed':
        offer_butt.disabled = false;
        aoffer_butt.disabled = false;
        alert('Cannot connect to peer');
        peerconnection.close();
        break;

      case 'disconnected':
        alert('Connection issue to peer');
        break;

      case 'closed':
        alert('Giving Up connecting to peer');
        offer_butt.disabled = false;
        aoffer_butt.disabled = false;
        break;
    }
  };

  return peerconnection;
}
export default CreateConn;
