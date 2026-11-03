import { creators } from "../drizzle/schema";
import { getDb } from "../server/db";

const rows = [
  ["Ornagarden Kick", "onagardenkick"], ["Quarter Acre Roots", "quarteracreroots"], ["Michelle", "everydaygardeningtips"], ["Tyler & Brian", "gardenerinlove"], ["Alison", "cookseyfarms"], ["Inna", "gardens_better_with_cats"], ["Timothy Hammond", "bigcitygardener"], ["Milan Turner", "atlgrow"], ["Meenakshi", "meditativegardening"], ["Helier", "garden_goddess_uk"], ["Jo Thompson", "jothompsongarden"], ["Katie Townsend", "katietownsendgardendesign"], ["Joanna Archer Garden Design", "joannaarchergardendesign"], ["Kamili Bell Hill", "plantblerd"], ["Kaylee Ellen", "kayleeellenofficial"], ["Ashley Anita", "lifewithashleyanita"], ["Amy", "thehobbyhomestead"], ["Gardening Indoors", "_gardeningindoors"], ["Gardenerd", "gardenerd1"], ["Cloud Gardener", "cloudgardeneruk"], ["Kath Irvine", "edible.backyard"], ["Carly", "thegardenspot"], ["Tony", "tonygrowsfood"], ["Beth", "filipinafarmstead"], ["Dominika", "17m2garden"], ["Divya Kanwar", "indiangreendreams"], ["Kia Jade", "kia_urbangardener"], ["Peter Vouthas", "urbancitygardener"], ["Jill Mc Sheehy", "thebeginnersgarden"], ["Adam Long", "itsanadamadventure"], ["Front Porch", "frontporchfarmer"],
] as const;

const db = await getDb();
if (!db) throw new Error("DATABASE_URL is not available");
for (const [index, [name, handle]] of rows.entries()) {
  await db.insert(creators).values({
    creatorId: `SO-${String(index + 1).padStart(4, "0")}`,
    name,
    handle,
    profileUrl: `https://www.instagram.com/${handle}/`,
    industry: "Gardening",
    subNiche: index % 3 === 0 ? "Urban food growing" : index % 3 === 1 ? "Homesteading & edible gardens" : "Garden design & education",
    stage: "discovery",
    researchStatus: "unverified",
    confidence: "unknown",
    approvalStatus: "not_ready",
    qualificationScore: 0,
    tags: "priority-shortlist, imported-pdf",
    notes: "Imported from Roberscreators.pdf. Discovery candidate only; no research assumptions made.",
  }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
}
console.log(`Seeded ${rows.length} priority creators.`);
