"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  X, 
  User,
  FileImage,
  ExternalLink,
  Loader2
} from "lucide-react";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (creatorName: string, artworkName: string) => Promise<void>;
  currentGrid: string[][];
  currentSize: number;
}

export default function ExportDialog({
  isOpen,
  onClose,
  onExport,
  currentGrid,
  currentSize
}: ExportDialogProps) {
  const [creatorName, setCreatorName] = useState("");
  const [artworkName, setArtworkName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleExport = async () => {
    if (!creatorName.trim() || !artworkName.trim()) return;
    
    setIsUploading(true);
    try {
      await onExport(creatorName.trim(), artworkName.trim());
      setCreatorName("");
      setArtworkName("");
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsUploading(false);
    }
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
          className="w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload to Arweave
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Artist Name
                  </label>
                  <Input
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="Enter your name..."
                    disabled={isUploading}
                    onKeyDown={(e) => e.key === "Enter" && handleExport()}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileImage className="w-4 h-4" />
                    Artwork Name
                  </label>
                  <Input
                    value={artworkName}
                    onChange={(e) => setArtworkName(e.target.value)}
                    placeholder="Enter artwork name..."
                    disabled={isUploading}
                    onKeyDown={(e) => e.key === "Enter" && handleExport()}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileImage className="w-4 h-4" />
                <span>Size: {currentSize}×{currentSize}</span>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <p>Your artwork will be uploaded to Arweave and stored permanently on the blockchain.</p>
                <p className="mt-1">You'll receive a link that you can share with others.</p>
              </div>
              
              <Button
                onClick={handleExport}
                disabled={!creatorName.trim() || !artworkName.trim() || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to Arweave
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 