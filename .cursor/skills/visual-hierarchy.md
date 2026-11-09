---
name: visual-hierarchy
description: >-
  Enforces typography, the 60-30-10 color split, 8px spacing, and surface
  layering for ShadowOS. Use when editing layout, CSS, pages, components, or
  any visual UI.
---

# Visual hierarchy

Apply these rules to every ShadowOS screen. Stack is React, Vite, Tailwind 4, and shadcn/ui. Type stays Inter for UI and IBM Plex Mono for IDs and figures. Navy is the canvas. Amber is the 10% accent.

## Typographic scale

Never use a raw one-off size. Use this scale:

- Display: 36px or larger, tracking -0.02em, bold. Reserve for a single hero figure, not page titles.
- Heading: 24px, bold, tracking -0.02em.
- Subheading: 16px, medium, low-contrast color (`--mute`).
- Body: 14px, regular, line-height 1.5 to 1.6.
- Caption: 12px, muted.

Signal importance with weight as well as size. Titles are bold. Content is regular. A caption does not become important by turning amber.

## 60-30-10 color

- 60% dominant: one canvas. Dark mode is deep navy `#0B132B`. Light mode is the beige field `#F4D6B0`. Do not paint sections with extra background colors.
- 30% structure: text, borders, cards, and rails use `#1C2541`, `#3A506B`, and `#F4D6B0` as structure, not decoration.
- 10% accent: amber `#D97706` is reserved for the primary call to action, a critical notification, or the active state. Do not use it on icons, eyebrows, counts, or every badge.

No purple, no gradients, no glass, no glow.

## Compositional rhythm

Spacing is only 8, 16, 24, 32, 48, or 64. Do not use 4, 6, 10, 12, 14, 18, 20, or 28.

Keep related controls in one cluster. Separate major sections with at least 48px. Give the primary cluster more air than the secondary cluster.

## Surface intelligence

The canvas is one color. Separate regions with a 1px border at low contrast and `12px` radius, plus a shadow no heavier than `0 1px 2px rgba(11, 19, 43, 0.06)`. Do not stack a filled card inside a filled card.
