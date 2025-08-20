import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const apiKey = "AIzaSyAQxpY1Sd_xgF5kE6ds7eKwBjlPzAqnVF4";

const google = createGoogleGenerativeAI({
  apiKey
});

const model = google("gemini-2.5-flash");
const MAX_LOG_CHARS = 800;
const truncate = (s: string, n: number = MAX_LOG_CHARS) => {
  try {
    return typeof s === "string" && s.length > n ? s.slice(0, n) + "…" : s;
  } catch {
    return s;
  }
};
const hexColor = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
  .describe("Hex color like #ffffff");

const gridSchema = z
  .array(z.array(hexColor))
  .superRefine((rows, ctx) => {
    if (rows.length !== 8 && rows.length !== 16 && rows.length !== 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Grid must be 8x8, 16x16, or 32x32",
      });
      return;
    }
    const width = rows[0]?.length ?? 0;
    if (width !== 8 && width !== 16 && width !== 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Grid must be 8x8, 16x16, or 32x32",
      });
      return;
    }
    for (const row of rows) {
      if (row.length !== width) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "All rows must have equal length",
        });
        return;
      }
    }
  });

const responseSchema = z.object({
  action: z.enum(["none", "replace_grid"]).default("none"),
  reply: z.string().default(""),
  size: z.union([z.literal(8), z.literal(16), z.literal(32)]).optional(),
  grid: gridSchema.optional(),
});

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_GENERATIVE_AI_API_KEY server environment variable" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const messages = (body?.messages ?? []) as Array<{ role: string; content: string }>;
    const currentGrid = (body?.grid ?? []) as string[][];
    const requestedSize = Number(body?.size);

    const effectiveSize = [8, 16, 32].includes(requestedSize) ? requestedSize : 16;

    console.log("\n[AI] Incoming request", {
      messagesCount: messages.length,
      requestedSize,
      effectiveSize,
      currentGridSize: Array.isArray(currentGrid) && currentGrid.length
        ? `${currentGrid.length}x${currentGrid[0]?.length}`
        : "none",
    });

    const systemInstructions = `
You are an expert pixel-art assistant.

Definitions:
- Size N means an N by N square grid. Example: size 16 means exactly 16 pixels rows and 16 pixels columns.

Rules:
- You may only create or modify grids of size 8x8, 16x16, or 32x32.
- Colors must be valid hex codes like #ffffff.
- The grid must be perfectly square: exactly N rows and each row must have exactly N hex strings.
- The size field must be a number (8, 16, or 32), not a string like "8x8", "16x16", or "32x32".
- Prefer simple, readable palettes. Background should default to #ffffff unless instructed.
- When modifying current art, return a complete replacement grid in the same size if appropriate.
- If the user's current grid size is not 8, 16, or 32, suggest switching to one of these, but do not output a grid with any other size.
- Output must strictly follow JSON schema: { action, reply, size, grid? }.
- Do not include code fences, explanations, or any prose outside the JSON.
`;

