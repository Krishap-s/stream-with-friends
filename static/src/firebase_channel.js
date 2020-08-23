class FirebaseChannel {
  constructor(id, ref) {
    this.id = id;
    this.ref = ref;
    this.onmessage = null;
    this.ref.on('child_added', (data) => {
      // eslint-disable-next-line no-param-reassign
      data = data.val();
      if (data.id === this.id) {
        return;
      }
      if (this.onmessage) {
        this.onmessage(data.data);
      }
    });
  }

  send(newData) {
    this.ref.push({ id: this.id, data: newData }).then(() => {
    }).catch((error) => {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
}

export default FirebaseChannel;
