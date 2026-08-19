import type { Editor } from "@tiptap/react";

/**
 * Run a chain of editor commands.
 * Workaround for TipTap 3 chain() type issues with TypeScript strict mode.
 */
export function runChain(editor: Editor, fn: (chain: any) => any): boolean {
  return fn(editor.chain()).run();
}

/**
 * Check if a chain of commands can be executed.
 */
export function canRunChain(editor: Editor, fn: (chain: any) => any): boolean {
  try {
    return fn(editor.can().chain()).run() as boolean;
  } catch {
    return false;
  }
}
