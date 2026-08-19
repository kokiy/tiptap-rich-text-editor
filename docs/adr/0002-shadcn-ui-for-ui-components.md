# shadcn/ui for UI Components

We use shadcn/ui as the source of UI primitives instead of a component
library like MUI or Chakra. shadcn/ui components are copy-pasted into
`src/components/ui/` and owned by the project, giving full control
over styling and behavior while maintaining consistent design. This
decision pairs naturally with Tailwind CSS, which shadcn/ui is built
on. The cost of switching is moderate — each component would need to
be reimplemented — but the primitives are isolated enough that
replacing them one at a time is feasible.
