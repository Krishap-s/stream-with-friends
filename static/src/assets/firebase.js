// Initialize firebase object.
const firebaseConfig = {
  apiKey: '***REMOVED***',
  authDomain: '***REMOVED***',
  databaseURL: '***REMOVED***',
  projectId: '***REMOVED***',
  appId: '***REMOVED***',
  measurementId: '***REMOVED***',
};

// eslint-disable-next-line no-undef
const firebaseApp = firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars, no-undef
const perf = firebase.performance();

export default firebaseApp;
