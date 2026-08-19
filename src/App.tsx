import { useState } from "react";
import { Editor } from "@/components/editor/editor";
import { ThemeToggle } from "@/components/theme-toggle";

const initialContent = `
<h2>Welcome to Koki Rich Text Editor 👋</h2>
<p>This is a modern rich text editor built with <strong>TipTap</strong>, <strong>React</strong>, and <strong>shadcn/ui</strong>.</p>
<p>Try out the features:</p>
<ul>
  <li><strong>Bold</strong>, <em>italic</em>, <u>underline</u>, and <s>strikethrough</s></li>
  <li>Headings, lists, blockquotes, and code blocks</li>
  <li>Text color and highlight</li>
  <li>Text alignment</li>
  <li>Links and images</li>
  <li>Find and replace</li>
</ul>
<blockquote>
  <p>Select some text and use the toolbar to format it.</p>
</blockquote>
<p>Have fun editing! 🎉</p>
`;

function App() {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Koki Rich Text Editor</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        <Editor
          initialContent={content}
          onChange={setContent}
          placeholder="Start typing..."
        />
        <div className="mt-6">
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              View HTML output
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-md overflow-x-auto text-xs">
              <code>{content}</code>
            </pre>
          </details>
        </div>
      </main>
    </div>
  );
}

export default App;
