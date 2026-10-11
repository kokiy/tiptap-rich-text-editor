import { BubbleMenu } from "@tiptap/react/menus";
import { Separator } from "@/components/ui/separator";
import { ToolbarProvider } from "@/components/editor/toolbar/toolbar-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BoldButton } from "@/components/editor/toolbar/bold-button";
import { ItalicButton } from "@/components/editor/toolbar/italic-button";
import { UnderlineButton } from "@/components/editor/toolbar/underline-button";
import { StrikethroughButton } from "@/components/editor/toolbar/strikethrough-button";
import { LinkButton } from "@/components/editor/toolbar/link-button";
import { ColorButton } from "@/components/editor/toolbar/color-button";
import { HighlightButton } from "@/components/editor/toolbar/highlight-button";
import { CodeButton } from "@/components/editor/toolbar/code-button";
import type { Editor } from "@tiptap/core";

interface BubbleMenuProps {
  editor: Editor;
}

export function EditorBubbleMenu({ editor }: BubbleMenuProps) {
  return (
    <BubbleMenu
      editor={editor}
      pluginKey="bubbleMenu"
      shouldShow={({ state }) => {
        const { from, to, empty } = state.selection;
        if (empty) return false;
        let textOnly = true;
        state.doc.nodesBetween(from, to, (node) => {
          if (node.type.name === 'image') { textOnly = false; return false; }
        });
        return textOnly;
      }}
      options={{
        placement: "top",
        offset: 8,
        flip: true,
        shift: true,
      }}
      className="z-50"
    >
      <div className="flex items-center gap-0.5 rounded-md border bg-background p-1 shadow-md">
        <ToolbarProvider editor={editor}>
          <TooltipProvider delay={200}>
            <BoldButton />
            <ItalicButton />
            <UnderlineButton />
            <StrikethroughButton />
            <CodeButton />
            <Separator orientation="vertical" className="mx-0.5 h-6" />
            <ColorButton />
            <HighlightButton />
            <Separator orientation="vertical" className="mx-0.5 h-6" />
            <LinkButton />
          </TooltipProvider>
        </ToolbarProvider>
      </div>
    </BubbleMenu>
  );
}
