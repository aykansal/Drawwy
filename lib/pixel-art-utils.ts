import { GridSize, PixelArt, HistoryState, ExportOptions, ExportHistory } from './types';
import { uploadToTurbo } from './turbo-utils';

// Create an empty grid of specified size
export function createEmptyGrid(size: GridSize): string[][] {
  return Array(size).fill(null).map(() => Array(size).fill('#ffffff'));
}

// Create a deep copy of a grid
export function cloneGrid(grid: string[][]): string[][] {
  return grid.map(row => [...row]);
}

// History management utilities
export function canUndo(history: HistoryState): boolean {
  return history.past.length > 0;
}

export function canRedo(history: HistoryState): boolean {
  return history.future.length > 0;
}

export function addToHistory(history: HistoryState, newGrid: string[][], maxHistory: number = 50): HistoryState {
  const newPast = [...history.past, history.present];
  if (newPast.length > maxHistory) {
    newPast.shift();
  }
  
  return {
    past: newPast,
    present: cloneGrid(newGrid),
    future: []
  };
}

export function undo(history: HistoryState): HistoryState | null {
  if (!canUndo(history)) return null;
  
  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, -1);
  
  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future]
  };
}

export function redo(history: HistoryState): HistoryState | null {
  if (!canRedo(history)) return null;
  
  const next = history.future[0];
  const newFuture = history.future.slice(1);
  
  return {
    past: [...history.past, history.present],
    present: next,
    future: newFuture
  };
}

// LocalStorage utilities
export function savePixelArt(art: PixelArt): void {
  try {
    const savedArts = getSavedPixelArts();
    const existingIndex = savedArts.findIndex(a => a.id === art.id);
    
    if (existingIndex >= 0) {
      savedArts[existingIndex] = { ...art, updatedAt: Date.now() };
    } else {
      savedArts.push({ ...art, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    localStorage.setItem('pixel-arts', JSON.stringify(savedArts));
    console.log('Pixel art saved successfully:', art.name);
  } catch (error) {
    console.error('Error saving pixel art:', error);
  }
}

export function getSavedPixelArts(): PixelArt[] {
  try {
    const saved = localStorage.getItem('pixel-arts');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved pixel arts:', error);
    return [];
  }
}

export function deletePixelArt(id: string): void {
  try {
    const savedArts = getSavedPixelArts();
    const filtered = savedArts.filter(art => art.id !== id);
    localStorage.setItem('pixel-arts', JSON.stringify(filtered));
    console.log('Pixel art deleted successfully');
  } catch (error) {
    console.error('Error deleting pixel art:', error);
  }
}

// Export history utilities
export function saveExportHistory(exportHistory: ExportHistory): void {
  try {
    const history = getExportHistory();
    history.unshift(exportHistory); // Add to beginning of array
    if (history.length > 50) {
      history.pop(); // Keep only last 50 exports
    }
    localStorage.setItem('export-history', JSON.stringify(history));
    console.log('Export history saved successfully:', exportHistory.artworkName);
  } catch (error) {
    console.error('Error saving export history:', error);
  }
}

export function getExportHistory(): ExportHistory[] {
  try {
    const saved = localStorage.getItem('export-history');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading export history:', error);
    return [];
  }
}

// Turbo upload utilities
export async function uploadToTurboWithHistory(
  grid: string[][], 
  creatorName: string, 
  artworkName: string
): Promise<ExportHistory> {
  try {
    // Convert grid to PNG blob
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    const size = grid.length;
    const scale = 8;
    const canvasSize = size * scale;
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Draw pixels
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const color = grid[y][x];
        if (color !== '#ffffff') {
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else throw new Error('Failed to create blob');
      }, 'image/png');
    });
    
    // Create file from blob
    const file = new File([blob], `${artworkName}.png`, { type: 'image/png' });
    
    // Upload to Turbo
    const turboId = await uploadToTurbo(file, false, creatorName);
    
    if (!turboId) {
      throw new Error('Failed to upload to Turbo');
    }
    
    // Create export history entry
    const exportHistory: ExportHistory = {
      id: generateId(),
      creatorName,
      turboLink: `https://arweave.net/${turboId}`,
      artworkName,
      size,
      exportedAt: Date.now()
    };
    
    // Save to localStorage
    saveExportHistory(exportHistory);
    
    return exportHistory;
  } catch (error) {
    console.error('Error uploading to Turbo:', error);
    throw error;
  }
}

// Export utilities
export function exportToPNG(grid: string[][], options: ExportOptions = { format: 'png' }): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  
  const size = grid.length;
  const scale = options.scale || 4;
  const canvasSize = size * scale;
  
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  
  // Draw pixels
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const color = grid[y][x];
      if (color !== '#ffffff') {
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
  
  return canvas.toDataURL('image/png');
}

export function exportToJSON(grid: string[][], name: string): string {
  const data = {
    name,
    grid,
    size: grid.length,
    exportedAt: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
}

export function downloadFile(data: string, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Default color palette
export const DEFAULT_PALETTE = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
  '#008000', '#800000', '#000080', '#808080', '#c0c0c0', '#404040'
]; 