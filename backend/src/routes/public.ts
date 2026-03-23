import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { Router, type Request } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import {
  blogPosts,
  chamberBeliefs,
  chamberContent,
  chamberStats,
  contactSubmissions,
  contributorArticles,
  contributors,
  experiments,
  galleryItems,
  programs,
  siteContentEntries,
  supporters,
  teamMembers,
  volunteerSubmissions,
} from "../db/schema.js";
import { parseBooleanQuery, sendData, sendError } from "../utils/http.js";

const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  message: z.string().trim().min(1),
});

const volunteerSubmissionSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().optional().or(z.literal("")),
});

function parseKeysQuery(input: unknown): string[] {
  if (typeof input !== "string") {
    return [];
  }

  return input
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
}

function pathParam(req: Request, key: string): string {
  const value = req.params?.[key];
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return typeof value === "string" ? value : "";
}

export const publicRouter = Router();

publicRouter.get("/site-content", async (req, res) => {
  const keys = parseKeysQuery(req.query.keys);

  const rows =
    keys.length > 0
      ? await db
          .select({
            key: siteContentEntries.key,
            value: siteContentEntries.value,
          })
          .from(siteContentEntries)
          .where(inArray(siteContentEntries.key, keys))
      : await db
          .select({
            key: siteContentEntries.key,
            value: siteContentEntries.value,
          })
          .from(siteContentEntries);

  const contentMap = Object.fromEntries(rows.map((row) => [row.key, row.value ?? ""]));
  sendData(res, contentMap);
});

publicRouter.get("/blog-posts", async (req, res) => {
  const published = parseBooleanQuery(req.query.published);
  const filters: Array<ReturnType<typeof eq>> = [];

  if (published !== undefined) {
    filters.push(eq(blogPosts.published, published));
  }

  const rows = await db
    .select()
    .from(blogPosts)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(blogPosts.createdAt));

  sendData(res, rows);
});

publicRouter.get("/blog-posts/:slug", async (req, res) => {
  const slug = pathParam(req, "slug");
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
    .limit(1);

  if (!row) {
    sendError(res, 404, "NOT_FOUND", "Blog post not found.");
    return;
  }

  sendData(res, row);
});

publicRouter.get("/experiments", async (req, res) => {
  const published = parseBooleanQuery(req.query.published);
  const chamber = typeof req.query.chamber === "string" ? req.query.chamber : undefined;

  const filters: Array<ReturnType<typeof eq>> = [];
  if (published !== undefined) {
    filters.push(eq(experiments.published, published));
  }
  if (chamber) {
    filters.push(eq(experiments.chamber, chamber));
  }

  const rows = await db
    .select()
    .from(experiments)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(experiments.createdAt));

  sendData(res, rows);
});

publicRouter.get("/experiments/:slug", async (req, res) => {
  const slug = pathParam(req, "slug");
  const [row] = await db
    .select()
    .from(experiments)
    .where(and(eq(experiments.slug, slug), eq(experiments.published, true)))
    .limit(1);

  if (!row) {
    sendError(res, 404, "NOT_FOUND", "Experiment not found.");
    return;
  }

  sendData(res, row);
});

publicRouter.get("/chambers/ii", async (_req, res) => {
  const [stats, beliefs] = await Promise.all([
    db
      .select()
      .from(chamberStats)
      .where(eq(chamberStats.chamber, "ii"))
      .orderBy(asc(chamberStats.orderIndex)),
    db
      .select()
      .from(chamberBeliefs)
      .where(eq(chamberBeliefs.chamber, "ii"))
      .orderBy(asc(chamberBeliefs.orderIndex)),
  ]);

  sendData(res, {
    stats,
    beliefs,
  });
});

publicRouter.get("/chambers/iii/content", async (_req, res) => {
  const rows = await db
    .select()
    .from(chamberContent)
    .where(eq(chamberContent.chamber, "iii"))
    .orderBy(asc(chamberContent.section));

  sendData(res, rows);
});

publicRouter.get("/programs", async (_req, res) => {
  const rows = await db.select().from(programs).orderBy(asc(programs.orderIndex));
  sendData(res, rows);
});

publicRouter.get("/contributors", async (_req, res) => {
  const rows = await db.select().from(contributors).orderBy(desc(contributors.createdAt));
  sendData(res, rows);
});

publicRouter.get("/contributors/:id", async (req, res) => {
  const contributorId = pathParam(req, "id");

  const [contributor, articles] = await Promise.all([
    db
      .select()
      .from(contributors)
      .where(eq(contributors.id, contributorId))
      .limit(1),
    db
      .select()
      .from(contributorArticles)
      .where(eq(contributorArticles.contributorId, contributorId))
      .orderBy(desc(contributorArticles.createdAt)),
  ]);

  const [row] = contributor;
  if (!row) {
    sendError(res, 404, "NOT_FOUND", "Contributor not found.");
    return;
  }

  sendData(res, {
    contributor: row,
    articles,
  });
});

publicRouter.get("/team", async (_req, res) => {
  const [team, collaborators, latestContributors, supporterRows] = await Promise.all([
    db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.memberType, "team"))
      .orderBy(asc(teamMembers.orderIndex)),
    db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.memberType, "collaborator"))
      .orderBy(asc(teamMembers.orderIndex)),
    db.select().from(contributors).orderBy(desc(contributors.createdAt)).limit(6),
    db.select().from(supporters).orderBy(asc(supporters.orderIndex)),
  ]);

  sendData(res, {
    teamMembers: team,
    collaborators,
    contributors: latestContributors,
    supporters: supporterRows,
  });
});

publicRouter.get("/gallery", async (_req, res) => {
  const [items, featuredRows] = await Promise.all([
    db.select().from(galleryItems).orderBy(asc(galleryItems.orderIndex)),
    db.select().from(galleryItems).where(eq(galleryItems.featured, true)).limit(1),
  ]);

  const [featuredItem] = featuredRows;

  sendData(res, {
    items,
    featuredItem: featuredItem ?? null,
  });
});

publicRouter.post("/contact-submissions", async (req, res) => {
  const parsed = contactSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Name, email, and message are required.");
    return;
  }

  const [created] = await db
    .insert(contactSubmissions)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    })
    .returning();

  sendData(res, created, 201);
});

publicRouter.post("/volunteer-submissions", async (req, res) => {
  const parsed = volunteerSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Name and email are required.");
    return;
  }

  const [created] = await db
    .insert(volunteerSubmissions)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp?.trim() ? parsed.data.whatsapp : null,
      status: "pending",
    })
    .returning();

  sendData(res, created, 201);
});
