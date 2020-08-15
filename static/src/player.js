import Webtorrent from 'webtorrent/webtorrent.min.js';

function CreatePlayer (torrent){
	var vid = document.createElement('video');
	vid.controls = false;
	window.vid = vid;
	var client = new Webtorrent()
	client.add(torrent, e => 
		{
			var source = e.files.find( f =>
				{
					return f.name.endsWith('.mp4');
				}
			);

			source.renderTo(vid);
		}
	);

	window.playerStore.subscribe( e => 
		{
			const state = window.playerStore.getState();
			console.log(state);
			if (state.isremote != true){
			switch(state.playerState.paused){

				case true:
					vid.pause();
					break;

				case false:
					vid.play();
					break;

			
			}
			

			vid.currentTime = state.playerState.currtime;
			}
			}
	);

	vid.onplay = e => 
	{
		if (window.playerStore.getState().isremote) {
		console.log("play:" + vid.currentTime);
		window.playerStore.dispatch({type:'CHANGE_STATE',playerState:{paused:vid.paused,currtime:vid.currentTime}});
		}
	}

	vid.onpause = e =>
	{
		if (window.playerStore.getState().isremote) {
		console.log("pause:" + vid.currentTime);
		window.playerStore.dispatch({type:'CHANGE_STATE',playerState:{paused:vid.paused,currtime:vid.currentTime}});
		}
	}

	vid.onseeked = e =>
	{
		if (window.playerStore.getState().isremote) {
		window.playerStore.dispatch({type:'CHANGE_STATE',playerState:{paused:vid.paused,currtime:vid.currentTime}});
		}
	}

	return vid;
}

export default CreatePlayer;
