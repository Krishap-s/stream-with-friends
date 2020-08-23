/**
 * Represents a single call between two peers.
 * @param {Object} local stream of user
 * @param {Object} channel Communications channel between two peers.
 */
class AudioCall {
  constructor(stream, fchannel) {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    this.pc = new RTCPeerConnection(configuration);
    this.fchannel = fchannel;
    this.oncontrolmessage = null;
    this.onremotetrack = null;
    this.onremotecontrolchannel = null;
    this.onremotemessagechannel = null;

    let x;
    for (x of stream.getTracks()) {
      this.pc.addTrack(x);
    }
    this.remotechannel = this.pc.createDataChannel('controller', { negotiated: true, id: 0 });
    this.messagechannel = this.pc.createDataChannel('message', { negotiated: true, id: 1 });

    this.remotechannel.onopen = () => {
      if (this.onremotecontrolchannel) {
        this.onremotecontrolchannel(this.remotechannel);
      }
    };

    this.messagechannel.onopen = () => {
      if (this.onremotemessagechannel) {
        this.onremotemessagechannel(this.messagechannel);
      }
    };

    this.remotechannel.onmessage = (e) => {
      if (this.oncontrolmessage) {
        this.oncontolmessage(JSON.parse(e.data));
      }
    };

    this.pc.onicecandinate = (e) => {
      this.fchannel.send(JSON.stringify({ candinate: e.candinate }));
    };

    this.pc.ontrack = (e) => {
      this.onremotetrack(e.track);
    };

    this.fchannel.onmessage = (e) => {
      const signal = JSON.parse(e);
      if (signal.sdp) {
        if (signal.sdp.type === 'offer') {
          this.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
            .then(() => {
              this.pc.createAnswer()
                .then((desc) => {
                  this.pc.setLocalDescription(desc);
                  this.fchannel.send(JSON.stringify(desc));
                });
            });
        } else if (signal.candinate) {
          /* eslint-disable no-undef */
          this.pc.addIceCandinate(new RTCIceCandinate(signal.candinate));
        } else {
          this.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        }
      }
    };
  }

  /**
 *  Creates offer to send to peer
 */
  call() {
    this.pc.createOffer().then((desc) => {
      this.pc.setLocalDescription(desc);
      this.fchannel.send(desc);
    });
  }
}

export default AudioCall;
