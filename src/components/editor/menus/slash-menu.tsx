import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
  ImageIcon,
  Minus,
  Quote,
  CodeSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { FloatingMenu } from "@tiptap/react/menus";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/core";

interface CommandItemType {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string;
  command: (editor: Editor) => void;
  group: string;
}

type CommandGroupType = {
  group: string;
  items: Omit<CommandItemType, "group">[];
};

const groups: CommandGroupType[] = [
  {
    group: "Basic blocks",
    items: [
      {
        title: "Text",
        description: "Just start writing with plain text",
        icon: AlignLeft,
        keywords: "paragraph text",
        command: (editor) => editor.chain().focus().clearNodes().run(),
      },
      {
        title: "Heading 1",
        description: "Large section heading",
        icon: Heading1,
        keywords: "h1 title header",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: "Heading 2",
        description: "Medium section heading",
        icon: Heading2,
        keywords: "h2 subtitle",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: "Heading 3",
        description: "Small section heading",
        icon: Heading3,
        keywords: "h3 subheader",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: "Bullet List",
        description: "Create a simple bullet list",
        icon: List,
        keywords: "unordered ul bullets",
        command: (editor) =>
          editor.chain().focus().toggleBulletList().run(),
      },
      {
        title: "Numbered List",
        description: "Create an ordered list",
        icon: ListOrdered,
        keywords: "numbered ol",
        command: (editor) =>
          editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: "Code Block",
        description: "Capture code snippets",
        icon: Code2,
        keywords: "code snippet pre",
        command: (editor) =>
          editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        title: "Image",
        description: "Insert an image placeholder",
        icon: ImageIcon,
        keywords: "image picture photo",
        command: (editor) => editor.chain().focus().setImage({ src: "" }).run(),
      },
      {
        title: "Horizontal Rule",
        description: "Add a horizontal divider",
        icon: Minus,
        keywords: "horizontal rule divider",
        command: (editor) =>
          editor.chain().focus().setHorizontalRule().run(),
      },
    ],
  },
  {
    group: "Inline",
    items: [
      {
        title: "Quote",
        description: "Capture a quotation",
        icon: Quote,
        keywords: "blockquote cite",
        command: (editor) =>
          editor.chain().focus().toggleBlockquote().run(),
      },
      {
        title: "Code",
        description: "Inline code snippet",
        icon: CodeSquare,
        keywords: "code inline",
        command: (editor) => editor.chain().focus().toggleCode().run(),
      },
    ],
  },
  {
    group: "Alignment",
    items: [
      {
        title: "Align Left",
        description: "Align text to the left",
        icon: AlignLeft,
        keywords: "align left",
        command: (editor) =>
          editor.chain().focus().setTextAlign("left").run(),
      },
      {
        title: "Align Center",
        description: "Center align text",
        icon: AlignCenter,
        keywords: "align center",
        command: (editor) =>
          editor.chain().focus().setTextAlign("center").run(),
      },
      {
        title: "Align Right",
        description: "Align text to the right",
        icon: AlignRight,
        keywords: "align right",
        command: (editor) =>
          editor.chain().focus().setTextAlign("right").run(),
      },
    ],
  },
];

interface SlashMenuProps {
  editor: Editor;
}

export function SlashMenu({ editor }: SlashMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 150);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.title
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase()) ||
              item.description
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase()) ||
              item.keywords.toLowerCase().includes(debouncedSearch.toLowerCase()),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [debouncedSearch],
  );

  const flatFilteredItems = useMemo(
    () => filteredGroups.flatMap((g) => g.items),
    [filteredGroups],
  );

  const executeCommand = useCallback(
    (commandFn: (editor: Editor) => void) => {
      try {
        const { from } = editor.state.selection;
        const slashCommandLength = search.length + 1;

        editor
          .chain()
          .focus()
          .deleteRange({
            from: Math.max(0, from - slashCommandLength),
            to: from,
          })
          .run();

        commandFn(editor);
      } catch (error) {
        console.error("Error executing command:", error);
      } finally {
        setIsOpen(false);
        setSearch("");
        setSelectedIndex(0);
      }
    },
    [editor, search],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      const preventDefault = () => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };

      switch (e.key) {
        case "ArrowDown":
          preventDefault();
          setSelectedIndex((prev) =>
            prev < flatFilteredItems.length - 1 ? prev + 1 : 0,
          );
          break;

        case "ArrowUp":
          preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : flatFilteredItems.length - 1,
          );
          break;

        case "Enter":
          preventDefault();
          if (flatFilteredItems[selectedIndex]) {
            executeCommand(flatFilteredItems[selectedIndex].command);
          }
          break;

        case "Escape":
          preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [isOpen, selectedIndex, flatFilteredItems, executeCommand],
  );

  useEffect(() => {
    const dom = editor.view.dom;
    const handleEditorKeyDown = (e: Event) =>
      handleKeyDown(e as KeyboardEvent);

    dom.addEventListener("keydown", handleEditorKeyDown);
    return () =>
      dom.removeEventListener("keydown", handleEditorKeyDown);
  }, [handleKeyDown, editor]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <FloatingMenu
      editor={editor}
      pluginKey="slashMenu"
      shouldShow={({ state }) => {
        const { $from } = state.selection;
        if ($from.parent.type.name === "codeBlock") return false;

        const currentLineText = $from.parent.textBetween(
          0,
          $from.parentOffset,
          "\n",
          " ",
        );

        const isSlashCommand =
          currentLineText.startsWith("/") &&
          $from.parentOffset === currentLineText.length;

        if (!isSlashCommand) {
          if (isOpen) setIsOpen(false);
          return false;
        }

        const query = currentLineText.slice(1).trim();
        if (query !== search) setSearch(query);
        if (!isOpen) setIsOpen(true);
        return true;
      }}
      options={{
        placement: "bottom-start",
        offset: 8,
        flip: true,
        shift: true,
      }}
      className="z-50"
    >
      <Command
        className="w-72 overflow-hidden rounded-lg border bg-popover shadow-lg"
        filter={() => 1}
      >
        <ScrollArea className="max-h-[330px]">
          <CommandList>
            <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
              No results found
            </CommandEmpty>

            {filteredGroups.map((group, groupIndex) => (
              <CommandGroup
                key={`${group.group}-${groupIndex}`}
                heading={
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {group.group}
                  </div>
                }
              >
                {group.items.map((item, itemIndex) => {
                  const flatIndex =
                    filteredGroups
                      .slice(0, groupIndex)
                      .reduce((acc, g) => acc + g.items.length, 0) + itemIndex;
                  const ItemIcon = item.icon;

                  return (
                    <CommandItem
                      key={`${group.group}-${item.title}`}
                      value={`${group.group}-${item.title}`}
                      onSelect={() => executeCommand(item.command)}
                      className={cn(
                        "gap-3 cursor-pointer",
                        flatIndex === selectedIndex && "bg-accent",
                      )}
                      ref={(el) => {
                        itemRefs.current[flatIndex] = el;
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                      <kbd className="ml-auto flex h-5 items-center rounded bg-muted px-1.5 text-xs text-muted-foreground">
                        ↵
                      </kbd>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </ScrollArea>
      </Command>
    </FloatingMenu>
  );
}
