---
name: frontend-design
description: >-
  Designs and edits ShadowOS Control Tower UI with production-grade layout,
  typography, color, and component states. Use when changing pages, layout,
  CSS, Tailwind, shadcn/ui, dashboards, screens, spacing, or visual design,
  and whenever the user says the interface looks generic, AI-generated, or
  unfinished.
---

# ShadowOS frontend design

Stack: React 19, Vite, Tailwind CSS 4, shadcn/ui `new-york` (Radix, CSS variables, neutral base), Lucide, wouter. Components live in `client/src/components/ui`. Tokens and the desk shell live in `client/src/index.css`. Theme toggles the `dark` class. Dark is the default.

This is an operating desk for creator partnerships, not a marketing site. Every screen has one job, one primary surface, and one next action.

## Before editing

1. Read the current shell in `client/src/index.css` and the page you are changing.
2. Reuse shadcn components. Add a missing one with the shadcn CLI only when the project skill says to. Do not add daisyUI, a second component kit, or a new font.
3. Keep Navy + Amber. Do not invent a new palette.

Typography, color ratio, spacing, and surfaces are defined in [visual-hierarchy.md](../visual-hierarchy.md). Dashboard anatomy is defined in [dashboard-hierarchy.md](../dashboard-hierarchy.md). Those files win when they conflict with an older habit in this skill.

## Layout composition

- Build the frame first: fixed left rail, sticky top bar, one scrolling canvas. The rail does not grow with the page.
- Overview is a 4-column KPI row, then an 8/4 grid: queue on the left, record on the right. Stack the record under the queue below 1100px. Do not hide it.
- Keep the page title on one line. Search, notifications, and the one primary action sit in the top-right header.
- Below 760px, the rail is off-canvas with an explicit open and close control.

## Typography

- UI text is Inter. IDs, counts, timestamps, and source labels are IBM Plex Mono. Do not add another family, and do not fall back to Arial, system-ui, or a decorative display face.
- Use the scale in visual-hierarchy.md. Body line-height is 1.5 to 1.6.
- Numbers in a table are tabular and right-aligned when they are amounts or scores.

## Color

- Use the semantic tokens already defined: `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, `--destructive`, plus the desk aliases `--void`, `--ink`, `--ash`, `--hairline`, `--mute`, `--ember`, `--spark`.
- Amber `#D97706` is the only decision color. Cyan `#5BC0DE` marks secondary data. Navy `#0B132B` / `#1C2541` is the dark field. Beige `#F4D6B0` is the light field and the dark-mode text.
- Dark mode is the default and must stay readable: beige text on navy, amber buttons with navy text, borders at `#3A506B`. Light mode inverts the field, not the meaning of amber.
- No purple, no blue-violet, no gradients, no glass, no glow, no colored shadows.
- Contrast is intentional. Muted text is for meta only. A label that must be read uses `--foreground`.
- Do not color an entire row to show selection. Use a hairline and a quiet background shift.

## Component states

- Hover: background or border change only. No scale, no translate, no shadow bloom.
- Focus: 2px amber ring at 22% opacity, visible on keyboard focus. Do not remove outlines without replacing them.
- Active: the selected nav item and the selected table row share one treatment. Do not invent a second selected style.
- Disabled: 40% opacity, `cursor: not-allowed`, no hover change. A disabled button still explains why in adjacent copy when the reason is not obvious.
- Loading: keep the current label and append a pending state on the control that was used (`Saving…`). Do not replace the page with a skeleton.
- Error: one toast or one inline message naming what failed. Do not paint the whole page red.

## What not to generate

- KPI rows repeated inside every nested section. The overview owns the KPI row.
- Cards nested inside cards.
- Gradient text, blob backgrounds, or "AI" sparkle decoration.
- Placeholder pages named Page 1 / Page 2.
- A new visual language beside the desk classes already in `index.css`.
