// Initialize firebase object.
const firebaseConfig = {
  apiKey: 'API_KEY',
  authDomain: 'AUTH_DOMAIN',
  databaseURL: 'DATABASE_URL',
  projectId: 'PROJECT_ID',
  appId: 'APP_ID',
  measurementId: 'MEASUREMENT_ID',
};

// eslint-disable-next-line no-undef
const firebaseApp = firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars, no-undef
const perf = firebase.performance();

export default firebaseApp;
