"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, AlertCircle } from "lucide-react";
import { loadGridFromTurboLink, stringToGrid } from "@/lib/pixel-art-utils";

interface LoadFromTurboProps {
  onGridLoaded: (grid: string[][], metadata: any) => void;
}

export default function LoadFromTurbo({ onGridLoaded }: LoadFromTurboProps) {
  const [turboLink, setTurboLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadGrid = async () => {
    if (!turboLink.trim()) {
      setError("Please enter a Turbo link");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Loading grid from Turbo link:", turboLink);
      const { grid, metadata } = await loadGridFromTurboLink(turboLink);
      
      console.log("Grid loaded successfully:", {
        gridSize: grid.length,
        metadata
      });
      
      onGridLoaded(grid, metadata);
      setTurboLink("");
    } catch (err) {
      console.error("Error loading grid:", err);
      setError(err instanceof Error ? err.message : "Failed to load grid");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Load from Turbo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter Turbo link (https://arweave.net/...)"
            value={turboLink}
            onChange={(e) => setTurboLink(e.target.value)}
            disabled={isLoading}
          />
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleLoadGrid} 
          disabled={isLoading || !turboLink.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Load for Editing
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Paste a Turbo link to load the artwork back into the editor for further editing.
        </p>
      </CardContent>
    </Card>
  );
} 