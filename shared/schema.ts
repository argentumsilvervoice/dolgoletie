import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Subscribers / Users ────────────────────────────────────────────────────
export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  address: text("address"), // delivery address for print version
  subscriptionType: text("subscription_type").notNull().default("digital"), // "print" | "digital" | "both"
  subscriptionStatus: text("subscription_status").notNull().default("active"), // "active" | "cancelled" | "pending"
  createdAt: text("created_at").notNull(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// ─── Sessions ────────────────────────────────────────────────────────────────
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // random token
  subscriberId: integer("subscriber_id").notNull(),
  expiresAt: text("expires_at").notNull(),
});

export type Session = typeof sessions.$inferSelect;

// ─── Issues (журналы) ────────────────────────────────────────────────────────
export const issues = sqliteTable("issues", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  issueNumber: integer("issue_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  coverUrl: text("cover_url"),
  pdfUrl: text("pdf_url").notNull(), // link to downloadable PDF
  publishedAt: text("published_at").notNull(),
  month: text("month").notNull(), // e.g. "Февраль 2026"
});

export const insertIssueSchema = createInsertSchema(issues).omit({ id: true });
export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type Issue = typeof issues.$inferSelect;
