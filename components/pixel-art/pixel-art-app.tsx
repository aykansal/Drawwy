"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import {
  createEmptyGrid,
  addToHistory,
  undo,
  redo,
  canUndo,
  canRedo,
  savePixelArt,
  handleImagePublish,
  generateId,
} from "@/lib/pixel-art-utils";
import { GridSize, PixelArt, HistoryState } from "@/lib/types";
import PixelGrid from "./pixel-grid";
import ColorPalette from "./color-palette";
import PixelToolbar from "./pixel-toolbar";
import SaveLoadDialog from "./save-load-dialog";
import ExportDialog from "./export-dialog";
import ExportHistoryDialog from "./export-history";
import HandWrittenTitle from "../ardacity/hand-written-title";
import { Button } from "@/components/ui/button";
import { Save, History, Upload, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import AiDraw from "./ai-draw";
import { RainbowButton } from "../magicui/rainbow-button";

export default function PixelArtApp() {
  // State management
  const [gridSize, setGridSize] = useState<GridSize>(16);
  const [grid, setGrid] = useState<string[][]>(() => createEmptyGrid(16));
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showGridLines, setShowGridLines] = useState(true);
  const [isErasing, setIsErasing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // History management
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: createEmptyGrid(16),
    future: [],
  });

  // Initialize grid when size changes (only if current grid doesn't match)
  useEffect(() => {
    setGrid((prev) => {
      if (prev.length === gridSize && prev[0]?.length === gridSize) {
        return prev;
      }
      const newGrid = createEmptyGrid(gridSize);
      setHistory({
        past: [],
        present: newGrid,
        future: [],
      });
      console.log(`Grid size changed to ${gridSize}x${gridSize}`);
      return newGrid;
    });
  }, [gridSize]);

  // Handle pixel changes
  const handlePixelChange = useCallback(
    (x: number, y: number, color: string) => {
      const newGrid = grid.map((row) => [...row]);
      newGrid[y][x] = color;
      setGrid(newGrid);

      // Add to history
      const newHistory = addToHistory(history, newGrid);
      setHistory(newHistory);

      console.log(`Pixel changed at (${x}, ${y}) to ${color}`);
    },
    [grid, history]
  );

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const newHistory = undo(history);
    if (newHistory) {
      setHistory(newHistory);
      setGrid(newHistory.present);
      console.log("Undo performed");
    }
  }, [history]);

  const handleRedo = useCallback(() => {
    const newHistory = redo(history);
    if (newHistory) {
      setHistory(newHistory);
      setGrid(newHistory.present);
      console.log("Redo performed");
    }
  }, [history]);

  // Tool handlers
  const handleToggleEraser = useCallback(() => {
    setIsErasing(!isErasing);
    if (!isErasing) {
      setSelectedColor("#ffffff");
    }
    console.log(`Eraser ${!isErasing ? "enabled" : "disabled"}`);
  }, [isErasing]);

  const handleToggleGridLines = useCallback(() => {
    setShowGridLines(!showGridLines);
    console.log(`Grid lines ${!showGridLines ? "enabled" : "disabled"}`);
  }, [showGridLines]);

  const handleSizeChange = useCallback(
    (newSize: GridSize) => {
      if (newSize === gridSize) return;
      const DEFAULT_COLOR = "#ffffff";
      const hasNonDefaultPixels = grid.some((row) =>
        row.some((c) => c !== DEFAULT_COLOR)
      );
      if (hasNonDefaultPixels) {
        const confirmed = window.confirm(
          "Changing the grid size will clear your current drawing. Continue?"
        );
        if (!confirmed) return;
      }
      setGridSize(newSize);
      console.log(`Grid size changed to ${newSize}x${newSize}`);
    },
    [grid, gridSize]
  );

  const handleReset = useCallback(() => {
    const newGrid = createEmptyGrid(gridSize);
    setGrid(newGrid);
    setHistory({
      past: [],
      present: newGrid,
      future: [],
    });
    console.log("Canvas reset");
  }, [gridSize]);

  const handleApplyAIResult = useCallback(
    (aiGrid: string[][], aiSize?: 8 | 16 | 32) => {
      const newSize = aiSize ?? (aiGrid.length as 8 | 16 | 32);
      if (newSize !== 8 && newSize !== 16 && newSize !== 32) return;
      // Apply grid first, then size, to avoid reset effect overriding the AI grid
      setGrid(aiGrid);
      setGridSize(newSize);
      setHistory({ past: [], present: aiGrid, future: [] });
    },
    []
  );

  // Save/Load handlers
  const handleSave = useCallback(
    (name: string) => {
      const art: PixelArt = {
        id: generateId(),
        name,
        grid,
        size: gridSize,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      savePixelArt(art);
      console.log(`Artwork saved: ${name}`);
    },
    [grid, gridSize]
  );

  const handleLoad = useCallback((art: PixelArt) => {
    setGrid(art.grid);
    setGridSize(art.size as GridSize);
    setHistory({
      past: [],
      present: art.grid,
      future: [],
    });
    console.log(`Artwork loaded: ${art.name}`);
  }, []);

  // Turbo export handler
  const handleTurboExport = useCallback(
    async (creatorName: string, artworkName: string) => {
      try {
        const exportHistory = await handleImagePublish(
          grid,
          creatorName,
          artworkName
        );
        console.log(`Artwork uploaded to Turbo: ${exportHistory.turboLink}`);
        toast.success("Successfully uploaded!", {
          action: {
            label: "View",
            onClick: () => {
              window.open(exportHistory.turboLink, "_blank");
            },
          },
        });
      } catch (error) {
        console.error("Turbo export failed:", error);
        toast.error("Upload failed", {
          description: "Please try again !!",
        });
        throw error;
      }
    },
    [grid]
  );

  // Custom color handlers
  const handleCustomColorAdd = useCallback(
    (color: string) => {
      if (!customColors.includes(color)) {
        setCustomColors((prev) => [...prev, color]);
        console.log(`Custom color added: ${color}`);
      }
    },
    [customColors]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Floating Action Bar - Top Right */}
      <motion.div
        className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center gap-1 sm:gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <RainbowButton
          onClick={() => setShowAI(true)}
          className="flex items-center gap-1 sm:gap-2 bg-background/80 backdrop-blur-sm border-border/50 shadow-lg h-8 sm:h-9 px-2 sm:px-3"
          title="Draw AI"
        >
          <WandSparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden md:inline text-xs sm:text-sm">Draw AI</span>
        </RainbowButton>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center gap-1 sm:gap-2 bg-background/80 backdrop-blur-sm border-border/50 shadow-lg h-8 sm:h-9 px-2 sm:px-3"
        >
          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden md:inline text-xs sm:text-sm">Save Draft</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={() => setShowExportDialog(true)}
          className="flex items-center gap-1 sm:gap-2 bg-primary/90 backdrop-blur-sm shadow-lg h-8 sm:h-9 px-2 sm:px-3"
        >
          <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden md:inline text-xs sm:text-sm">Publish</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistoryDialog(true)}
          className="flex items-center gap-1 sm:gap-2 bg-background/80 backdrop-blur-sm border-border/50 shadow-lg h-8 sm:h-9 px-2 sm:px-3"
        >
          <History className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden md:inline text-xs sm:text-sm">History</span>
        </Button>
      </motion.div>

      {/* Removed floating AI button; now adjacent to History button */}

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HandWrittenTitle title="Drawwy" subtitle="" />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Left Sidebar - Color Palette */}
          <motion.div
            className="lg:col-span-1 order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Toolbar */}
            <div className="mb-4 sm:mb-6">
              <PixelToolbar
                onUndo={handleUndo}
                onRedo={handleRedo}
                // onSave={() => {}} // Empty function since buttons moved to top
                // onExport={() => {}} // Empty function since buttons moved to top
                onReset={handleReset}
                onToggleGridLines={handleToggleGridLines}
                onToggleEraser={handleToggleEraser}
                onSizeChange={handleSizeChange}
                canUndo={canUndo(history)}
                canRedo={canRedo(history)}
                showGridLines={showGridLines}
                isErasing={isErasing}
                currentSize={gridSize}
                // selectedColor={selectedColor}
              />
            </div>
            <ColorPalette
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              customColors={customColors}
              onCustomColorAdd={handleCustomColorAdd}
            />
          </motion.div>

          {/* Center - Pixel Grid */}
          <motion.div
            className="lg:col-span-2 order-1 lg:order-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Pixel Grid */}
              <PixelGrid
                grid={grid}
                selectedColor={selectedColor}
                onPixelChange={handlePixelChange}
                showGridLines={showGridLines}
                size={gridSize}
              />
            </div>
          </motion.div>
        </div>

        {/* Save/Load Dialog */}
        <SaveLoadDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSave}
          onLoad={handleLoad}
          currentGrid={grid}
          currentSize={gridSize}
        />

        {/* Export Dialog */}
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onExport={handleTurboExport}
          currentGrid={grid}
          currentSize={gridSize}
        />

        {/* Export History Dialog */}
        <ExportHistoryDialog
          isOpen={showHistoryDialog}
          onClose={() => setShowHistoryDialog(false)}
        />

        {/* AI Drawer */}
        <AiDraw
          isOpen={showAI}
          onOpenChange={setShowAI}
          grid={grid}
          size={gridSize}
          onApplyAIResult={handleApplyAIResult}
        />
      </div>
    </div>
  );
}
