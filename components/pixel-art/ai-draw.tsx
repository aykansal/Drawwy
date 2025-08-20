"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2, WandSparkles, X, Loader2 } from "lucide-react";
import { GridSize } from "@/lib/types";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AiResponse = {
  action: "none" | "replace_grid";
  reply: string;
  size?: 8 | 16 | 32;
  grid?: string[][];
};

interface AiDrawProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  grid: string[][];
  size: GridSize;
  onApplyAIResult: (grid: string[][], size?: 8 | 16 | 32) => void;
}

const STORAGE_KEY = "drawwy-ai-chat";

export default function AiDraw({
  isOpen,
  onOpenChange,
  grid,
  size,
  onApplyAIResult,
}: AiDrawProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!canSend) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          grid,
          size,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data: AiResponse = await res.json();

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.reply || "",
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.action === "replace_grid" &&
        data.grid &&
        (data.grid.length === 8 || data.grid.length === 16 || data.grid.length === 32)
      ) {
        onApplyAIResult(data.grid, data.size);
      }
    } catch (err) {
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: "Sorry, I couldn't generate that. Please try again.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [canSend, input, messages, grid, size, onApplyAIResult]);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="left">
      <DrawerContent>
        <div className="flex h-full min-h-[50vh] flex-col">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WandSparkles className="w-4 h-4" />
                <DrawerTitle>Draw AI</DrawerTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleNewChat} title="New chat">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} title="Close">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="flex-1">
            <Card className="h-full rounded-none border-0">
              <CardContent className="p-0 h-full flex flex-col">
                <div ref={viewportRef} className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.length === 0 && (
                    <div className="text-xs text-muted-foreground">
                      Tip: Ask me to draw an "8x8 red heart", "16x16 tree", or "add a blue border to current art".
                    </div>
                  )}
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={
                        m.role === "user"
                          ? "bg-primary/10 text-primary px-3 py-2 rounded-md text-xs"
                          : "bg-muted px-3 py-2 rounded-md text-xs"
                      }
                    >
                      {m.content}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-muted px-3 py-2 rounded-md text-xs text-muted-foreground flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Generating...
                    </div>
                  )}
                </div>

                <div className="p-3 border-t flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Describe what to draw (size ${size}x${size})`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={!canSend}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}


