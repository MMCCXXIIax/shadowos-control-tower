import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getCreator, getCreatorSource, listActivity, listCreators } from "./db";

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
    source: publicProcedure.query(async () => ({ label: await getCreatorSource() })),
  }),
});

export type AppRouter = typeof appRouter;
