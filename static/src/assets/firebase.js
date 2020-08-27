import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
// Initialize firebase object.
const firebaseConfig = {
  apiKey: 'AIzaSyCSZOOi931rc-iEPGU-c_tqV5AVubJygIY',
  authDomain: 'stream-with-friends.firebaseapp.com',
  databaseURL: 'https://stream-with-friends.firebaseio.com',
  projectId: 'stream-with-friends',
  appId: '1:234724440621:web:21dbc3c4416bcff2c456a4',
  measurementId: 'G-EE1BVBF4FW',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
