import type { Express } from "express";
import type { Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  subscriptionType: z.enum(["print", "digital", "both"]).default("digital"),
  address: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function getToken(req: any): string | undefined {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return undefined;
}

export function registerRoutes(httpServer: Server, app: Express) {
  // ─── Auth ────────────────────────────────────────────────────────────────
  app.post("/api/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Неверные данные", details: parsed.error.flatten() });

    const { name, email, password, phone, subscriptionType, address } = parsed.data;
    const existing = storage.getSubscriberByEmail(email);
    if (existing) return res.status(409).json({ error: "Email уже зарегистрирован" });

    const passwordHash = await bcrypt.hash(password, 10);
    const subscriber = storage.createSubscriber({ name, email, passwordHash, phone, subscriptionType, address });
    const token = storage.createSession(subscriber.id);

    res.json({ token, subscriber: safeSubscriber(subscriber) });
  });

  app.post("/api/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Неверные данные" });

    const { email, password } = parsed.data;
    const subscriber = storage.getSubscriberByEmail(email);
    if (!subscriber) return res.status(401).json({ error: "Неверный email или пароль" });

    const valid = await bcrypt.compare(password, subscriber.passwordHash);
    if (!valid) return res.status(401).json({ error: "Неверный email или пароль" });

    const token = storage.createSession(subscriber.id);
    res.json({ token, subscriber: safeSubscriber(subscriber) });
  });

  app.post("/api/logout", (req, res) => {
    const token = getToken(req);
    if (token) storage.deleteSession(token);
    res.json({ ok: true });
  });

  app.get("/api/me", (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: "Не авторизован" });
    const session = storage.getSession(token);
    if (!session) return res.status(401).json({ error: "Сессия истекла" });
    const subscriber = storage.getSubscriberById(session.subscriberId);
    if (!subscriber) return res.status(401).json({ error: "Пользователь не найден" });
    res.json({ subscriber: safeSubscriber(subscriber) });
  });

  app.put("/api/me/address", (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: "Не авторизован" });
    const session = storage.getSession(token);
    if (!session) return res.status(401).json({ error: "Сессия истекла" });

    const { address } = req.body;
    if (!address || typeof address !== "string") return res.status(400).json({ error: "Укажите адрес" });
    storage.updateSubscriberAddress(session.subscriberId, address);
    res.json({ ok: true });
  });

  // ─── Issues ──────────────────────────────────────────────────────────────
  app.get("/api/issues", (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: "Только для подписчиков" });
    const session = storage.getSession(token);
    if (!session) return res.status(401).json({ error: "Сессия истекла" });

    const allIssues = storage.getAllIssues();
    res.json({ issues: allIssues });
  });

  // Public: teaser issues list (no pdf urls)
  app.get("/api/issues/preview", (_req, res) => {
    const allIssues = storage.getAllIssues().slice(0, 3).map(({ pdfUrl, ...rest }) => rest);
    res.json({ issues: allIssues });
  });
}

function safeSubscriber(s: any) {
  const { passwordHash, ...safe } = s;
  return safe;
}
