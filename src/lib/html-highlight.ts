// Simple HTML formatter + highlight.js import
// We'll format the HTML before highlighting
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("xml", xml);

export function formatHtml(html: string): string {
  // Simple indentation for HTML
  let indent = 0;
  const lines: string[] = [];
  // Split by tags while preserving them
  const tokens = html.split(/(<[^>]+>)/g).filter(Boolean);
  
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith("</")) {
      indent = Math.max(0, indent - 1);
      lines.push("  ".repeat(indent) + trimmed);
    } else if (trimmed.startsWith("<") && !trimmed.endsWith("/>") && !trimmed.startsWith("<!")) {
      // Check if it's a self-closing tag or contains text on same line
      lines.push("  ".repeat(indent) + trimmed);
      // Only increase indent if it's not self-closing and not a void element
      const tagName = trimmed.match(/<(\w+)/)?.[1]?.toLowerCase();
      const voidTags = ["br", "hr", "img", "input", "meta", "link", "area", "base", "col", "embed", "source", "track", "wbr"];
      if (tagName && !voidTags.includes(tagName) && !trimmed.endsWith("/>")) {
        indent++;
      }
    } else {
      lines.push("  ".repeat(indent) + trimmed);
    }
  }
  
  return lines.join("\n");
}

export function highlightHtml(html: string): string {
  const formatted = formatHtml(html);
  const result = hljs.highlight(formatted, { language: "xml" });
  return result.value;
}
