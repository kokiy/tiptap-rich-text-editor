import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import FindAndReplace, { FindAndReplacePluginKey } from "@tiptap/extension-find-and-replace";

function createEditor(content: string) {
  return new Editor({
    extensions: [
      StarterKit,
      FindAndReplace.configure({
        searchDebounceMs: 0,
      }),
    ],
    content,
  });
}

function getPluginState(editor: Editor) {
  return FindAndReplacePluginKey.getState(editor.state)!;
}

// Helper: manually replace current match (same logic as UI component)
function replaceCurrent(editor: Editor, replaceText: string) {
  const state = getPluginState(editor);
  if (state.currentIndex === null || state.currentIndex < 0) return false;
  const result = state.results[state.currentIndex];
  if (!result) return false;

  editor.chain()
    .focus()
    .setTextSelection({ from: result.from, to: result.to })
    .insertContent(replaceText)
    .run();
  return true;
}

// Helper: manually replace all matches (same logic as UI component)
function replaceAll(editor: Editor, replaceText: string, searchTerm: string) {
  const state = getPluginState(editor);
  if (state.results.length === 0) return false;

  const sorted = [...state.results].sort((a, b) => b.from - a.from);
  let tr = editor.state.tr;
  for (const result of sorted) {
    tr = tr.insertText(replaceText, result.from, result.to);
  }
  editor.view.dispatch(tr);
  editor.commands.setSearchTerm(searchTerm);
  return true;
}

describe("FindAndReplace extension", () => {
  let editor: Editor;

  beforeEach(() => {
    editor = createEditor("<p>hello world hello</p>");
  });

  afterEach(() => {
    editor.destroy();
  });

  it("initial state has no results", () => {
    const state = getPluginState(editor);
    expect(state.results.length).toBe(0);
    expect(state.currentIndex).toBeNull();
  });

  it("finds matches and reports correct count", () => {
    editor.commands.setSearchTerm("hello");
    const state = getPluginState(editor);
    expect(state.results.length).toBe(2);
    expect(state.currentIndex).toBe(0);
  });

  it("returns 0 results for non-matching term", () => {
    editor.commands.setSearchTerm("xyz");
    const state = getPluginState(editor);
    expect(state.results.length).toBe(0);
    expect(state.currentIndex).toBeNull();
  });

  it("navigates to next result with wrap-around", () => {
    editor.commands.setSearchTerm("hello");
    expect(getPluginState(editor).currentIndex).toBe(0);

    editor.commands.goToNextResult();
    expect(getPluginState(editor).currentIndex).toBe(1);

    editor.commands.goToNextResult();
    expect(getPluginState(editor).currentIndex).toBe(0);
  });

  it("navigates to previous result with wrap-around", () => {
    editor.commands.setSearchTerm("hello");
    expect(getPluginState(editor).currentIndex).toBe(0);

    editor.commands.goToPreviousResult();
    expect(getPluginState(editor).currentIndex).toBe(1);
  });

  it("case-insensitive search is the default", () => {
    editor.commands.setSearchTerm("HELLO");
    expect(getPluginState(editor).results.length).toBe(2);
  });

  it("case-sensitive search filters results", () => {
    editor.commands.setCaseSensitive(true);
    editor.commands.setSearchTerm("HELLO");
    expect(getPluginState(editor).results.length).toBe(0);

    editor.commands.setSearchTerm("hello");
    expect(getPluginState(editor).results.length).toBe(2);
  });

  it("replaces the current match (manual approach)", () => {
    editor.commands.setSearchTerm("hello");
    const replaced = replaceCurrent(editor, "hi");
    expect(replaced).toBe(true);

    const text = editor.state.doc.textContent;
    const helloCount = (text.match(/hello/g) || []).length;
    const hiCount = (text.match(/hi/g) || []).length;
    expect(helloCount).toBe(1);
    expect(hiCount).toBe(1);
  });

  it("replaces all matches (manual approach)", () => {
    editor.commands.setSearchTerm("hello");
    const replaced = replaceAll(editor, "hi", "hello");
    expect(replaced).toBe(true);

    const text = editor.state.doc.textContent;
    expect(text).toContain("hi");
    expect(text.match(/hello/g)).toBeNull();
  });
});
