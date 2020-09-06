import SimplePeer from 'simple-peer/simplepeer.min';
/**
 * Represents a single call between two peers.
 * @param {Object} local stream of user
 * @param {Object} channel Communications channel between two peers.
 */
class AudioCall {
  constructor(isCaller, LocalStream, fchannel) {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    this.fchannel = fchannel;
    const sdpParser = (sdp) => {
      sdp.replace('useinbandfec=1', 'useinbandfec=1; maxaveragebitrate=28000');
      return sdp;
    };

    this.pc = new SimplePeer({
      initiator: isCaller,
      config: configuration,
      sdpTransform: sdpParser,
      trickle: true,
      stream: LocalStream,
    });

    this.pc.on('signal', (signal) => {
      fchannel.send(JSON.stringify(signal));
    });

    this.fchannel.onmessage = (signalString) => {
      const signal = JSON.parse(signalString);
      this.pc.signal(signal);
    };

    this.pc.once('connect', () => {
      fchannel.onmessage = null;
      this.pc.removeAllListeners('signal');
    });
  }
}

export default AudioCall;
