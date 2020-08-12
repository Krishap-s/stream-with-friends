function create_conn (onready) {
	const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
	const peerconnection = new RTCPeerConnection(configuration);
	var x;
	for (x of window.localstream.getTracks()){
		peerconnection.addTrack(x);
	}
	window.channel = peerconnection.createDataChannel("controller");
	peerconnection.addEventListener("icegatheringstatechange",ev => {
		switch(peerconnection.iceGatheringState){
			case "complete":
				onready(peerconnection).then(() => {console.log("ICE Ready !!")}).catch((err) => {console.log("ERR: " + err)});
			default :
				;
		}
	}
	)

	peerconnection.addEventListener("connectionstatechange", () => 
		{
			switch(peerconnection.connectionState) {
				case "connected":
					offer_disp.innerHTML = "Connected";
					break;
				case "failed":
					offer_disp.innerHTML = "Disconnected";
					break;
				case "disconnected":
					offer_disp.innerHTML = "Disconnecting";
					break;
				case "closed":
					offer_disp.innerHTML = "Disconnected";
					peerconnection.close();
					offer_butt.disabled = false;
					aoffer_butt.disabled = false;
					break;
			}
		}
	);

	peerconnection.addEventListener("track", (rtctrack) => 
		{	console.log(rtctrack);
			window.remotestream.addTrack(rtctrack.track);
		}
	)
	return peerconnection ;
}


export default create_conn;

