import { useRef, useState } from "react";
import { Image as ImageIcon, Link, Upload } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToolbar } from "@/components/editor/toolbar/toolbar-provider";

export function ImageButton() {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    (editor.commands as any).uploadImage(file);
    setOpen(false);
    e.target.value = "";
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    (editor.commands as any).setImage({ src: url, alt });
    setOpen(false);
    setUrl("");
    setAlt("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
        title="Insert image"
        aria-label="Insert image"
      >
        <ImageIcon className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link className="h-4 w-4 mr-2" />
              URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-4">
            <div className="flex flex-col items-center justify-center gap-3 p-4 border-2 border-dashed border-muted rounded-lg">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Click to upload an image from your computer
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={false}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Image
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="url" className="mt-4 space-y-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-alt">Alt text (optional)</Label>
                <Input
                  id="image-alt"
                  type="text"
                  placeholder="Image description"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </div>
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
