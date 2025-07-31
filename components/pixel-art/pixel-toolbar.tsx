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
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        className="flex flex-col gap-3 p-4 bg-background border rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Row - Drawing Tools and History */}
        <div className="flex items-center justify-between gap-4">
          {/* Drawing Tools */}
          <div className="flex items-center gap-2">
            <Button
              variant={isErasing ? "default" : "outline"}
              size="sm"
              onClick={onToggleEraser}
              className="flex items-center gap-2"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Eraser</span>
            </Button>

            <div className="w-px h-6 bg-border" />

            <Button
              variant={showGridLines ? "default" : "outline"}
              size="sm"
              onClick={onToggleGridLines}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
          </div>

          {/* History Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-2"
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Undo</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex items-center gap-2"
            >
              <Redo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Redo</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row - Grid Size and Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Grid Size Selector */}
          <div className="flex items-center gap-2">
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
                  className="text-xs px-2"
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
