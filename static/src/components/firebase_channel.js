class FirebaseChannel {
  /**
   * Creates a firebase channel.
   * @param {*} id
   * @param {*} ref
   */
  constructor(id, ref) {
    this.id = id;
    this.ref = ref;
    this.onmessage = null;
    this.ref.on('child_added', (snapshot) => {
      // eslint-disable-next-line no-param-reassign
      const data = snapshot.val();
      if (data.id === this.id) {
        return;
      }
      if (this.onmessage) {
        this.onmessage(data.data);
      }
      snapshot.ref.remove();
    });
  }

  /**
   * Send data when called
   * @param {*} newData
   */
  send(newData) {
    this.ref.push({ id: this.id, data: newData }).then(() => {
    }).catch((error) => {
      console.error('Error writing new message to Firebase Database', error);
    });
  }

  /**
   * Destroy the channel
   */
  destroy() {
    this.ref.off();
    this.id = null;
    this.ref = null;
    this.onmessage = null;
  }
}

export default FirebaseChannel;
