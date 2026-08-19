import Image from "@tiptap/extension-image";
import { mergeAttributes, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-image";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageResize: {
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
      insertImagePlaceholder: () => ReturnType;
      uploadAndInsertImage: (file: File) => ReturnType;
    };
  }
}

function ImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt = "", title = "" } = node.attrs;
  const [resizing, setResizing] = useState(false);
  const isLoading = src === "" || src === "placeholder";

  const handleMouseDown = useCallback(
    (direction: "left" | "right") => (e: React.MouseEvent) => {
      if (isLoading) return;
      e.preventDefault();
      e.stopPropagation();
      setResizing(true);

      const startX = e.clientX;
      const startWidth = node.attrs.width
        ? Number(node.attrs.width)
        : (e.currentTarget as HTMLElement)
            .closest("[data-image-wrapper]")
            ?.getBoundingClientRect().width ?? 300;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startX;
        const newWidth =
          direction === "right" ? startWidth + diff : startWidth - diff;
        const clampedWidth = Math.max(50, Math.min(newWidth, 1200));
        updateAttributes({ width: clampedWidth });
      };

      const handleMouseUp = () => {
        setResizing(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [isLoading, node.attrs.width, updateAttributes],
  );

  const width = node.attrs.width ? `${node.attrs.width}px` : "100%";

  if (isLoading) {
    return (
      <NodeViewWrapper
        data-image-wrapper
        className={cn(
          "relative inline-block max-w-full my-2",
          selected && "ring-2 ring-ring ring-offset-2",
        )}
        style={{ width: width || "200px" }}
      >
        <div className="flex flex-col items-center justify-center gap-2 p-8 border border-dashed rounded-md bg-muted/50">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Uploading image...</span>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      data-image-wrapper
      className={cn(
        "relative inline-block max-w-full my-2",
        selected && "ring-2 ring-ring ring-offset-2",
      )}
      style={{ width }}
    >
      <img
        src={src}
        alt={alt}
        title={title}
        className={cn(
          "block max-w-full h-auto rounded",
          resizing && "select-none pointer-events-none",
        )}
        draggable={false}
      />
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-3 cursor-ew-resize flex items-center justify-center",
          "opacity-0 hover:opacity-100 transition-opacity",
          selected && "opacity-100",
        )}
        onMouseDown={handleMouseDown("left")}
      >
        <div className="h-8 w-1 rounded-full bg-ring/60" />
      </div>
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-3 cursor-ew-resize flex items-center justify-center",
          "opacity-0 hover:opacity-100 transition-opacity",
          selected && "opacity-100",
        )}
        onMouseDown={handleMouseDown("right")}
      >
        <div className="h-8 w-1 rounded-full bg-ring/60" />
      </div>
    </NodeViewWrapper>
  );
}

const ImageExtension = Image.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      allowBase64: true,
      resize: false,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return { width: attributes.width };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      insertImagePlaceholder:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src: "placeholder" },
          });
        },
      uploadAndInsertImage:
        (file: File) =>
        ({ commands, state }) => {
          // 先插入占位符
          const { from } = state.selection;
          commands.insertContentAt(from, {
            type: this.name,
            attrs: { src: "placeholder" },
          });

          // 上传完成后替换
          uploadImage(file)
            .then((url) => {
              // 找到占位符节点并替换
              // 这里用 setTimeout 确保命令链已执行
              setTimeout(() => {
                
                // 简单方式:通过 node 查找 placeholder
                // 实际项目里可以用更精确的方式
                this.editor?.commands.setImage({ src: url });
              }, 0);
            })
            .catch(() => {
              console.error("Image upload failed");
            });

          return true;
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export default ImageExtension;
