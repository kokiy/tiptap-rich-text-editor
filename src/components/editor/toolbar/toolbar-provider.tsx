import { createContext, useContext, type ReactNode } from "react";
import type { Editor } from "@tiptap/react";

interface ToolbarContextValue {
  editor: Editor;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

export function ToolbarProvider({
  editor,
  children,
}: {
  editor: Editor;
  children: ReactNode;
}) {
  return (
    <ToolbarContext.Provider value={{ editor }}>
      {children}
    </ToolbarContext.Provider>
  );
}

export function useToolbar() {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbar must be used within ToolbarProvider");
  }
  return context;
}
