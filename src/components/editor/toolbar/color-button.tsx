import { useState } from "react";
import { Palette, ChevronDown } from "lucide-react";
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

const colors = [
  { name: "default", label: "Default", var: "var(--text-default)" },
  { name: "gray", label: "Gray", var: "var(--text-gray)" },
  { name: "brown", label: "Brown", var: "var(--text-brown)" },
  { name: "orange", label: "Orange", var: "var(--text-orange)" },
  { name: "yellow", label: "Yellow", var: "var(--text-yellow)" },
  { name: "green", label: "Green", var: "var(--text-green)" },
  { name: "blue", label: "Blue", var: "var(--text-blue)" },
  { name: "purple", label: "Purple", var: "var(--text-purple)" },
  { name: "pink", label: "Pink", var: "var(--text-pink)" },
  { name: "red", label: "Red", var: "var(--text-red)" },
];

export function ColorButton() {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);

  const currentColor = editor.getAttributes("textStyle").color;
  const isActive = !!currentColor;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "inline-flex items-center justify-center gap-0.5 rounded-md h-8 px-1 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            isActive && "bg-accent text-accent-foreground",
          )}
          aria-label="Text color"
          render={<PopoverTrigger />}
        >
          <Palette className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </TooltipTrigger>
        <TooltipContent>Text color</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-56">
        <div className="space-y-2">
          <div className="text-sm font-medium">Text Color</div>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => {
                  if (color.name === "default") {
                    editor.chain().focus().unsetColor().run();
                  } else {
                    editor.chain().focus().setColor(color.var).run();
                  }
                  setOpen(false);
                }}
                className={cn(
                  "h-7 w-7 rounded-md border border-border transition-transform hover:scale-110",
                  currentColor === color.var &&
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
