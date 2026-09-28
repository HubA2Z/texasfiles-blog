"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import type { Post } from "@/lib/posts";
import { savePost, deletePost } from "@/app/admin/actions";
import { slugify } from "@/lib/site";
import { pickImage, uploadImage } from "./upload";

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(+d - off).toISOString().slice(0, 16);
};

const inputCls = "mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink";

function Btn({ on, onClick, title, children, disabled }: { on?: boolean; onClick: () => void; title: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={on}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid h-8 min-w-8 place-items-center rounded-md px-1.5 text-sm transition-colors disabled:opacity-40 ${
        on ? "bg-ink text-white" : "text-ink-soft hover:bg-paper hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onImage, uploading }: { editor: Editor; onImage: () => void; uploading: boolean }) {
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove):", prev || "https://");
    if (url === null) return;
    if (!url.trim() || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };
  const c = () => editor.chain().focus();
  return (
    <div className="sticky top-14 z-20 flex flex-wrap items-center gap-0.5 border-b border-line bg-white/95 px-2 py-1.5 backdrop-blur">
      <Btn title="Heading" on={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}>H2</Btn>
      <Btn title="Subheading" on={editor.isActive("heading", { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}>H3</Btn>
      <Btn title="Paragraph" on={editor.isActive("paragraph")} onClick={() => c().setParagraph().run()}>¶</Btn>
      <span className="mx-1 h-5 w-px bg-line" />
      <Btn title="Bold" on={editor.isActive("bold")} onClick={() => c().toggleBold().run()}><b>B</b></Btn>
      <Btn title="Italic" on={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}><i>I</i></Btn>
      <Btn title="Underline" on={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()}><u>U</u></Btn>
      <Btn title="Strikethrough" on={editor.isActive("strike")} onClick={() => c().toggleStrike().run()}><s>S</s></Btn>
      <Btn title="Link" on={editor.isActive("link")} onClick={setLink}>🔗</Btn>
      <span className="mx-1 h-5 w-px bg-line" />
      <Btn title="Bullet list" on={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()}>• List</Btn>
      <Btn title="Numbered list" on={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()}>1. List</Btn>
      <Btn title="Quote" on={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}>“ ”</Btn>
      <Btn title="Divider" onClick={() => c().setHorizontalRule().run()}>―</Btn>
      <Btn title="Insert image" onClick={onImage} disabled={uploading}>{uploading ? "…" : "🖼 Image"}</Btn>
      <span className="mx-1 h-5 w-px bg-line" />
      <Btn title="Undo" onClick={() => c().undo().run()} disabled={!editor.can().undo()}>↶</Btn>
      <Btn title="Redo" onClick={() => c().redo().run()} disabled={!editor.can().redo()}>↷</Btn>
    </div>
  );
}

export default function PostEditor({ post, categories }: { post?: Post; categories: string[] }) {
  const router = useRouter();
  const saved = useSearchParams().get("saved");
  const [pending, start] = useTransition();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [cover, setCover] = useState(post?.coverImage ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.coverAlt ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [publishedAt, setPublishedAt] = useState(toLocalInput(post?.publishedAt ?? null));
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(
    saved ? { ok: true, text: saved === "published" ? "Published!" : "Draft saved." } : null
  );
  const originalSlug = useRef(post?.slug ?? "");

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: null, target: null } },
      }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({ placeholder: "Start writing your article…" }),
    ],
    content: post?.content ?? "",
    editorProps: {
      attributes: { class: "article prose prose-lg max-w-none px-5 py-6 sm:px-8" },
      handlePaste: (_view, event) => {
        const file = [...(event.clipboardData?.files ?? [])].find((f) => f.type.startsWith("image/"));
        if (file) {
          insertImage(file);
          return true;
        }
        return false;
      },
      handleDrop: (_view, event) => {
        const file = [...((event as DragEvent).dataTransfer?.files ?? [])].find((f) => f.type.startsWith("image/"));
        if (file) {
          event.preventDefault();
          insertImage(file);
          return true;
        }
        return false;
      },
    },
    onUpdate: () => setDirty(true),
  });

  // Keep a stable reference for the paste/drop handlers above.
  const editorRef = useRef<Editor | null>(null);
  editorRef.current = editor;

  async function insertImage(file: File) {
    setUploading(true);
    setMsg(null);
    try {
      const url = await uploadImage(file);
      const alt = window.prompt("Describe this image (alt text, helps SEO & accessibility):", "") || "";
      editorRef.current?.chain().focus().setImage({ src: url, alt }).run();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setUploading(false);
    }
  }

  async function uploadCover() {
    const f = await pickImage();
    if (!f) return;
    setUploading(true);
    setMsg(null);
    try {
      setCover(await uploadImage(f));
      setDirty(true);
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const mark = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDirty(true);
  };

  function save(nextStatus: "draft" | "published") {
    if (!editor) return;
    setMsg(null);
    start(async () => {
      const res = await savePost({
        id: post?.id,
        title,
        slug,
        excerpt,
        content: editor.getHTML(),
        category,
        coverImage: cover,
        coverAlt,
        seoTitle,
        status: nextStatus,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : "",
      });
      if (!res.ok) {
        setMsg({ ok: false, text: res.error });
        return;
      }
      setStatus(nextStatus);
      setSlug(res.slug);
      setDirty(false);
      const movedNote =
        post && originalSlug.current && originalSlug.current !== res.slug && post.status === "published"
          ? ` The old URL /${originalSlug.current} now redirects here.`
          : "";
      originalSlug.current = res.slug;
      setMsg({ ok: true, text: (nextStatus === "published" ? "Published!" : "Draft saved.") + movedNote });
      if (!post) router.replace(`/admin/posts/${res.id}?saved=${nextStatus}`);
      else router.refresh();
    });
  }

  function remove() {
    if (!post) return;
    if (!window.confirm(`Delete “${post.title}” permanently? Its URL will stop working.`)) return;
    start(async () => {
      setDirty(false);
      await deletePost(post.id);
    });
  }

  const seoTitlePreview = (seoTitle || title || "Article title") + " | TexasFiles";
  const descPreview = excerpt || "Add a short summary — it appears on Google and on article cards.";
  const slugChanged = post?.status === "published" && slug !== originalSlug.current;
  const catList = useMemo(() => [...new Set([...categories, "Texas Laws", "Billing Defense", "Insurance Guides", "Medicare"])], [categories]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link href="/admin" className="text-sm text-muted hover:text-ink">← All articles</Link>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
          {status === "published" ? "Published" : "Draft"}
        </span>
        {dirty && <span className="text-xs text-muted">Unsaved changes</span>}
        <div className="ml-auto flex flex-wrap gap-2">
          {post && status === "published" && (
            <Link href={`/${originalSlug.current}`} target="_blank" className="rounded-lg border border-line bg-white px-3 py-2 text-sm hover:border-ink">View ↗</Link>
          )}
          {status === "published" ? (
            <>
              <button disabled={pending} onClick={() => save("draft")} className="rounded-lg border border-line bg-white px-3 py-2 text-sm hover:border-ink disabled:opacity-50">Unpublish</button>
              <button disabled={pending} onClick={() => save("published")} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50">
                {pending ? "Saving…" : "Update"}
              </button>
            </>
          ) : (
            <>
              <button disabled={pending} onClick={() => save("draft")} className="rounded-lg border border-line bg-white px-3 py-2 text-sm hover:border-ink disabled:opacity-50">
                {pending ? "Saving…" : "Save draft"}
              </button>
              <button disabled={pending} onClick={() => save("published")} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50">
                Publish
              </button>
            </>
          )}
        </div>
      </div>

      {msg && (
        <p role="status" className={`mb-5 rounded-lg px-4 py-2.5 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-900" : "bg-accent-soft text-accent-dark"}`}>
          {msg.text}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          <input
            value={title}
            onChange={(e) => mark(setTitle)(e.target.value)}
            placeholder="Article title"
            className="w-full rounded-xl border border-line bg-white px-5 py-4 font-serif text-2xl font-semibold text-ink outline-none focus:border-ink sm:text-3xl"
          />
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            {editor && <Toolbar editor={editor} onImage={async () => { const f = await pickImage(); if (f) insertImage(f); }} uploading={uploading} />}
            <EditorContent editor={editor} />
          </div>
          <p className="text-xs text-muted">Tip: you can paste or drag images straight into the editor.</p>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-line bg-white p-4">
            <h2 className="text-sm font-semibold text-ink">URL</h2>
            <div className="mt-1.5 flex items-center rounded-lg border border-line text-sm focus-within:border-ink">
              <span className="pl-3 text-muted">texasfiles.in/</span>
              <input
                value={slug}
                onChange={(e) => { setSlugTouched(true); mark(setSlug)(e.target.value.toLowerCase().replace(/\s+/g, "-")); }}
                onBlur={() => setSlug(slugify(slug))}
                className="min-w-0 flex-1 bg-transparent py-2 pr-3 outline-none"
              />
            </div>
            {slugChanged && (
              <p className="mt-2 text-xs text-amber-800">
                Changing a live URL: the old address will automatically 301-redirect to the new one, so Google rankings carry over.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-line bg-white p-4">
            <label className="block text-sm font-semibold text-ink">
              Category
              <input list="cats" value={category} onChange={(e) => mark(setCategory)(e.target.value)} className={inputCls} placeholder="e.g. Billing Defense" />
              <datalist id="cats">{catList.map((c) => <option key={c} value={c} />)}</datalist>
            </label>
            <label className="mt-4 block text-sm font-semibold text-ink">
              Publish date
              <input type="datetime-local" value={publishedAt} onChange={(e) => mark(setPublishedAt)(e.target.value)} className={inputCls} />
              <span className="mt-1 block text-xs font-normal text-muted">Empty = now. A future date schedules the article.</span>
            </label>
          </section>

          <section className="rounded-xl border border-line bg-white p-4">
            <h2 className="text-sm font-semibold text-ink">Cover image</h2>
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="mt-2 aspect-[16/9] w-full rounded-lg object-cover" />
            ) : (
              <div className="mt-2 grid aspect-[16/9] place-items-center rounded-lg border border-dashed border-line text-xs text-muted">No cover image</div>
            )}
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={uploadCover} disabled={uploading} className="rounded-md border border-line px-2.5 py-1 text-xs hover:border-ink disabled:opacity-50">
                {uploading ? "Uploading…" : cover ? "Replace" : "Upload"}
              </button>
              {cover && <button type="button" onClick={() => mark(setCover)("")} className="rounded-md border border-line px-2.5 py-1 text-xs text-accent hover:border-accent">Remove</button>}
            </div>
            <input value={cover} onChange={(e) => mark(setCover)(e.target.value)} className={inputCls} placeholder="…or paste an image URL" />
            <input value={coverAlt} onChange={(e) => mark(setCoverAlt)(e.target.value)} className={inputCls} placeholder="Describe the image (alt text)" />
          </section>

          <section className="rounded-xl border border-line bg-white p-4">
            <h2 className="text-sm font-semibold text-ink">SEO</h2>
            <label className="mt-2 block text-xs font-medium text-ink-soft">
              Summary / meta description <span className="text-muted">({excerpt.length}/160)</span>
              <textarea value={excerpt} onChange={(e) => mark(setExcerpt)(e.target.value)} rows={3} maxLength={300} className={inputCls} />
            </label>
            <label className="mt-3 block text-xs font-medium text-ink-soft">
              SEO title (optional)
              <input value={seoTitle} onChange={(e) => mark(setSeoTitle)(e.target.value)} maxLength={120} className={inputCls} placeholder={title} />
            </label>
            <div className="mt-4 rounded-lg bg-paper p-3">
              <p className="text-[11px] text-muted">Google preview</p>
              <p className="mt-1 truncate text-xs text-ink-soft">texasfiles.in › {slug || "your-article"}</p>
              <p className="truncate text-[15px] text-[#1a0dab]">{seoTitlePreview}</p>
              <p className="line-clamp-2 text-xs text-ink-soft">{descPreview}</p>
            </div>
          </section>

          {post && (
            <button type="button" onClick={remove} disabled={pending} className="w-full rounded-lg border border-accent/30 bg-white py-2 text-sm text-accent hover:bg-accent-soft">
              Delete article
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
