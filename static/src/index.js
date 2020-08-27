import Navigo from 'navigo';
import { RoomsRef, Auth } from './assets/database';

const rootDiv = document.getElementById('root');

const root = window.location.origin;
const useHash = true; // Defaults to: false
const hash = '#!'; // Defaults to: '#'
const router = new Navigo(root, useHash, hash);

// Making Firebase auth object global.
window.Auth = Auth;

// TODO: Fix imports for better performance.
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
