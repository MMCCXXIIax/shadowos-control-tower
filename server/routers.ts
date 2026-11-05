import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { addEvidence, getCreator, getCreatorSource, getScreening, listActivity, listCreators, listEvidence, saveScreening } from "./db";
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
    source: publicProcedure.query(async () => ({ label: await getCreatorSource() })),
  }),
});

export type AppRouter = typeof appRouter;
