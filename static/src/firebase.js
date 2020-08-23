import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: '***REMOVED***',
  authDomain: '***REMOVED***',
  databaseURL: '***REMOVED***',
  projectId: '***REMOVED***',
  appId: '***REMOVED***',
  measurementId: '***REMOVED***',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
