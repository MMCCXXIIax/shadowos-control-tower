# ShadowOS Control Tower Plan

## Product direction
A private operations dashboard for ShadowOS creator partnerships. The first release is a focused control tower, not a marketing website: it prioritizes creator pipeline visibility, evidence-led qualification, approval gates, and isolated creator workspaces.

## Design
Three candidate styles: **Signal Room** (0.07), a dark operator console with warm amber signals; **Field Ledger** (0.06), paper-and-ink editorial operations; **Quiet Command** (0.05), restrained monochrome with one electric accent. Choose **Signal Room**.

- **Design Movement:** Editorial control-room interface with a calm, evidence-first visual language.
- **Core Principles:** high signal-to-noise, persistent context, visible approval gates, and creator-specific separation.
- **Color Philosophy:** graphite and warm ivory create operational calm; amber marks decisions and attention; sage marks research-ready states.
- **Layout Paradigm:** persistent left rail plus wide evidence canvas, with compact status strips instead of card-heavy dashboards.
- **Signature Elements:** amber “signal” markers, creator ID monograms, and thin evidence rails.
- **Interaction Philosophy:** every action should expose the next state and the approval needed.
- **Animation:** subtle 150–220ms transitions only; no decorative motion.
- **Typography System:** Inter for UI and IBM Plex Mono for IDs, dates, and source labels.
- **Brand Essence:** ShadowOS is an evidence-led operating desk for creator partnerships; precise, quiet, decisive.
- **Brand Voice:** “Evidence before outreach.” “Show me the blocker, not the noise.”
- **Wordmark & Logo:** compact SO monogram inside a split square, with a small amber signal notch.
- **Signature Brand Color:** burnt amber #D9893D.

## Implementation approach
Use the initialized React/Express/tRPC/Drizzle project. Add a creator database table and a lightweight activity/outreach model. Seed the 31 PDF candidates as `discovery` records; never mark them verified. The UI uses server data when available and a safe seed fallback so the first view remains usable during database setup. Build the dashboard, priority queue, creator detail drawer/page, pipeline filters, and approval-state controls first.

## Project structure
- `drizzle/schema.ts`: users, creators, activity records, and outreach records.
- `server/db.ts`: creator and activity queries with database fallback behavior.
- `server/routers.ts`: dashboard, creator, and activity tRPC procedures.
- `client/src/pages/Home.tsx`: control-tower UI.
- `client/src/index.css`: Signal Room theme and layout primitives.
- `public/manus-routes.json`: declared routes.
