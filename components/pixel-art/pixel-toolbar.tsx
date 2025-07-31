"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Undo2,
  Redo2,
  RotateCcw,
  Grid3X3,
  Eraser,
} from "lucide-react";
import { GridSize } from "@/lib/types";

interface PixelToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  onReset: () => void;
  onToggleGridLines: () => void;
  onToggleEraser: () => void;
  onSizeChange: (size: GridSize) => void;
  canUndo: boolean;
  canRedo: boolean;
  showGridLines: boolean;
  isErasing: boolean;
  currentSize: GridSize;
  selectedColor: string;
}

export default function PixelToolbar({
  onUndo,
  onRedo,
  onSave,
  onExport,
  onReset,
  onToggleGridLines,
  onToggleEraser,
  onSizeChange,
  canUndo,
  canRedo,
  showGridLines,
  isErasing,
  currentSize,
  selectedColor,
}: PixelToolbarProps) {
  const gridSizes: { value: GridSize; label: string }[] = [
    { value: 8, label: "8×8" },
    { value: 16, label: "16×16" },
    { value: 32, label: "32×32" },
  ];

  return (
    <div className="w-full max-w-4xl lg:max-w-none mx-auto">
      <motion.div
        className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-background border rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Row - Drawing Tools and History */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          {/* Drawing Tools */}
          <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
            <Button
              variant={isErasing ? "default" : "outline"}
              size="sm"
              onClick={onToggleEraser}
              className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
            >
              <Eraser className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Eraser</span>
            </Button>

            <div className="w-px h-4 sm:h-6 bg-border" />

            <Button
              variant={showGridLines ? "default" : "outline"}
              size="sm"
              onClick={onToggleGridLines}
              className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
            >
              <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Grid</span>
            </Button>
          </div>

          {/* History Controls */}
          <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
            >
              <Undo2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Undo</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
            >
              <Redo2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Redo</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row - Grid Size and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          {/* Grid Size Selector */}
          <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Size:
            </span>
            <div className="flex items-center gap-1">
              {gridSizes.map((size) => (
                <Button
                  key={size.value}
                  variant={currentSize === size.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSizeChange(size.value)}
                  className="text-xs px-1 sm:px-2 h-7 sm:h-8"
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Reset</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