const systemInstructions_2=`
You are an expert pixel-art assistant.

Definitions:
- Size N means an N by N square grid. Example: size 16 means exactly 16 pixel rows and 16 pixel columns.
- The grid is a flat 2D canvas viewed from above.
- The origin (0,0) is the top-left pixel of the grid.
- X-axis increases left → right (columns).
- Y-axis increases top → bottom (rows).

Spatial rules:
- "In front of" means to the right of an object (positive X direction).
- "Behind" means to the left of an object (negative X direction).
- "Above" means upward on the canvas (toward smaller Y values).
- "Below" means downward on the canvas (toward larger Y values).
- Objects must always be placed in the correct relative position according to this 2D coordinate system.

General rules:
- You may only create or modify grids of size 8x8, 16x16, or 32x32.
- Colors must be valid hex codes like #ffffff.
- The grid must be perfectly square: exactly N rows and each row must have exactly N hex strings.
- The size field must be a number (8, 16, or 32), not a string like "8x8", "16x16", or "32x32".
- Background must default to #ffffff unless instructed otherwise.
- Prefer simple, readable color palettes.
- Never write text, letters, or object names inside the grid — only draw with colors.
- When modifying current art, always return a full replacement grid of the same size, with the requested changes applied.
- If the current grid size is not 8, 16, or 32, suggest switching to one of these, but never output other sizes.
- Output must strictly follow JSON schema: { action, reply, size, grid? }.
- Do not include code fences, explanations, or any prose outside the JSON.

Your goal:
- Generate accurate, precise pixel art based on user instructions.
- Ensure spatial placement matches the 2D grid perspective.
- Maintain consistency and avoid unintended artifacts.

`

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}:\n${m.content}`)
      .join("\n\n");

    const currentGridText = Array.isArray(currentGrid) && currentGrid.length
      ? `Current canvas (${currentGrid.length}x${currentGrid[0]?.length}):\n${JSON.stringify(currentGrid)}`
      : "No current canvas provided.";

    const prompt = `${systemInstructions_2}\n\nConversation so far:\n${conversation}\n\n${currentGridText}\n\nTask: Respond to the latest user with a short helpful 'reply'. If appropriate, include a full 8x8 or 16x16 'grid' and set action to 'replace_grid'. Prefer the requested size (${effectiveSize}x${effectiveSize}) when generating.`;

    const result = await generateText({
      model,
      prompt: `${prompt}\n\nOutput strict JSON only with keys: action, reply, size, grid. Requirements: size must be a number 8, 16, or 32 (not a string), grid must be an array of N rows each containing N hex color strings, where N = size. Do not include code fences or any extra text.`,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 0,
          },

        },
      }
    });

    let object: unknown;
    const text = result.text.trim();

    // Remove code fences like ```json ... ``` to allow clean JSON parsing
    let cleaned = text;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\s*/i, "");
      cleaned = cleaned.replace(/\s*```\s*$/i, "");
    }
    console.log("\n[AI] Cleaned text preview:\n", truncate(cleaned));

    try {
      object = JSON.parse(cleaned);
    } catch {
      // Fallback: extract the first JSON object in the text
      const first = cleaned.indexOf("{");
      const last = cleaned.lastIndexOf("}");
      if (first !== -1 && last !== -1 && last > first) {
        const slice = cleaned.slice(first, last + 1);
        try {
          object = JSON.parse(slice);
        } catch {
          object = { action: "none", reply: "", size: undefined, grid: undefined };
        }
      } else {
        object = { action: "none", reply: "", size: undefined, grid: undefined };
      }
    }

    // Coerce common mistakes: size as "8x8"/"16x16" strings
    if (object && typeof object === "object" && (object as any).size) {
      const rawSize = (object as any).size;
      if (typeof rawSize === "string") {
        if (rawSize.trim() === "8x8") (object as any).size = 8;
        else if (rawSize.trim() === "16x16") (object as any).size = 16;
        else if (rawSize.trim() === "32x32") (object as any).size = 32;
        else if (/^\d+$/.test(rawSize.trim())) (object as any).size = parseInt(rawSize.trim(), 10);
      }
    }

    const parsed = responseSchema.safeParse(object);
    const value = parsed.success
      ? parsed.data
      : { action: "none" as const, reply: "", size: undefined, grid: undefined };

    console.log("\n[AI] Parsed valid:", parsed.success);
    if (!parsed.success) {
      console.log("\n[AI] Parse error:", parsed.error.flatten());
    }
    console.log("\n[AI] Parsed summary:", {
      action: value.action,
      size: value.size ?? null,
      gridSize: value.grid ? `${value.grid.length}x${value.grid[0]?.length}` : "none",
    });

    if (value.grid) {
      // Ensure size matches 8 or 16
      const s = value.grid.length;
      if (s !== 8 && s !== 16 && s !== 32) {
        value.grid = undefined;
        value.action = "none";
        value.reply = `${value.reply}\n\n(Note: The generated grid was discarded because it was not 8x8 or 16x16.)`;
        console.log("\n[AI] Discarded grid due to invalid size:", s);
      }
    }

    console.log("\n[AI] Responding with:", {
      action: value.action,
      size: value.size ?? null,
      grid: value.grid ? `grid[${value.grid.length}x${value.grid[0]?.length}]` : null,
      replyPreview: truncate(value.reply ?? ""),
    });

    return NextResponse.json(value);
  } catch (error) {
    console.error("/api/ai error", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}


