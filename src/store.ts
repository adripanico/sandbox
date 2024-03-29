import { IColor } from './models';

interface IStore {
  isMouseDown: boolean;
  currentColor: IColor;
  canvas: HTMLCanvasElement | null;
}

export const store: IStore = {
  isMouseDown: false,
  currentColor: [0, 0, 0],
  canvas: null,
};
