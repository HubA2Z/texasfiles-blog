import "server-only";
import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "crypto";
import { ensureSchema, sql } from "./db";

export const SESSION_COOKIE = "tf_session";
const SESSION_DAYS = 7;

function secretKey() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (at least 32 characters)");
  return new TextEncoder().encode(s);
}

export async function createSession(email: string) {
  const token = await new SignJWT({ sub: email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function verifyToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin" && typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getAdmin(): Promise<string | null> {
  return verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin server action / route handler. */
export async function requireAdmin(): Promise<string> {
  const email = await getAdmin();
  if (!email) throw new Error("Unauthorized");
  return email;
}

function safeEqual(a: string, b: string) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
}

const MAX_FAILS = 5;
const WINDOW_MIN = 15;

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function checkCredentials(email: string, password: string): Promise<LoginResult> {
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;
  if (!adminEmail || (!hash && !plain)) {
    return { ok: false, error: "Admin login is not configured yet (set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel)." };
  }

  await ensureSchema();
  const ip = await clientIp();
  const [{ fails }] = await sql<{ fails: number }[]>`
    SELECT count(*)::int AS fails FROM login_attempts
    WHERE ip = ${ip} AND success = false AND created_at > now() - make_interval(mins => ${WINDOW_MIN})`;
  if (fails >= MAX_FAILS) {
    return { ok: false, error: `Too many failed attempts. Try again in ${WINDOW_MIN} minutes.` };
  }

  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail);
  let passOk = false;
  if (hash) passOk = await bcrypt.compare(password, hash);
  else if (plain) passOk = safeEqual(password, plain);

  const ok = emailOk && passOk;
  await sql`INSERT INTO login_attempts (ip, success) VALUES (${ip}, ${ok})`;
  await sql`DELETE FROM login_attempts WHERE created_at < now() - interval '2 days'`;
  return ok ? { ok: true } : { ok: false, error: "Incorrect email or password." };
}
