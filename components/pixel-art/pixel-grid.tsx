"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { GridSize } from "@/lib/types";

interface PixelGridProps {
  grid: string[][];
  selectedColor: string;
  onPixelChange: (x: number, y: number, color: string) => void;
  showGridLines?: boolean;
  size: GridSize;
}

export default function PixelGrid({
  grid,
  selectedColor,
  onPixelChange,
  showGridLines = true,
  size
}: PixelGridProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((x: number, y: number) => {
    setIsDrawing(true);
    const currentColor = grid[y][x];
    setIsErasing(currentColor === selectedColor);
    onPixelChange(x, y, selectedColor);
  }, [grid, selectedColor, onPixelChange]);

  const handleMouseEnter = useCallback((x: number, y: number) => {
    if (isDrawing) {
      onPixelChange(x, y, selectedColor);
    }
  }, [isDrawing, selectedColor, onPixelChange]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setIsErasing(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    setIsErasing(false);
  }, []);

  const pixelSize = Math.min(
    typeof window !== 'undefined' 
      ? Math.min(window.innerWidth * 0.8, window.innerHeight * 0.6) / size 
      : 400 / size, 
    20
  ); // Responsive pixel size based on viewport
  const gridSize = size * pixelSize;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="font-medium text-sm sm:text-base">Pixel Grid ({size}x{size})</h3>
          <div className="text-xs text-muted-foreground">
            {pixelSize.toFixed(1)}px per pixel
          </div>
        </div>

        <div className="flex justify-center">
          <motion.div
            ref={gridRef}
            className={cn(
              "relative bg-white border border-border",
              showGridLines && "border-gray-300"
            )}
            style={{
              width: gridSize,
              height: gridSize,
              display: 'grid',
              gridTemplateColumns: `repeat(${size}, ${pixelSize}px)`,
              gridTemplateRows: `repeat(${size}, ${pixelSize}px)`,
              maxWidth: '100%',
              maxHeight: '60vh',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {grid.map((row, y) =>
              row.map((color, x) => (
                <motion.div
                  key={`${x}-${y}`}
                  className={cn(
                    "relative cursor-crosshair transition-colors duration-100",
                    showGridLines && "border border-gray-200/50",
                    "hover:brightness-110"
                  )}
                  style={{
                    backgroundColor: color,
                    width: pixelSize,
                    height: pixelSize,
                  }}
                  onMouseDown={() => handleMouseDown(x, y)}
                  onMouseEnter={() => handleMouseEnter(x, y)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (x + y) * 0.001 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))
            )}
          </motion.div>
        </div>

        {/* Drawing Instructions */}
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Click to draw • Drag to paint • Current: {selectedColor}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 