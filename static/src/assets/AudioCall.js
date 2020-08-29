import SimplePeer from 'simple-peer/simplepeer.min';
/**
 * Represents a single call between two peers.
 * @param {Object} local stream of user
 * @param {Object} channel Communications channel between two peers.
 */
class AudioCall {
  constructor(isCaller, LocalStream, fchannel) {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

    this.pc = new SimplePeer({
      initiator: isCaller,
      config: configuration,
      trickle: true,
      stream: LocalStream,
    });

    this.pc.on('signal', (signal) => {
      fchannel.send(JSON.stringify(signal));
    });

    fchannel.onmessage = (signalString) => {
      const signal = JSON.parse(signalString);
      this.pc.signal(signal);
    };
  }
}

export default AudioCall;
