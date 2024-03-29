// [r, g, b] | [r, g, b, a]
export type IColor = [number, number, number] | [number, number, number, number];

export interface IPosition {
  x: number;
  y: number;
}

export type IMatrix = IColor[][];
