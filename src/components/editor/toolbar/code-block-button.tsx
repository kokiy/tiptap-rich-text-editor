import { Code2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/editor/toolbar/toolbar-provider";

export function CodeBlockButton() {
  const { editor } = useToolbar();
  const isActive = editor.isActive("codeBlock");
  const canRun = editor.can().toggleCodeBlock();

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "inline-flex items-center justify-center rounded-md h-8 w-8 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-accent text-accent-foreground",
        )}
                onClick={() => editor.commands.toggleCodeBlock()}
        disabled={!canRun}
        aria-label="Code block"
      >
        <Code2 className="h-4 w-4" />
      </TooltipTrigger>
      <TooltipContent>Code block</TooltipContent>
    </Tooltip>
  );
}
