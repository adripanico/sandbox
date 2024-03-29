export const CANVAS_SIZE = 300;

export const ROW_SIZE = CANVAS_SIZE * 4; // 4 numbers (r, g, b, a) per pixel

// TODO make the patter editable
// represents the pixels to be drawn where 0-1 is the opacity of each pixel
export const BRUSH_PATTERN = [
  [0, 0, 0.8, 0, 0],
  [0, 0.8, 1, 0.5, 0],
  [0.8, 1, 1, 1, 0.8],
  [0.5, 1, 1, 1, 0.5],
  [0, 0.5, 0.8, 0.5, 0],
];
