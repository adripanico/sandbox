import { BRUSH_PATTERN, CANVAS_SIZE } from './constants';
import { IColor, IMatrix, IPosition } from './models';

// iterates over warm or cold colors
// TODO add a toggle to switch between color modes
export function changeColor(color: IColor, warm = true): IColor {
  if (warm) {
    if (color[0] < 255) {
      color[0]++; // increase red channel
    } else if (color[1] < 255) {
      color[1]++; // increase green channel
    } else if (color[2] < 255) {
      color[2]++; // increase blue channel
    } else {
      // reset color to (0, 0, 0)
      color[0] = 0;
      color[1] = 0;
      color[2] = 0;
    }
  } else {
    if (color[2] < 255) {
      color[2]++;
    } else if (color[1] < 255) {
      color[1]++;
    } else if (color[0] < 255) {
      color[0]++;
    } else {
      color[0] = 0;
      color[1] = 0;
      color[2] = 0;
    }
  }

  return color;
}

export function drawPixel(ctx: CanvasRenderingContext2D, pos: IPosition, color: IColor) {
  const pixelSize = BRUSH_PATTERN.length;

  const area = ctx.getImageData(pos.x, pos.y, pixelSize, pixelSize);
  if (area.data.some((color) => color !== 0)) {
    return false;
  }

  const pixel = ctx.createImageData(pixelSize, pixelSize);
  for (let i = 0; i < pixelSize; i++) {
    for (let j = 0; j < pixelSize; j++) {
      pixel.data[i * pixelSize * 4 + j * 4] = color[0];
      pixel.data[i * pixelSize * 4 + j * 4 + 1] = color[1];
      pixel.data[i * pixelSize * 4 + j * 4 + 2] = color[2];
      pixel.data[i * pixelSize * 4 + j * 4 + 3] = BRUSH_PATTERN[i][j] * 255;
    }
  }
  ctx.putImageData(pixel, pos.x, pos.y);

  return true;
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
