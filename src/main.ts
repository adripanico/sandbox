import './style.css';

import { changeColor, drawPixel, getImgData, getMatrix } from './canvasUtils';
import { CANVAS_SIZE } from './constants';
import { IColor, IPosition } from './models';

let currentColor: IColor = [0, 0, 0];
let isMouseDown = false;

function init() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

  if (!canvas) {
    throw Error('Canvas element not found!');
  }

  canvas.width = canvas.height = CANVAS_SIZE;
  canvas.style.width = canvas.style.height = `${CANVAS_SIZE}px`;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw Error('Canvas context not found!');
  }

  function animate() {
    if (!ctx) {
      return;
    }

    const imgData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const matrix = getMatrix(imgData);

    for (let i = CANVAS_SIZE - 2; i >= 0; i--) {
      for (let j = CANVAS_SIZE - 1; j >= 0; j--) {
        // if the current pixel is not empty (checking only last value, i.e., the alpha channel)
        if (matrix[i][j][3] !== 0) {
          const belowIsEmpty = matrix[i + 1][j][3] === 0;
          const belowLeftIsEmpty = j > 0 && matrix[i + 1][j - 1][3] === 0;
          const belowRightIsEmpty = j < CANVAS_SIZE - 1 && matrix[i + 1][j + 1][3] === 0;

          // if pixel right below the current one is empty, drop the current one
          if (belowIsEmpty) {
            matrix[i + 1][j] = matrix[i][j];
            matrix[i][j] = [0, 0, 0, 0];
          }
          // if pixel below left or below right is empty, drop the current one to one of them
          else if (belowLeftIsEmpty || belowRightIsEmpty) {
            const direction =
              belowLeftIsEmpty && belowRightIsEmpty
                ? Math.random() > 0.5
                  ? 'l'
                  : 'r'
                : belowLeftIsEmpty
                  ? 'l'
                  : belowRightIsEmpty
                    ? 'r'
                    : undefined;

            if (direction === 'l') {
              matrix[i + 1][j - 1] = matrix[i][j];
              matrix[i][j] = [0, 0, 0, 0];
            } else if (direction === 'r') {
              matrix[i + 1][j + 1] = matrix[i][j];
              matrix[i][j] = [0, 0, 0, 0];
            }
          }
          // if the pixel can't drop anymore, get rid of transparencies on the brush pattern
          else {
            matrix[i][j][3] = 255 / 2 ? 255 : 0;
          }
        }
      }
    }

    imgData.data.set(getImgData(matrix));
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(animate);
  }

  animate();

  canvas.addEventListener('mousedown', () => {
    isMouseDown = true;
  });

  canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  canvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const position: IPosition = {
        x: event.offsetX,
        y: event.offsetY,
      };
      drawPixel(ctx, position, currentColor);
      currentColor = changeColor(currentColor);
    }
  });
}

init();
