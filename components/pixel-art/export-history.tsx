"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  History,
  X,
  ExternalLink,
  User,
  FileImage,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { getExportHistory } from "@/lib/pixel-art-utils";
import { ExportHistory } from "@/lib/types";

interface ExportHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportHistoryDialog({
  isOpen,
  onClose,
}: ExportHistoryDialogProps) {
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setExportHistory(getExportHistory());
    }
  }, [isOpen]);

  const handleCopyLink = async (link: string, id: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      " " +
      new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
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
          className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl max-h-[70vh] sm:max-h-[80vh] overflow-hidden p-2 sm:p-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
                Export History
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

            <CardContent className="flex-1 overflow-hidden">
              {exportHistory.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <History className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">No exports yet</p>
                  <p className="text-xs sm:text-sm">
                    Upload your first artwork to see it here!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                  {exportHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded flex items-center justify-center">
                          <FileImage className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-xs sm:text-sm">
                            {item.artworkName}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-2 h-2 sm:w-3 sm:h-3" />
                              {item.creatorName}
                            </span>
                            <span>
                              {item.size}×{item.size}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-2 h-2 sm:w-3 sm:h-3" />
                              {formatDate(item.exportedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleCopyLink(item.turboLink, item.id)
                          }
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-2 h-2 sm:w-3 sm:h-3 text-green-600" />
                          ) : (
                            <Copy className="w-2 h-2 sm:w-3 sm:h-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(item.turboLink, "_blank")}
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                        >
                          <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
