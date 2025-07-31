export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export interface PixelArt {
  id: string;
  name: string;
  grid: string[][];
  size: number;
  createdAt: number;
  updatedAt: number;
}

export interface DrawingState {
  grid: string[][];
  selectedColor: string;
  isDrawing: boolean;
  isErasing: boolean;
}

export interface HistoryState {
  past: string[][][];
  present: string[][];
  future: string[][][];
}

export interface PaletteColor {
  color: string;
  name: string;
}

export type GridSize = 8 | 16 | 32 | 64;

export interface ExportOptions {
  format: 'png' | 'json';
  filename?: string;
  scale?: number;
}

export interface ExportHistory {
  id: string;
  creatorName: string;
  turboLink: string;
  artworkName: string;
  size: number;
  exportedAt: number;
} 