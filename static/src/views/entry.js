import entry from '../templates/entry.handlebars';

function entryPage(router, root) {
// eslint-disable-next-line no-param-reassign
  root.innerHTML = entry();
  document.getElementById('joinbutt').onclick = () => {
    const roomId = document.getElementById('roomid').value;
    if (roomId === '') {
      alert('Please Enter a valid roomid');
    } else {
      document.getElementById('joinbutt').onclick = null;
      router.navigate(`/rooms/${roomId}`);
    }
  };

  document.getElementById('createbutt').onclick = () => {
    document.getElementById('createbutt').onclick = null;
    router.navigate('/rooms/');
  };
}

export default entryPage;
