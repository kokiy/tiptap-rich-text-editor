import { useState } from "react";
import { Link, Link2Off } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/editor/toolbar/toolbar-provider";

export function LinkButton() {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const isActive = editor.isActive("link");

  const handleOpen = () => {
    const attrs = editor.getAttributes("link");
    setUrl(attrs.href ?? "");
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      editor.commands.unsetLink();
    }
    setOpen(false);
  };

  const handleRemove = () => {
    editor.commands.unsetLink();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "inline-flex items-center justify-center rounded-md h-8 w-8 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            isActive && "bg-accent text-accent-foreground",
          )}
          aria-label="Link"
          render={<PopoverTrigger />}
          onClick={handleOpen}
        >
          <Link className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Link</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-sm font-medium">
            {isActive ? "Edit link" : "Add link"}
          </div>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoFocus
          />
          <div className="flex justify-between">
            {isActive ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <Link2Off className="h-4 w-4 mr-1" />
                Remove
              </Button>
            ) : (
              <div />
            )}
            <Button type="submit" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
