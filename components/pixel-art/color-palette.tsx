"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Plus } from "lucide-react";
import { DEFAULT_PALETTE } from "@/lib/pixel-art-utils";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  customColors?: string[];
  onCustomColorAdd?: (color: string) => void;
}

export default function ColorPalette({
  selectedColor,
  onColorSelect,
  customColors = [],
  onCustomColorAdd
}: ColorPaletteProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");

  const allColors = [...DEFAULT_PALETTE, ...customColors];

  const handleCustomColorAdd = () => {
    if (onCustomColorAdd && customColor) {
      onCustomColorAdd(customColor);
      setCustomColor("#000000");
      setShowColorPicker(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Color Palette</h3>
        </div>

        {/* Selected Color Display */}
        <motion.div
          className="mb-4 p-3 rounded-lg border-2 border-dashed border-muted-foreground/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: selectedColor }}
              layoutId="selectedColor"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Current Color</p>
              <p className="text-sm font-mono">{selectedColor}</p>
            </div>
          </div>
        </motion.div>

        {/* Color Grid */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          {allColors.map((color, index) => (
            <motion.button
              key={`${color}-${index}`}
              onClick={() => onColorSelect(color)}
              className={cn(
                "w-8 h-8 rounded-lg border-2 transition-all duration-200",
                "hover:scale-110 hover:shadow-md",
                selectedColor === color
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              style={{ backgroundColor: color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Color
          </Button>

          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-8 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1 px-3 py-1 text-sm border border-border rounded-md font-mono"
                  placeholder="#000000"
                />
              </div>
              <Button
                size="sm"
                onClick={handleCustomColorAdd}
                className="w-full"
              >
                Add to Palette
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 