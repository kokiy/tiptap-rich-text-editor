import { useState } from "react";
import { Highlighter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/editor/toolbar/toolbar-provider";

const highlightColors = [
  { name: "default", label: "Default", var: "var(--highlight-default)" },
  { name: "gray", label: "Gray", var: "var(--highlight-gray)" },
  { name: "brown", label: "Brown", var: "var(--highlight-brown)" },
  { name: "orange", label: "Orange", var: "var(--highlight-orange)" },
  { name: "yellow", label: "Yellow", var: "var(--highlight-yellow)" },
  { name: "green", label: "Green", var: "var(--highlight-green)" },
  { name: "blue", label: "Blue", var: "var(--highlight-blue)" },
  { name: "purple", label: "Purple", var: "var(--highlight-purple)" },
  { name: "pink", label: "Pink", var: "var(--highlight-pink)" },
  { name: "red", label: "Red", var: "var(--highlight-red)" },
];

export function HighlightButton() {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);

  const currentHighlight = editor.getAttributes("highlight").color;
  const isActive = editor.isActive("highlight");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "inline-flex items-center justify-center gap-0.5 rounded-md h-8 w-8 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            isActive && "bg-accent text-accent-foreground",
          )}
          aria-label="Highlight"
          render={<PopoverTrigger />}
        >
          <Highlighter className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Highlight</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-56">
        <div className="space-y-2">
          <div className="text-sm font-medium">Highlight Color</div>
          <div className="grid grid-cols-5 gap-2">
            {highlightColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => {
                  if (editor.isActive("highlight", { color: color.var })) {
                    editor.commands.toggleHighlight();
                  } else {
                    editor.commands.toggleHighlight({ color: color.var });
                  }
                  setOpen(false);
                }}
                className={cn(
                  "h-7 w-7 rounded-md border border-border transition-transform hover:scale-110",
                  currentHighlight === color.var &&
                    "ring-2 ring-ring ring-offset-2",
                )}
                style={{ backgroundColor: color.var }}
                title={color.label}
                aria-label={color.label}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
