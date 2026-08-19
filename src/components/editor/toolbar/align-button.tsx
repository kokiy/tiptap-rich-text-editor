import { useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/editor/toolbar/toolbar-provider";

const alignments = [
  { value: "left", icon: AlignLeft, label: "Align left" },
  { value: "center", icon: AlignCenter, label: "Align center" },
  { value: "right", icon: AlignRight, label: "Align right" },
  { value: "justify", icon: AlignJustify, label: "Justify" },
] as const;

export function AlignButton() {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);

  const active = alignments.find(({ value }) =>
    editor.isActive({ textAlign: value }),
  );
  const Icon = active?.icon ?? AlignLeft;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "inline-flex items-center justify-center gap-0.5 rounded-md h-8 w-8 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            active && active.value !== "left" && "bg-accent text-accent-foreground",
          )}
          aria-label="Align"
          render={<DropdownMenuTrigger />}
        >
          <Icon className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Align</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-40">
        {alignments.map(({ value, icon: AlignIcon, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => {
              editor.commands.setTextAlign(value);
              setOpen(false);
            }}
            className="gap-2"
          >
            <AlignIcon className="h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
