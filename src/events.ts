import { drawPixel } from './canvasUtils';
import { CANVAS_SIZE } from './constants';
import { store } from './store';

const setMouseDown = () => (store.isMouseDown = true);
const setMouseUp = () => (store.isMouseDown = false);

const drawMouse = (event: MouseEvent) => {
  const x = event.offsetX;
  const y = event.offsetY;
  if (store.isMouseDown) {
    drawPixel({ x, y });
  }
};

const drawTouch = (event: TouchEvent) => {
  const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
  const x = event.targetTouches[0].pageX - rect.left;
  const y = event.targetTouches[0].pageY - rect.top;
  if (store.isMouseDown) {
    drawPixel({ x, y });
  }
};

const cleanCanvas = () => store.canvas?.getContext('2d')!.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

const switchColorMode = () => {
  store.currentColor = [0, 0, 0];
  store.currentMode = store.currentMode === 'cold' ? 'warm' : 'cold';
  document.getElementById('switch-btn')!.innerText = `switch to ${store.currentMode === 'cold' ? 'warm' : 'cold'}`;
};

// const share = async () => {
//   const dataUrl = store.canvas!.toDataURL('image/png');
//   const blob = await (await fetch(dataUrl)).blob();
//   const filesArray = [
//     new File([blob], 'sandbox.png', {
//       type: blob.type,
//       lastModified: new Date().getTime(),
//     }),
//   ];
//   const shareData: ShareData = {
//     files: filesArray,
//     text: 'Look what I did on https://adripanico.github.io/sandbox/',
//     url: 'https://adripanico.github.io/sandbox/',
//   };
//   if (navigator.canShare(shareData)) {
//     navigator.share(shareData);
//   }
// };

export function startEvents() {
  store.canvas!.addEventListener('mousedown', setMouseDown);
  store.canvas!.addEventListener('touchstart', setMouseDown);

  store.canvas!.addEventListener('mouseup', setMouseUp);
  store.canvas!.addEventListener('touchend', setMouseUp);

  store.canvas!.addEventListener('mousemove', drawMouse);
  store.canvas!.addEventListener('touchmove', drawTouch);

  document.getElementById('reset-btn')!.addEventListener('click', cleanCanvas);
  document.getElementById('switch-btn')!.addEventListener('click', switchColorMode);
  // if (navigator.share !== undefined) {
  //   const shareBtn = document.getElementById('share-btn');
  //   shareBtn?.classList.remove('hidden');
  //   shareBtn?.addEventListener('click', share);
  // }
}
