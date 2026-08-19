import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToolbarProvider } from "@/components/editor/toolbar/toolbar-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UndoButton } from "@/components/editor/toolbar/undo-button";
import { RedoButton } from "@/components/editor/toolbar/redo-button";
import { HeadingButton } from "@/components/editor/toolbar/heading-button";
import { BlockquoteButton } from "@/components/editor/toolbar/blockquote-button";
import { CodeButton } from "@/components/editor/toolbar/code-button";
import { CodeBlockButton } from "@/components/editor/toolbar/code-block-button";
import { BoldButton } from "@/components/editor/toolbar/bold-button";
import { ItalicButton } from "@/components/editor/toolbar/italic-button";
import { UnderlineButton } from "@/components/editor/toolbar/underline-button";
import { StrikethroughButton } from "@/components/editor/toolbar/strikethrough-button";
import { LinkButton } from "@/components/editor/toolbar/link-button";
import { BulletListButton } from "@/components/editor/toolbar/bullet-list-button";
import { OrderedListButton } from "@/components/editor/toolbar/ordered-list-button";
import { HorizontalRuleButton } from "@/components/editor/toolbar/horizontal-rule-button";
import { AlignButton } from "@/components/editor/toolbar/align-button";
import { ColorButton } from "@/components/editor/toolbar/color-button";
import { HighlightButton } from "@/components/editor/toolbar/highlight-button";
import { ImageButton } from "@/components/editor/toolbar/image-button";
import { FindReplaceButton } from "@/components/editor/toolbar/find-replace-button";
import { SubscriptButton } from "@/components/editor/toolbar/subscript-button";
import { SuperscriptButton } from "@/components/editor/toolbar/superscript-button";
import type { Editor } from "@tiptap/react";

export interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="sticky top-0 z-20 w-full border-b bg-background">
      <ToolbarProvider editor={editor}>
        <TooltipProvider delay={200}>
          <ScrollArea className="h-fit py-0.5">
            <div className="flex items-center gap-1 px-2 min-w-max">
              <UndoButton />
              <RedoButton />
              <Separator orientation="vertical" className="mx-1 h-7" />

              <HeadingButton />
              <BlockquoteButton />
              <CodeButton />
              <CodeBlockButton />
              <Separator orientation="vertical" className="mx-1 h-7" />

              <BoldButton />
              <ItalicButton />
              <UnderlineButton />
              <StrikethroughButton />
              <LinkButton />
              <Separator orientation="vertical" className="mx-1 h-7" />

              <BulletListButton />
              <OrderedListButton />
              <HorizontalRuleButton />
              <Separator orientation="vertical" className="mx-1 h-7" />

              <AlignButton />
              <Separator orientation="vertical" className="mx-1 h-7" />

              <ColorButton />
              <HighlightButton />
              <Separator orientation="vertical" className="mx-1 h-7" />

              <SubscriptButton />
              <SuperscriptButton />
              <Separator orientation="vertical" className="mx-1 h-7" />

              <ImageButton />
              <div className="flex-1" />
              <FindReplaceButton />
            </div>
            <ScrollBar className="hidden" orientation="horizontal" />
          </ScrollArea>
        </TooltipProvider>
      </ToolbarProvider>
    </div>
  );
}
