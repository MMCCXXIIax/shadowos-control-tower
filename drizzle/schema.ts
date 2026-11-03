import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const creators = mysqlTable("creators", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: varchar("creatorId", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  handle: varchar("handle", { length: 120 }).notNull(),
  profileUrl: varchar("profileUrl", { length: 500 }).notNull(),
  industry: varchar("industry", { length: 120 }).notNull(),
  subNiche: varchar("subNiche", { length: 180 }),
  geography: varchar("geography", { length: 120 }),
  followerEvidence: varchar("followerEvidence", { length: 120 }),
  stage: mysqlEnum("stage", ["discovery", "screening", "qualified", "outreach", "replied", "partnership", "product", "launch", "live", "archived"]).default("discovery").notNull(),
  qualificationScore: int("qualificationScore").default(0).notNull(),
  confidence: mysqlEnum("confidence", ["high", "medium", "low", "unknown"]).default("unknown").notNull(),
  researchStatus: mysqlEnum("researchStatus", ["unverified", "profile_verified", "deep_research", "audit_complete"]).default("unverified").notNull(),
  approvalStatus: mysqlEnum("approvalStatus", ["not_ready", "needs_review", "approved", "paused"]).default("not_ready").notNull(),
  tags: text("tags"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const activity = mysqlTable("activity", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: varchar("creatorId", { length: 32 }).notNull(),
  type: varchar("type", { length: 60 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  detail: text("detail"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Creator = typeof creators.$inferSelect;
export type InsertCreator = typeof creators.$inferInsert;
export type Activity = typeof activity.$inferSelect;
export type InsertActivity = typeof activity.$inferInsert;
