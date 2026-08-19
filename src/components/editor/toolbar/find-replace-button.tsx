import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X, Search, Repeat } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/editor/toolbar/toolbar-provider";

export function FindReplaceButton() {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [resultInfo, setResultInfo] = useState({ index: 0, total: 0 });

  useEffect(() => {
    if (!open) return;
    editor.commands.setSearchTerm(searchText);
  }, [searchText, editor, open]);

  useEffect(() => {
    if (!open) return;
    editor.commands.setReplaceTerm(replaceText);
  }, [replaceText, editor, open]);

  useEffect(() => {
    if (!open) return;
    editor.commands.setCaseSensitive(caseSensitive);
  }, [caseSensitive, editor, open]);

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const storage = editor.storage.findAndReplace;
      const total = storage.results.length;
      const index = storage.currentIndex !== null ? storage.currentIndex + 1 : 0;
      setResultInfo({ index, total });
    };

    update();
    editor.on("update", update);
    editor.on("selectionUpdate", update);

    return () => {
      editor.off("update", update);
      editor.off("selectionUpdate", update);
    };
  }, [editor, open]);

  useEffect(() => {
    if (!open) {
      setSearchText("");
      setReplaceText("");
      setReplacing(false);
      setCaseSensitive(false);
    }
  }, [open]);

  const goToNext = () => {
    editor.commands.goToNextResult();
  };

  const goToPrev = () => {
    editor.commands.goToPreviousResult();
  };

  const handleReplace = () => {
    editor.commands.replace();
  };

  const handleReplaceAll = () => {
    editor.commands.replaceAll();
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          editor.commands.clearSearch();
        }
      }}
    >
      <PopoverTrigger
        className={cn(
          "inline-flex items-center justify-center rounded-md h-8 w-8 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          open && "bg-accent text-accent-foreground",
        )}
        aria-label="Find and replace"
      >
        <Search className="h-4 w-4" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[400px] p-0"
      >
        {!replacing ? (
          <div className="flex items-center gap-1.5 p-2">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search..."
              className="h-9 flex-1"
              autoFocus
            />
            <span className="text-xs text-muted-foreground min-w-[44px] text-center">
              {resultInfo.total > 0
                ? `${resultInfo.index}/${resultInfo.total}`
                : "0/0"}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={goToPrev}
              disabled={resultInfo.total === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={goToNext}
              disabled={resultInfo.total === 0}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setReplacing(true)}
            >
              <Repeat className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 -ml-2"
                  onClick={() => setReplacing(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-medium">Search and replace</h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 -mr-2"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="space-y-1.5">
              <Label className="text-base font-normal">Search</Label>
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="h-11 text-base"
              />
              <div className="text-base font-medium">
                {resultInfo.total > 0
                  ? `${resultInfo.index}/${resultInfo.total}`
                  : "0/0"}
              </div>
            </div>

            {/* Replace with */}
            <div className="space-y-1.5">
              <Label className="text-base font-normal">Replace with</Label>
              <Input
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace..."
                className="h-11 text-base"
              />
            </div>

            {/* Match case */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="match-case"
                checked={caseSensitive}
                onCheckedChange={(checked) =>
                  setCaseSensitive(checked === true)
                }
              />
              <Label
                htmlFor="match-case"
                className="text-base font-normal cursor-pointer"
              >
                Match case
              </Label>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10"
                  onClick={goToPrev}
                  disabled={resultInfo.total === 0}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10"
                  onClick={goToNext}
                  disabled={resultInfo.total === 0}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="h-10 px-5"
                  onClick={handleReplaceAll}
                  disabled={resultInfo.total === 0}
                >
                  Replace All
                </Button>
                <Button
                  className="h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleReplace}
                  disabled={resultInfo.total === 0}
                >
                  Replace
                </Button>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
