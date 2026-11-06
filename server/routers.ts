import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { addEvidence, createMarketingItem, createMarketingPlan, createOutreachDraft, createProductBrief, getCreator, getCreatorSource, getScreening, listActivity, listCreators, listEvidence, listFollowups, listMarketingItems, listMarketingPlans, listOutreachDrafts, listOutreachEvents, listProductBriefs, saveScreening, scheduleOutreachFollowup, updateMarketingItem, updateMarketingPlan, updateOutreachDraftStatus, updateProductBrief } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  dashboard: router({
    creators: publicProcedure.query(() => listCreators()),
    creator: publicProcedure.input((value: unknown) => String(value)).query(({ input }) => getCreator(input)),
    activity: publicProcedure.input((value: unknown) => String(value)).query(({ input }) => listActivity(input)),
    evidence: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1) }).parse(value)).query(({ input }) => listEvidence(input.creatorId)),
    screening: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1) }).parse(value)).query(({ input }) => getScreening(input.creatorId)),
    addEvidence: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1), evidenceType: z.enum(["profile", "content", "audience", "buying_signal", "offer", "risk", "note"]), title: z.string().min(2).max(180), sourceUrl: z.string().url().optional().or(z.literal("")), summary: z.string().min(5).max(5000), signal: z.enum(["positive", "neutral", "negative", "unknown"]), confidence: z.enum(["high", "medium", "low", "unknown"]) }).parse(value)).mutation(({ input }) => addEvidence({ ...input, sourceUrl: input.sourceUrl || null })),
    saveScreening: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1), audienceFit: z.number().int().min(0).max(25), buyingSignals: z.number().int().min(0).max(25), expertiseAuthority: z.number().int().min(0).max(25), partnershipReadiness: z.number().int().min(0).max(25), decision: z.enum(["in_review", "qualified", "hold", "reject"]), rationale: z.string().max(5000).nullable(), screenedAt: z.string().datetime().nullable() }).parse(value)).mutation(({ input }) => saveScreening(input)),
    outreachDrafts: publicProcedure.query(() => listOutreachDrafts()),
    outreachEvents: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().optional() }).parse(value ?? {})).query(({ input }) => listOutreachEvents(input.creatorId)),
    followups: publicProcedure.query(() => listFollowups()),
    createOutreachDraft: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1), channel: z.enum(["instagram", "email"]), subject: z.string().max(240).nullable(), body: z.string().min(20).max(10000), personalizationSummary: z.string().max(1000).nullable() }).parse(value)).mutation(({ input }) => createOutreachDraft(input)),
    updateOutreachDraftStatus: publicProcedure.input((value: unknown) => z.object({ id: z.number().int(), status: z.enum(["needs_review", "approved", "sent", "replied", "rejected", "archived"]), note: z.string().max(1000).nullable() }).parse(value)).mutation(({ input }) => updateOutreachDraftStatus(input)),
    scheduleFollowup: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1), draftId: z.number().int().nullable(), channel: z.enum(["instagram", "email"]), dueAt: z.string().datetime(), note: z.string().max(1000).nullable() }).parse(value)).mutation(({ input }) => scheduleOutreachFollowup(input)),
    productBriefs: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().optional() }).parse(value ?? {})).query(({ input }) => listProductBriefs(input.creatorId)),
    createProductBrief: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1), hypothesisNumber: z.number().int().min(1).max(4), productName: z.string().min(2).max(240), audienceProblem: z.string().min(10).max(5000), buyingSignal: z.string().max(5000).nullable(), transformation: z.string().min(10).max(5000), format: z.string().min(2).max(180), outline: z.string().min(20).max(10000), assetRequirements: z.string().max(5000).nullable(), visualDirection: z.string().max(5000).nullable(), launchNotes: z.string().max(5000).nullable() }).parse(value)).mutation(({ input }) => createProductBrief(input)),
    updateProductBrief: publicProcedure.input((value: unknown) => z.object({ id: z.number().int(), status: z.enum(["architected", "handed_off", "in_production", "submitted_for_review", "revision_requested", "approved", "archived"]).optional(), productionReport: z.string().max(20000).nullable().optional(), reviewNotes: z.string().max(10000).nullable().optional() }).parse(value)).mutation(({ input }) => updateProductBrief(input)),
    marketingPlans: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().optional() }).parse(value ?? {})).query(({ input }) => listMarketingPlans(input.creatorId)),
    marketingItems: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().optional() }).parse(value ?? {})).query(({ input }) => listMarketingItems(input.creatorId)),
    createMarketingPlan: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1), productBriefId: z.number().int().nullable(), campaignName: z.string().min(2).max(240), audienceSegment: z.string().min(10).max(5000), positioning: z.string().min(10).max(5000), offerAngle: z.string().min(10).max(5000), voiceNotes: z.string().max(5000).nullable(), preLaunchStrategy: z.string().min(20).max(10000), postLaunchStrategy: z.string().min(20).max(10000), assetChecklist: z.string().max(5000).nullable() }).parse(value)).mutation(({ input }) => createMarketingPlan(input)),
    updateMarketingPlan: publicProcedure.input((value: unknown) => z.object({ id: z.number().int(), status: z.enum(["needs_review", "approved", "active", "paused", "archived"]) }).parse(value)).mutation(({ input }) => updateMarketingPlan(input)),
    createMarketingItem: publicProcedure.input((value: unknown) => z.object({ creatorId: z.string().min(1), planId: z.number().int().nullable(), productBriefId: z.number().int().nullable(), phase: z.enum(["pre_launch", "launch", "post_launch"]), channel: z.enum(["instagram", "email", "whop", "community", "other"]), contentType: z.string().min(2).max(120), title: z.string().min(2).max(240), objective: z.string().min(10).max(5000), hook: z.string().max(2000).nullable(), body: z.string().max(10000).nullable(), callToAction: z.string().max(1000).nullable(), assetDirection: z.string().max(5000).nullable(), scheduledFor: z.string().datetime().nullable() }).parse(value)).mutation(({ input }) => createMarketingItem(input)),
    updateMarketingItem: publicProcedure.input((value: unknown) => z.object({ id: z.number().int(), status: z.enum(["needs_review", "approved", "ready", "published", "archived"]) }).parse(value)).mutation(({ input }) => updateMarketingItem(input)),
    source: publicProcedure.query(async () => ({ label: await getCreatorSource() })),
  }),
});

export type AppRouter = typeof appRouter;
