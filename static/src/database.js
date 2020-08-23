import FirebaseApp from './firebase';

const Database = FirebaseApp.database();

const RoomsRef = Database.ref('rooms');

FirebaseApp.auth().signInAnonymously().catch((e) => {
  console.log(e);
});

const Auth = FirebaseApp.auth();

export { RoomsRef, Auth };
