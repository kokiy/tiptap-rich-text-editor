import Image from "@tiptap/extension-image";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { mergeAttributes, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useCallback, useState } from "react";
import { Loader2, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Trash2, Type, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-image";

type Align = "left" | "center" | "right";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageResize: {
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
      setImageAlign: (align: Align) => ReturnType;
      setImageCaption: (caption: string) => ReturnType;
      uploadImage: (file: File) => ReturnType;
    };
  }
}

const ImageView = ({ node, selected, updateAttributes, editor }: NodeViewProps) => {
  const { src, alt, title, width, align, caption: captionText } = node.attrs;
  const [resizing, setResizing] = useState(false);
  const [editingCaption, setEditingCaption] = useState(false);
  const [localCaption, setLocalCaption] = useState(captionText || "");
  const isLoading = src === "" || src === "placeholder";

  const handleMouseDown = useCallback(
    (direction: "left" | "right") => (e: React.MouseEvent) => {
      if (isLoading) return;
      e.preventDefault();
      e.stopPropagation();
      setResizing(true);

      const startX = e.clientX;
      const img = e.currentTarget.closest("figure")?.querySelector("img");
      const startWidth =
        node.attrs.width && node.attrs.width > 0
          ? node.attrs.width
          : img?.offsetWidth || 100;

      const handleMouseMove = (ev: MouseEvent) => {
        const diff = (ev.clientX - startX) * (direction === "right" ? 1 : -1) * 2;
        const newWidth = Math.max(50, Math.min(1000, startWidth + diff));
        updateAttributes({ width: newWidth });
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

  const imgWidth = width && width > 0 ? width : undefined;

  const handleCaptionBlur = useCallback(() => {
    setEditingCaption(false);
    if (localCaption !== captionText) {
      updateAttributes({ caption: localCaption });
    }
  }, [localCaption, captionText, updateAttributes]);

  const handleCaptionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCaptionBlur();
      }
      if (e.key === "Escape") {
        setLocalCaption(captionText);
        setEditingCaption(false);
      }
    },
    [handleCaptionBlur, captionText],
  );

  if (isLoading) {
    return (
      <NodeViewWrapper
        data-image-wrapper
        className="flex justify-center my-2"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Uploading...</span>
        </div>
      </NodeViewWrapper>
    );
  }

  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  return (
    <NodeViewWrapper
      data-image-wrapper
      contentEditable={false}
      className={cn("my-2 w-full", alignClass)}
    >
      <figure
        className={cn(
          "relative inline-block m-0 max-w-full group",
          selected && "ring-2 ring-ring ring-offset-2 rounded",
        )}
      >
        {selected && (
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 bg-background border rounded-md shadow-md p-1"
            contentEditable={false}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={cn(
                "h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors",
                align === "left" && "bg-accent text-accent-foreground",
              )}
              title="Align left"
              onClick={() => updateAttributes({ align: "left" })}
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={cn(
                "h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors",
                align === "center" && "bg-accent text-accent-foreground",
              )}
              title="Align center"
              onClick={() => updateAttributes({ align: "center" })}
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={cn(
                "h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors",
                align === "right" && "bg-accent text-accent-foreground",
              )}
              title="Align right"
              onClick={() => updateAttributes({ align: "right" })}
            >
              <AlignRight className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-border mx-0.5" />
            <button
              type="button"
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Replace image"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const src = ev.target?.result as string;
                    if (src) updateAttributes({ src });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={cn(
                "h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors",
                captionText && "bg-accent text-accent-foreground",
              )}
              title="Toggle caption"
              onClick={() => {
                if (captionText) {
                  updateAttributes({ caption: "" });
                } else {
                  setEditingCaption(true);
                }
              }}
            >
              <Type className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Download image"
              onClick={() => {
                const a = document.createElement("a");
                a.href = src;
                a.download = "image";
                a.click();
              }}
            >
              <Download className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-border mx-0.5" />
            <button
              type="button"
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-destructive hover:text-destructive-foreground transition-colors text-muted-foreground hover:text-destructive-foreground"
              title="Delete image"
              onClick={() => {
                const { tr } = editor.state;
                const { from } = editor.state.selection;
                const node = editor.state.doc.nodeAt(from);
                if (node && node.type.name === "image") {
                  editor.view.dispatch(tr.delete(from, from + node.nodeSize));
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          title={title}
          style={{ width: imgWidth }}
          className="max-w-full h-auto block"
          draggable={false}
        />
        <div
          onMouseDown={handleMouseDown("left")}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize opacity-0 transition-opacity",
            resizing && "opacity-100",
            "group-hover:opacity-100",
          )}
        >
          <div className="h-8 w-1 rounded-full bg-ring/60" />
        </div>
        <div
          onMouseDown={handleMouseDown("right")}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-ew-resize opacity-0 transition-opacity",
            resizing && "opacity-100",
            "group-hover:opacity-100",
          )}
        >
          <div className="h-8 w-1 rounded-full bg-ring/60" />
        </div>
        {(captionText || editingCaption) && (
          <figcaption
            className="text-sm text-muted-foreground mt-1 cursor-text"
            onClick={() => {
              if (!editingCaption && editor.isEditable) {
                setEditingCaption(true);
              }
            }}
          >
            {editingCaption ? (
              <input
                type="text"
                value={localCaption}
                onChange={(e) => setLocalCaption(e.target.value)}
                onBlur={handleCaptionBlur}
                onKeyDown={handleCaptionKeyDown}
                autoFocus
                className="w-full bg-transparent border-b border-border outline-none text-sm text-center"
                style={{ textAlign: "inherit" }}
                placeholder="Add a caption..."
              />
            ) : (
              captionText
            )}
          </figcaption>
        )}
      </figure>
    </NodeViewWrapper>
  );
};

const ImageExtension = Image.extend({
  name: "image",

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
        parseHTML: (element) => {
          const width = element.getAttribute("width");
          return width ? Number(width) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return { width: attributes.width };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => {
          const align = element.getAttribute("data-align");
          return (align as Align) || "center";
        },
        renderHTML: (attributes) => {
          if (!attributes.align || attributes.align === "center") {
            return {};
          }
          return { "data-align": attributes.align };
        },
      },
      caption: {
        default: "",
        parseHTML: () => "",
        renderHTML: () => ({}),
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlign:
        (align: Align) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;
          const node = selection.$from.nodeAfter;
          if (!node || node.type.name !== this.name) return false;

          if (dispatch) {
            tr.setNodeAttribute(selection.from, "align", align);
          }
          return true;
        },
      setImageCaption:
        (caption: string) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;
          const node = selection.$from.nodeAfter;
          if (!node || node.type.name !== this.name) return false;

          if (dispatch) {
            tr.setNodeAttribute(selection.from, "caption", caption);
          }
          return true;
        },
      setImage:
        (options) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;
          const node = selection.$from.nodeAfter;

          if (node && node.type.name === this.name) {
            if (dispatch) {
              tr.setNodeAttribute(selection.from, "src", options.src);
              if (options.alt !== undefined) {
                tr.setNodeAttribute(selection.from, "alt", options.alt);
              }
              if (options.title !== undefined) {
                tr.setNodeAttribute(selection.from, "title", options.title);
              }
            }
            return true;
          }

          const from = selection.from;
          const to = selection.to;

          if (dispatch) {
            const node = this.type.create({ ...options });
            tr.replaceRangeWith(from, to, node);
          }

          return true;
        },
      uploadImage:
        (file: File) =>
        ({ editor }) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Src = reader.result as string;
            if (!base64Src) return;

            // Insert placeholder image
            setTimeout(() => {
              (editor.commands as any).setImage({ src: base64Src });

              // After upload, find the image by base64 src and replace it
              uploadImage(file)
                .then((finalUrl) => {
                  if (!finalUrl) return;
                  setTimeout(() => {
                    const { doc } = editor.state;
                    let pos = -1;
                    doc.descendants((node, p) => {
                      if (node.type.name === "image" && node.attrs.src === base64Src) {
                        pos = p;
                        return false;
                      }
                    });
                    if (pos >= 0) {
                      editor.view.dispatch(
                        editor.state.tr.setNodeAttribute(pos, "src", finalUrl),
                      );
                    }
                  }, 0);
                })
                .catch(() => {
                  console.error("Image upload failed");
                });
            }, 0);
          };
          reader.readAsDataURL(file);

          return true;
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey("imagePasteDrop"),
        props: {
          handlePaste(_view, event) {
            const items = Array.from(event.clipboardData?.items || []);
            const imageFiles = items.filter(
              (item) => item.type.startsWith("image/"),
            );

            if (imageFiles.length === 0) return false;

            event.preventDefault();

            imageFiles.forEach((item) => {
              const file = item.getAsFile();
              if (!file) return;

              const reader = new FileReader();
              reader.onload = (e) => {
                const base64Src = e.target?.result as string;
                if (!base64Src) return;

                (editor.commands as any).setImage({ src: base64Src });

                uploadImage(file)
                  .then((finalUrl) => {
                    if (!finalUrl) return;
                    setTimeout(() => {
                      const { doc } = editor.state;
                      let pos = -1;
                      doc.descendants((node, p) => {
                        if (
                          node.type.name === "image" &&
                          node.attrs.src === base64Src
                        ) {
                          pos = p;
                          return false;
                        }
                      });
                      if (pos >= 0) {
                        editor.view.dispatch(
                          editor.state.tr.setNodeAttribute(pos, "src", finalUrl),
                        );
                      }
                    }, 0);
                  })
                  .catch(() => {
                    console.error("Image upload failed");
                  });
              };
              reader.readAsDataURL(file);
            });

            return true;
          },

          handleDrop(_view, event) {
            const files = Array.from(event.dataTransfer?.files || []);
            const imageFiles = files.filter((file) =>
              file.type.startsWith("image/"),
            );

            if (imageFiles.length === 0) return false;

            event.preventDefault();

            imageFiles.forEach((file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64Src = e.target?.result as string;
                if (!base64Src) return;

                (editor.commands as any).setImage({ src: base64Src });

                uploadImage(file)
                  .then((finalUrl) => {
                    if (!finalUrl) return;
                    setTimeout(() => {
                      const { doc } = editor.state;
                      let pos = -1;
                      doc.descendants((node, p) => {
                        if (
                          node.type.name === "image" &&
                          node.attrs.src === base64Src
                        ) {
                          pos = p;
                          return false;
                        }
                      });
                      if (pos >= 0) {
                        editor.view.dispatch(
                          editor.state.tr.setNodeAttribute(pos, "src", finalUrl),
                        );
                      }
                    }, 0);
                  })
                  .catch(() => {
                    console.error("Image upload failed");
                  });
              };
              reader.readAsDataURL(file);
            });

            return true;
          },
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export default ImageExtension;
