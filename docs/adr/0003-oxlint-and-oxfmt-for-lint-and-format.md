# oxlint + oxfmt for Lint and Format

We use oxlint for linting and oxfmt for formatting instead of ESLint +
Prettier or Biome. Both tools are part of the OXC (Oxidation Compiler)
project, written in Rust, and significantly faster than their JS-based
counterparts. We considered Biome (which combines lint and format in
one tool) but chose the OXC pair because the user explicitly requested
oxlint and the ecosystem has matured enough to support both linting
and formatting natively.
