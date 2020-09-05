import FirebaseApp from './firebase';
// Creates Reference to 'rooms' in realtime database and exports.
const Database = FirebaseApp.database();

const RoomsRef = Database.ref('rooms');

FirebaseApp.auth().signInAnonymously().catch((e) => {
  console.log(e);
});

const Auth = FirebaseApp.auth();

export { RoomsRef, Auth };
