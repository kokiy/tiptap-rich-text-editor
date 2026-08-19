import { useMemo } from "react";
import { useEditor, EditorContent, type EditorOptions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import FindAndReplace from "@tiptap/extension-find-and-replace";
import Typography from "@tiptap/extension-typography";
import ImageExtension from "@/extensions/image/index";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { SlashMenu } from "@/components/editor/menus/slash-menu";
import { EditorBubbleMenu } from "@/components/editor/menus/bubble-menu";
import "./editor.css";

export interface EditorProps {
  initialContent?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
}

export function Editor({ initialContent, placeholder, onChange }: EditorProps) {
  const extensions = useMemo(
    () =>
      [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4],
          },
          orderedList: {
            HTMLAttributes: {
              class: "list-decimal",
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: "list-disc",
            },
          },
          link: {
            HTMLAttributes: {
              class:
                "text-blue-600 dark:text-blue-400 underline underline-offset-2",
            },
          },
        }),
        Placeholder.configure({
          emptyNodeClass: "is-editor-empty",
          placeholder: ({ node }) => {
            switch (node.type.name) {
              case "heading":
                return `Heading ${node.attrs.level}`;
              case "codeBlock":
                return "";
              default:
                return placeholder ?? "Write, type '/' for commands";
            }
          },
          includeChildren: false,
        }),
        Subscript,
        Superscript,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true,
        }),
        FindAndReplace,
        Typography,
        ImageExtension,
      ] as EditorOptions["extensions"],
    [placeholder],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: initialContent ?? "",
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="relative w-full overflow-hidden border bg-card text-card-foreground shadow-sm rounded-md">
      <EditorToolbar editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <SlashMenu editor={editor} />
      <div className="p-6">
        <EditorContent
          editor={editor}
          className="min-h-[500px] editor-content"
        />
      </div>
    </div>
  );
}
