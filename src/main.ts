import './style.css';

import { animate } from './canvasUtils';
import { CANVAS_SIZE } from './constants';
import { startEvents } from './events';
import { store } from './store';

function init() {
  store.canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!store.canvas) {
    throw Error('Canvas element not found!');
  }

  store.canvas.width = store.canvas.height = CANVAS_SIZE;
  store.canvas.style.width = store.canvas.style.height = `${CANVAS_SIZE}px`;

  animate();

  startEvents();
}

init();
