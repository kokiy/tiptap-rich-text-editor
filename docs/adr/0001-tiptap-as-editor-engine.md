# TipTap as Editor Engine

We chose TipTap as the core editor engine over ProseMirror, Lexical,
and Slate. TipTap provides a well-designed extension API on top of
ProseMirror, a large ecosystem of official extensions, and first-class
React support. The alternative of using raw ProseMirror would require
building much more abstraction ourselves; Lexical has a smaller
ecosystem; Slate has weaker edge-case handling. This is a hard-to-reverse
decision because the extension API and data model permeate the entire
codebase.
