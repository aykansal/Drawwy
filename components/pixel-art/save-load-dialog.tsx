"use client";

import { useState, useEffect, SetStateAction } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  X, 
  Download,
  Calendar,
  FileImage
} from "lucide-react";
import { PixelArt } from "@/lib/types";
import { getSavedPixelArts, deletePixelArt } from "@/lib/pixel-art-utils";

interface SaveLoadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  onLoad: (art: PixelArt) => void;
  currentGrid: string[][];
  currentSize: number;
}

export default function SaveLoadDialog({
  isOpen,
  onClose,
  onSave,
  onLoad,
  currentGrid,
  currentSize
}: SaveLoadDialogProps) {
  const [savedArts, setSavedArts] = useState<PixelArt[]>([]);
  const [saveName, setSaveName] = useState("");
  const [activeTab, setActiveTab] = useState<"save" | "load">("save");

  useEffect(() => {
    if (isOpen) {
      setSavedArts(getSavedPixelArts());
    }
  }, [isOpen]);

  const handleSave = () => {
    if (saveName.trim()) {
      onSave(saveName.trim());
      setSaveName("");
      onClose();
    }
  };

  const handleLoad = (art: PixelArt) => {
    onLoad(art);
    onClose();
  };

  const handleDelete = (id: string) => {
    deletePixelArt(id);
    setSavedArts(getSavedPixelArts());
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl p-2 sm:p-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold">
                {activeTab === "save" ? "Save Pixel Art" : "Load Pixel Art"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={activeTab === "save" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("save")}
                  className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Save
                </Button>
                <Button
                  variant={activeTab === "load" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("load")}
                  className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                >
                  <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Load
                </Button>
              </div>

              {activeTab === "save" ? (
                /* Save Tab */
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Artwork Name</label>
                    {/* @ts-expect-error ignore */}
                    <Input
                      value={saveName}
                      onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSaveName(e.target.value)}
                      placeholder="Enter a name for your artwork..."
                      onKeyDown={(e: { key: string; }) => e.key === "Enter" && handleSave()}
                      className="h-8 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <FileImage className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Size: {currentSize}×{currentSize}</span>
                  </div>
                  
                  <Button
                    onClick={handleSave}
                    disabled={!saveName.trim()}
                    className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Save Artwork
                  </Button>
                </div>
              ) : (
                /* Load Tab */
                <div className="space-y-3 sm:space-y-4">
                  {savedArts.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <FolderOpen className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">No saved artworks found</p>
                      <p className="text-xs sm:text-sm">Create and save your first pixel art!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                      {savedArts.map((art) => (
                        <motion.div
                          key={art.id}
                          className="flex items-center justify-between p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded flex items-center justify-center">
                              <FileImage className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-xs sm:text-sm">{art.name}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                                <span>{art.size}×{art.size}</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-2 h-2 sm:w-3 sm:h-3" />
                                  {formatDate(art.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLoad(art)}
                              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                            >
                              <Download className="w-2 h-2 sm:w-3 sm:h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(art.id)}
                              className="text-destructive hover:text-destructive h-6 w-6 sm:h-8 sm:w-8 p-0"
                            >
                              <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 