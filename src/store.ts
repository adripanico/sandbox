import { IColor } from './models';

interface IStore {
  canvas: HTMLCanvasElement | null;
  currentColor: IColor;
  currentMode: 'warm' | 'cold';
  isMouseDown: boolean;
}

export const store: IStore = {
  canvas: null,
  currentColor: [0, 0, 0],
  currentMode: 'warm',
  isMouseDown: false,
};
