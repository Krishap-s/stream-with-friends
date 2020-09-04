import entry from '../templates/entry.handlebars';

/**
 * Generates the view when user first arrives at site.
 * @param {*} router
 * @param {*} root
 */
function entryView(root) {
// eslint-disable-next-line no-param-reassign
  root.innerHTML = entry();
  document.getElementById('joinbutt').onclick = () => {
    const roomId = document.getElementById('roomid').value;
    if (roomId === '') {
      alert('Please Enter a valid roomid');
    } else {
      document.getElementById('joinbutt').onclick = null;
      window.router.navigate(`/rooms/${roomId}`);
    }
  };

  document.getElementById('createbutt').onclick = () => {
    document.getElementById('createbutt').onclick = null;
    window.router.navigate('/rooms/');
  };
}

export default entryView;
