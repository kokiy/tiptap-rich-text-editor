import { useState } from "react";
import { Heading1, Heading2, Heading3, Heading4 } from "lucide-react";
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

const levels = [
  { level: 1, icon: Heading1, label: "Heading 1" },
  { level: 2, icon: Heading2, label: "Heading 2" },
  { level: 3, icon: Heading3, label: "Heading 3" },
  { level: 4, icon: Heading4, label: "Heading 4" },
] as const;

export function HeadingButton() {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);

  const activeLevel = levels.find(({ level }) =>
    editor.isActive("heading", { level }),
  )?.level;

  const Icon = activeLevel
    ? levels.find((l) => l.level === activeLevel)!.icon
    : Heading1;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "inline-flex items-center justify-center gap-0.5 rounded-md h-8 px-1 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            !!activeLevel && "bg-accent text-accent-foreground",
          )}
          aria-label="Heading"
          render={<DropdownMenuTrigger />}
        >
          <Icon className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Heading</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-40">
        {levels.map(({ level, icon: LvlIcon, label }) => (
          <DropdownMenuItem
            key={level}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
              setOpen(false);
            }}
            className="gap-2"
          >
            <LvlIcon className="h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => {
            editor.commands.setParagraph();
            setOpen(false);
          }}
          className="gap-2"
        >
          <span className="h-4 w-4 inline-block text-center text-xs">¶</span>
          Paragraph
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
