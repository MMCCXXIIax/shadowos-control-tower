# ShadowOS Control Tower TODO

## Dashboard shell
- [x] Provide a private-feeling ShadowOS control-tower layout with persistent navigation, live pipeline summary, approval queue, and next-action visibility.
- [x] Keep the interface focused on creator operations rather than generic dashboard decoration.
- [x] Apply an original Signal Room visual system informed by Linkme’s identity-led organization and Whop’s disciplined product surfaces without copying either.

## Live data connection
- [x] Connect the dashboard’s creator queue to the remaining Supabase project `bklrf…` through protected runtime secrets.
- [x] Create secured `shadowos_creators` and `shadowos_activity` tables with row-level security and read-only application policies.
- [x] Seed the 31 creators from `Roberscreators.pdf` as discovery candidates only.
- [x] Show the active data source in the interface and retain a local fallback only for service resilience.

## Creator pipeline
- [x] Store creator records with permanent creator IDs, Instagram handle, profile URL, industry, sub-niche, geography, follower evidence, qualification score, confidence, stage, and research status.
- [x] Support filtering by stage and search text.
- [x] Provide a creator directory view and return each record to its creator workspace.

## Functional workspaces
- [x] Make Overview, Creators, Approvals, Outreach, Products, Whop revenue, and Reports real navigation states rather than decorative sidebar buttons.
- [x] Make primary overview actions open the relevant creator workspace.
- [ ] Add persistent creator detail routes and evidence records.
- [ ] Add screening forms and controlled stage transitions.
- [ ] Add outreach drafts, approval mutations, send logs, reply capture, and follow-up scheduling.
- [ ] Add product hypotheses, launch materials, and creator-specific marketing workspaces.
- [ ] Add Whop product and transaction attribution imports.

## Validation and delivery
- [x] Run type checks and production build.
- [x] Start preview and verify the dashboard loads.
- [x] Verify the live Supabase creator and source endpoints.
- [x] Save the next checkpoint after the final logo metadata is applied.
