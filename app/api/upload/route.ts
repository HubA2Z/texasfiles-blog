import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const MAX = 4 * 1024 * 1024; // Vercel functions accept ~4.5 MB request bodies
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads are not set up yet. In Vercel, open Storage → create a Blob store and connect it to this project." },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  if (!TYPES.has(file.type)) return NextResponse.json({ error: "Please upload a JPG, PNG, WebP, GIF or AVIF image." }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Image is larger than 4 MB. Please resize it and try again." }, { status: 400 });

  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+/, "").slice(-60) || "image";
  try {
    const blob = await put(`articles/${safe}`, file, { access: "public", addRandomSuffix: true, contentType: file.type });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
