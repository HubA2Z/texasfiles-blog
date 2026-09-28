"use server";

import { ensureSchema, hasDatabase, sql } from "@/lib/db";

export type ContactState = { ok: boolean; message: string; values?: { name: string; email: string; body: string } } | null;

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: bots fill every field, humans never see this one.
  if (String(form.get("website") || "")) return { ok: true, message: "Thanks — your story was received." };

  const name = String(form.get("name") || "").trim().slice(0, 120);
  const email = String(form.get("email") || "").trim().slice(0, 200);
  const body = String(form.get("body") || "").trim().slice(0, 5000);

  if (!name || !email || !body) return { ok: false, values: { name, email, body }, message: "Please fill in all fields." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, values: { name, email, body }, message: "Please enter a valid email address." };
  if (!hasDatabase) return { ok: false, values: { name, email, body }, message: "The form isn't available right now. Please email us instead." };

  try {
    await ensureSchema();
    const [{ recent }] = await sql<{ recent: number }[]>`
      SELECT count(*)::int AS recent FROM messages WHERE email = ${email} AND created_at > now() - interval '1 hour'`;
    if (recent >= 3) return { ok: false, values: { name, email, body }, message: "You've sent several messages recently. Please try again later." };
    await sql`INSERT INTO messages (name, email, body) VALUES (${name}, ${email}, ${body})`;
    return { ok: true, message: "Thank you — your story was received. Our team reads every submission." };
  } catch (e) {
    console.error(e);
    return { ok: false, values: { name, email, body }, message: "Something went wrong. Please try again or email us." };
  }
}
