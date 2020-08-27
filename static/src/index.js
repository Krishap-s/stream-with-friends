import Navigo from 'navigo';
import { RoomsRef, Auth } from './database';

const rootDiv = document.getElementById('root');

const root = window.location.origin;
const useHash = true; // Defaults to: false
const hash = '#!'; // Defaults to: '#'
const router = new Navigo(root, useHash, hash);

window.Auth = Auth;
router
  .on({
    '/': () => {
      import(/* webpackChunkName "enter" */ './views/entry.js').then((module) => {
        module.default(router, rootDiv);
      });
    },
    '/rooms/': () => {
      import(/* webpackChunkName: "preRoom" */ './views/preRoom.js').then((module) => {
        module.default(rootDiv, router, RoomsRef);
      });
    },

    '/rooms/:id': (params) => {
      import(/* webpackChunkName: "preRoom" */ './views/preRoom.js').then((module) => {
        module.default(rootDiv, router, RoomsRef, params.id);
      });
    },
  })
  .resolve();
