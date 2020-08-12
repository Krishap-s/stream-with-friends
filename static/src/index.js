import _ from 'lodash';
import * as firebase from 'firebase/app';
import 'firebase/database';
import create_conn from './webrtc_controller.js';

const offer_disp = document.getElementById('offer_disp');
const offer_butt = document.getElementById('offer_butt');
offer_butt.disabled = true;
var rdp = document.getElementById('rdp');
const aoffer_butt = document.getElementById('aoffer_butt');
aoffer_butt.disabled = true;
window.generate_offer = generate_offer;
window.generate_answer = generate_answer;
navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(gum_ready).
	catch((err) =>
		{ offer_disp.innerHTML = err });



function gum_ready(stream) {
	const aud = document.createElement('audio');
	window.localstream = stream;
	window.remotestream = new MediaStream();
	aud.autoplay = true;
	aud.srcObject = window.remotestream;
	offer_butt.disabled = false;
	aoffer_butt.disabled = false;
	document.body.appendChild(aud);
}










function generate_offer() {
	var peerconnection = create_conn(onready);
	peerconnection.createOffer().then(
		(offer) => { peerconnection.setLocalDescription(offer) }
	)
		.catch((err) => { console.log(err) });
	offer_butt.disabled = true;
	offer_disp.innerHTML = "Generating ...";
	aoffer_butt.onclick = () => 
	{
		const offer = JSON.parse(rdp.value);
		peerconnection.setRemoteDescription(new RTCSessionDescription(offer)).then(() => { console.log("rsd set");});
	}

}

var onready = function(peerconnection) {
	offer_disp.innerHTML = JSON.stringify(peerconnection.localDescription);
	return new Promise((resolve,reject) => {
	resolve();
		}
	)
}

function generate_answer() {
	console.log(rdp.value);
	var peerconnection = create_conn(onready);
	try {
	const offer = JSON.parse(rdp.value)
	peerconnection.setRemoteDescription(new RTCSessionDescription(offer)).then(() => { console.log("rsd set");});
	}
	catch (err){
		console.log(err);
		return ;
	}
	if (JSON.parse(rdp.value).type == "answer"){
		offer_disp.innerHTML = "Answer Recieved";
		console.log("answer r");
		return ;
	}
		
	peerconnection.createAnswer().then(
		(offer) => { peerconnection.setLocalDescription(offer) }		)
		.catch((err) => { console.log(err) });
	aoffer_butt.disabled = true;
	offer_disp.innerHTML = "Generating ...";
}
document.body.appendChild(torrent_player());
