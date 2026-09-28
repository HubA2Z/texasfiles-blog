"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkCredentials, createSession, destroySession, requireAdmin } from "@/lib/auth";
import {
  adminCreatePost,
  adminDeletePost,
  adminUpdatePost,
  slugTaken,
  type PostInput,
} from "@/lib/posts";
import { cleanHtml, plainText } from "@/lib/sanitize";
import { RESERVED_SLUGS, slugify } from "@/lib/site";
import { sql } from "@/lib/db";

/* ---------------- auth ---------------- */

export type LoginState = { error: string; email?: string } | null;

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  let res;
  try {
    res = await checkCredentials(email, password);
  } catch (e) {
    console.error(e);
    return { error: "Login is unavailable — check that the database and SESSION_SECRET are configured.", email };
  }
  if (!res.ok) return { error: res.error, email };
  await createSession(email.trim().toLowerCase());
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- posts ---------------- */

export type SaveResult = { ok: true; id: number; slug: string; status: string } | { ok: false; error: string };

function revalidatePublic(...slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  for (const s of slugs) if (s) revalidatePath(`/${s}`);
}

export async function savePost(input: {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  seoTitle: string;
  status: "draft" | "published";
  publishedAt: string; // yyyy-mm-ddThh:mm (local) or ""
}): Promise<SaveResult> {
  await requireAdmin();

  const title = input.title.trim().slice(0, 200);
  if (!title) return { ok: false, error: "Please add a title." };

  const slug = slugify(input.slug || title);
  if (!slug) return { ok: false, error: "The URL slug can only contain letters, numbers and dashes." };
  if (RESERVED_SLUGS.has(slug)) return { ok: false, error: `“/${slug}” is reserved for a site page. Choose another URL.` };
  if (await slugTaken(slug, input.id)) return { ok: false, error: `Another article already uses “/${slug}”.` };

  const content = cleanHtml(input.content || "");
  const status = input.status === "published" ? "published" : "draft";
  if (status === "published" && !plainText(content)) return { ok: false, error: "Add some content before publishing." };

  let publishedAt: string | null = null;
  if (input.publishedAt) {
    const d = new Date(input.publishedAt);
    if (isNaN(+d)) return { ok: false, error: "Invalid publish date." };
    publishedAt = d.toISOString();
  } else if (status === "published") {
    publishedAt = new Date().toISOString();
  }

  const cover = input.coverImage.trim();
  if (cover && !/^https?:\/\//i.test(cover)) return { ok: false, error: "Cover image must be an https:// URL." };

  const data: PostInput = {
    slug,
    title,
    excerpt: (input.excerpt.trim() || plainText(content).slice(0, 160)).slice(0, 300),
    content,
    category: input.category.trim().slice(0, 60),
    coverImage: cover || null,
    coverAlt: input.coverAlt.trim().slice(0, 200) || null,
    seoTitle: input.seoTitle.trim().slice(0, 120) || null,
    status,
    publishedAt,
  };

  try {
    if (input.id) {
      const { oldSlug } = await adminUpdatePost(input.id, data);
      revalidatePublic(slug, oldSlug);
      return { ok: true, id: input.id, slug, status };
    }
    const id = await adminCreatePost(data);
    revalidatePublic(slug);
    return { ok: true, id, slug, status };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function deletePost(id: number) {
  await requireAdmin();
  const slug = await adminDeletePost(id);
  if (slug) revalidatePublic(slug);
  redirect("/admin");
}

/* ---------------- messages ---------------- */

export async function toggleMessageRead(id: number, isRead: boolean) {
  await requireAdmin();
  await sql`UPDATE messages SET is_read = ${isRead} WHERE id = ${id}`;
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  await sql`DELETE FROM messages WHERE id = ${id}`;
  revalidatePath("/admin/messages");
}
