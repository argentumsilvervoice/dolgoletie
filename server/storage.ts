import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { subscribers, sessions, issues } from "../shared/schema";
import type { Subscriber, InsertSubscriber, Session, Issue, InsertIssue } from "../shared/schema";
import crypto from "crypto";

const sqlite = new Database("dolgoletie.db");
const db = drizzle(sqlite);

// Initialize tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    subscription_type TEXT NOT NULL DEFAULT 'digital',
    subscription_status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    subscriber_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    pdf_url TEXT NOT NULL,
    published_at TEXT NOT NULL,
    month TEXT NOT NULL
  );
`);

// Seed demo issues if none exist
const existingIssues = db.select().from(issues).all();
if (existingIssues.length === 0) {
  const demoIssues = [
    { issueNumber: 10, title: "Эффективные точки при умственном напряжении", description: "Точечный массаж, ци-зарядка и питание для ясного ума", coverUrl: null, pdfUrl: "/demo/issue10.pdf", publishedAt: "2026-02-01", month: "Февраль 2026" },
    { issueNumber: 9, title: "Адаптивное питание по сезонам: Зима", description: "Рецепты и рекомендации для поддержания жизненной силы зимой", coverUrl: null, pdfUrl: "/demo/issue9.pdf", publishedAt: "2026-01-01", month: "Январь 2026" },
    { issueNumber: 8, title: "Техники долголетия: дыхательные практики", description: "Древние методы дыхания, проверенные современной наукой", coverUrl: null, pdfUrl: "/demo/issue8.pdf", publishedAt: "2025-12-01", month: "Декабрь 2025" },
    { issueNumber: 7, title: "Восстановление суставов без операций", description: "Рефлексотерапия, движение и питание для здоровья суставов", coverUrl: null, pdfUrl: "/demo/issue7.pdf", publishedAt: "2025-11-01", month: "Ноябрь 2025" },
    { issueNumber: 6, title: "Крепкий иммунитет круглый год", description: "Как укрепить защитные силы организма по системе Ци-доктора", coverUrl: null, pdfUrl: "/demo/issue6.pdf", publishedAt: "2025-10-01", month: "Октябрь 2025" },
    { issueNumber: 5, title: "Сон и восстановление: секреты глубокого отдыха", description: "Восточные практики и западная медицина о качественном сне", coverUrl: null, pdfUrl: "/demo/issue5.pdf", publishedAt: "2025-09-01", month: "Сентябрь 2025" },
  ];
  for (const issue of demoIssues) {
    db.insert(issues).values({ ...issue, publishedAt: issue.publishedAt, month: issue.month }).run();
  }
}

export interface IStorage {
  // Subscribers
  createSubscriber(data: InsertSubscriber & { passwordHash: string }): Subscriber;
  getSubscriberByEmail(email: string): Subscriber | undefined;
  getSubscriberById(id: number): Subscriber | undefined;
  updateSubscriberAddress(id: number, address: string): void;

  // Sessions
  createSession(subscriberId: number): string;
  getSession(token: string): Session | undefined;
  deleteSession(token: string): void;

  // Issues
  getAllIssues(): Issue[];
}

export class Storage implements IStorage {
  createSubscriber(data: InsertSubscriber & { passwordHash: string }): Subscriber {
    return db.insert(subscribers).values({
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      phone: data.phone ?? null,
      address: data.address ?? null,
      subscriptionType: data.subscriptionType ?? "digital",
      subscriptionStatus: "active",
      createdAt: new Date().toISOString(),
    }).returning().get();
  }

  getSubscriberByEmail(email: string): Subscriber | undefined {
    return db.select().from(subscribers).where(eq(subscribers.email, email)).get();
  }

  getSubscriberById(id: number): Subscriber | undefined {
    return db.select().from(subscribers).where(eq(subscribers.id, id)).get();
  }

  updateSubscriberAddress(id: number, address: string): void {
    db.update(subscribers).set({ address }).where(eq(subscribers.id, id)).run();
  }

  createSession(subscriberId: number): string {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    db.insert(sessions).values({ id: token, subscriberId, expiresAt }).run();
    return token;
  }

  getSession(token: string): Session | undefined {
    const session = db.select().from(sessions).where(eq(sessions.id, token)).get();
    if (!session) return undefined;
    if (new Date(session.expiresAt) < new Date()) {
      this.deleteSession(token);
      return undefined;
    }
    return session;
  }

  deleteSession(token: string): void {
    db.delete(sessions).where(eq(sessions.id, token)).run();
  }

  getAllIssues(): Issue[] {
    return db.select().from(issues).all().sort((a, b) => b.issueNumber - a.issueNumber);
  }
}

export const storage = new Storage();
