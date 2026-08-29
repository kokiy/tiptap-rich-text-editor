import { useState, useMemo } from "react";
import { highlightHtml } from "@/lib/html-highlight";
import "highlight.js/styles/github-dark.css";
import { Editor } from "@/components/editor/editor";
import { ThemeToggle } from "@/components/theme-toggle";

const initialContent = `
<h1>Welcome to the Editor 🎉</h1>
<p>This is a <strong>rich text editor</strong> built with TipTap and shadcn/ui.</p>
<p>Try typing, formatting text, or using the toolbar above.</p>
<ul>
  <li>Bold, italic, underline</li>
  <li>Headings, lists, quotes</li>
  <li>Links, images, code</li>
</ul>
<blockquote>Press "/" to open the command menu.</blockquote>
<p>Have fun editing! 🎉</p>
`;

function App() {
  const [content, setContent] = useState(initialContent);

  const highlightedHtml = useMemo(() => highlightHtml(content.trim()), [content]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Editor</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="w-full px-4 md:px-8 py-6">
        <Editor
          initialContent={content}
          onChange={setContent}
          placeholder="Start typing..."
        />
        <div className="mt-6">
          <details>
            <summary className="cursor-pointer text-sm text-muted-foreground">
              View HTML output
            </summary>
            <pre className="mt-2 p-4 rounded-md overflow-x-auto text-xs [&_code]:bg-transparent">
              <code
                className="language-xml hljs"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            </pre>
          </details>
        </div>
      </main>
    </div>
  );
}

export default App;
