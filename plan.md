# ShadowOS Control Tower Plan

## Product direction
A private operations dashboard for ShadowOS creator partnerships. The first release is a focused control tower, not a marketing website: it prioritizes creator pipeline visibility, evidence-led qualification, approval gates, and isolated creator workspaces.

## Design
Three candidate styles: **Signal Room** (0.07), a dark operator console with warm amber signals; **Field Ledger** (0.06), paper-and-ink editorial operations; **Quiet Command** (0.05), restrained monochrome with one electric accent. Choose **Signal Room**.

The visual reference is the product discipline of Whop and the identity-rich, mobile-aware organization of Linkme, without copying either product. ShadowOS uses its own operator vocabulary: deep moss navigation, warm paper surfaces, amber decision signals, and compact evidence rails.

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

## Live data boundary
Supabase project `bklrfjnqbyyntlhmprkp` is the live source for creator, activity, evidence, and screening reads/writes. The `shadowos_creators`, `shadowos_activity`, `shadowos_creator_evidence`, and `shadowos_creator_screenings` tables use row-level security for the application’s publishable key. Phase 1 persists research evidence and qualification decisions while leaving unverified creators blocked from outreach. The server prefers Supabase and falls back to the local managed database only when Supabase is unavailable. The UI reports the active source instead of silently hiding a connection failure.

## Implementation approach
Use the initialized React/Express/tRPC/Drizzle project. Add creator intelligence, outreach, product, and revenue models as isolated Supabase tables keyed by permanent creator IDs. Seed the 31 PDF candidates as `discovery` records; never mark them verified. The UI uses live Supabase records when configured and a safe local fallback so the first view remains usable during an outage. Outreach drafts are creator-specific and approval-gated; drafting and manual status logging never send an external message. The canonical repository is the private GitHub repository `MMCCXXIIax/shadowos-control-tower`.

## Project structure
- `drizzle/schema.ts`: users, creators, activity records, and local resilience tables.
- `server/supabase.ts`: read-only live Supabase adapter and field normalization.
- `server/db.ts`: live-first creator/activity queries with local fallback behavior.
- `server/routers.ts`: dashboard, creator, activity, and data-source tRPC procedures.
- `client/src/pages/Home.tsx`: control-tower UI.
- `client/src/index.css`: Signal Room theme and layout primitives.
- `public/manus-routes.json`: declared routes.
