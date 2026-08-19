# No Global State Management

We deliberately avoid introducing a global state management library
(Zustand, Jotai, Redux, etc.) at this stage. Document state is managed
entirely by TipTap's internal ProseMirror state. UI state (toolbar
mode, theme, etc.) is either local to components or managed through
React context where needed. We will revisit this decision if UI state
crosses more than 3-4 component layers or if we see repeated prop
drilling pain.
