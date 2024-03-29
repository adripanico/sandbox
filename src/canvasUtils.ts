import { BRUSH_PATTERN, CANVAS_SIZE } from './constants';
import { IColor, IMatrix, IPosition } from './models';
import { store } from './store';

// iterates over warm or cold colors
// TODO add a toggle to switch between color modes
export function changeColor(warm = true) {
  if (warm) {
    if (store.currentColor[0] < 255) {
      store.currentColor[0]++; // increase red channel
    } else if (store.currentColor[1] < 255) {
      store.currentColor[1]++; // increase green channel
    } else if (store.currentColor[2] < 255) {
      store.currentColor[2]++; // increase blue channel
    } else {
      // reset color to (0, 0, 0)
      store.currentColor[0] = 0;
      store.currentColor[1] = 0;
      store.currentColor[2] = 0;
    }
  } else {
    if (store.currentColor[2] < 255) {
      store.currentColor[2]++;
    } else if (store.currentColor[1] < 255) {
      store.currentColor[1]++;
    } else if (store.currentColor[0] < 255) {
      store.currentColor[0]++;
    } else {
      store.currentColor[0] = 0;
      store.currentColor[1] = 0;
      store.currentColor[2] = 0;
    }
  }
}

export function drawPixel(pos: IPosition) {
  const ctx = store.canvas!.getContext('2d')!;
  const pixelSize = BRUSH_PATTERN.length;
  const area = ctx.getImageData(pos.x, pos.y, pixelSize, pixelSize);

  // the area is already used
  if (area.data.some((color) => color !== 0)) {
    return;
  }

  const pixel = ctx.createImageData(pixelSize, pixelSize);
  for (let i = 0; i < pixelSize; i++) {
    for (let j = 0; j < pixelSize; j++) {
      pixel.data[i * pixelSize * 4 + j * 4] = store.currentColor[0];
      pixel.data[i * pixelSize * 4 + j * 4 + 1] = store.currentColor[1];
      pixel.data[i * pixelSize * 4 + j * 4 + 2] = store.currentColor[2];
      pixel.data[i * pixelSize * 4 + j * 4 + 3] = Math.floor(BRUSH_PATTERN[i][j] * 255);
    }
  }
  ctx.putImageData(pixel, pos.x, pos.y);

  changeColor();
}

export function getMatrix(imageData: ImageData): IMatrix {
  const matrix: IMatrix = [];

  for (let i = 0; i < CANVAS_SIZE; i++) {
    const row: IColor[] = [];
    for (let j = 0; j < CANVAS_SIZE; j++) {
      const pixelStartIndex = i * CANVAS_SIZE * 4 + j * 4;
      row.push([
        imageData.data[pixelStartIndex],
        imageData.data[pixelStartIndex + 1],
        imageData.data[pixelStartIndex + 2],
        imageData.data[pixelStartIndex + 3],
      ]);
    }
    matrix.push(row);
  }

  return matrix;
}

export function getImgData(matrix: IMatrix): number[] {
  return matrix.flat().flat();
}

// main animation loop
export function animate() {
  const ctx = store.canvas!.getContext('2d')!;

  const imgData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const matrix = getMatrix(imgData);

  for (let i = CANVAS_SIZE - 1; i >= 0; i--) {
    for (let j = CANVAS_SIZE - 1; j >= 0; j--) {
      // this is the bottom row, only thing we are going to do here is to get rid of the transparencies on the brush pattern
      if (i === CANVAS_SIZE - 1) {
        matrix[i][j][3] = Number(matrix[i][j][3]) !== 255 ? 0 : 255;
      }

      // if the current pixel is not empty (checking only last value, i.e., the alpha channel)
      else if (matrix[i][j][3] !== 0) {
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
          matrix[i][j][3] = Number(matrix[i][j][3]) !== 255 ? 0 : 255;
        }
      }
    }
  }

  imgData.data.set(getImgData(matrix));
  ctx.putImageData(imgData, 0, 0);
  requestAnimationFrame(animate);
}
