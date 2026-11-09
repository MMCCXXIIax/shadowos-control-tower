---
name: dashboard-hierarchy
description: >-
  Enforces SaaS dashboard anatomy for ShadowOS: KPI row, 8/4 scanning grid,
  table hierarchy, and desaturated status. Use when building or editing
  dashboard views, metrics, tables, or charts.
---

# Dashboard hierarchy

Read [visual-hierarchy.md](visual-hierarchy.md) first. These rules decide how a dashboard is arranged.

## Scanning grid

- KPI cards sit at the top of the canvas, before banners and section essays. Use a 4-column grid on desktop and 2 columns below 1100px.
- The primary surface (the queue or the main chart) spans 8 of 12 columns, about 66% of the width. The supporting pane spans 4 of 12 columns.
- Global actions — search, notifications, and the single primary button — stay in the top-right header. Content actions stay inside the pane they affect. Do not place a second primary button beside the page title.

## KPI cards

Order inside every metric card:

1. Label: 12px, muted, top left.
2. Value: 32px, bold, full contrast. No icon inside the number.
3. Context: 12px, muted, under the value. A percent trend may use a desaturated green or red. Amber is not a trend color.

If an icon is used, mute it and pin it to the top-right corner of the card.

## Tables and lists

- Header: uppercase, 12px, semibold, tracking 0.08em, muted.
- Row: 14px, regular, separated by a 1px bottom border. No zebra stripes.
- Only the identifier (name) is semibold. Niche, status, and score stay regular.
- Selection is a quiet background shift plus the existing accent inset. Do not fill the row with the accent.

## Cognitive load

- One canvas color. Widgets are borders and radius, not new background colors.
- Status badges use a desaturated tint with darker text. Reserve a solid destructive badge for a critical error.
- One accent button per view.
