import { useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/editor/toolbar/toolbar-provider";
import { uploadImage } from "@/lib/upload-image";

export function ImageButton() {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isActive = editor.isActive("image");

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      editor.commands.setImage({ src: url });
      setUrl("");
      setOpen(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 先插入占位符
      editor.commands.insertImagePlaceholder();
      setOpen(false);

      // 上传完成后替换
      const src = await uploadImage(file);
      // 找到占位符图片并替换
      const { doc } = editor.state;
      let placeholderPos: number | null = null;
      doc.descendants((node, pos) => {
        if (node.type.name === "image" && node.attrs.src === "placeholder") {
          placeholderPos = pos;
          return false;
        }
      });
      if (placeholderPos !== null) {
        editor.chain().focus().setNodeSelection(placeholderPos).setImage({ src }).run();
      }
    } catch {
      console.error("Failed to upload image");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
          aria-label="Image"
          render={<PopoverTrigger />}
        >
          <ImageIcon className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Image</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80">
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-3 mt-3">
            <div className="text-sm font-medium">Upload image</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose file
            </Button>
          </TabsContent>
          <TabsContent value="url" className="space-y-3 mt-3">
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <div className="text-sm font-medium">Image URL</div>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="sm" className="w-full">
                Insert image
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
