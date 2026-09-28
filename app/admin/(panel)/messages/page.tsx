import { ensureSchema, sql } from "@/lib/db";
import { deleteMessage, toggleMessageRead } from "../../actions";

type Msg = { id: number; name: string; email: string; body: string; is_read: boolean; created_at: Date };

export default async function Messages() {
  await ensureSchema();
  const msgs = await sql<Msg[]>`SELECT * FROM messages ORDER BY created_at DESC LIMIT 200`;

  return (
    <>
      <h1 className="font-serif text-3xl font-semibold text-ink">Messages</h1>
      <p className="mt-1 text-sm text-muted">Stories and inquiries sent through the Contact page.</p>
      <div className="mt-6 space-y-3">
        {msgs.length === 0 && <p className="rounded-xl border border-line bg-white p-10 text-center text-muted">No messages yet.</p>}
        {msgs.map((m) => (
          <article key={m.id} className={`rounded-xl border bg-white p-5 ${m.is_read ? "border-line" : "border-accent/40 shadow-sm"}`}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {!m.is_read && <span className="h-2 w-2 rounded-full bg-accent" aria-label="Unread" />}
              <p className="font-semibold text-ink">{m.name}</p>
              <a href={`mailto:${m.email}`} className="text-sm text-accent">{m.email}</a>
              <time className="ml-auto text-xs text-muted">
                {new Date(m.created_at).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium", timeStyle: "short" })}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{m.body}</p>
            <div className="mt-4 flex gap-2 text-xs">
              <form action={toggleMessageRead.bind(null, m.id, !m.is_read)}>
                <button className="rounded-md border border-line px-2.5 py-1 hover:border-ink">{m.is_read ? "Mark unread" : "Mark read"}</button>
              </form>
              <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to TexasFiles")}`} className="rounded-md border border-line px-2.5 py-1 hover:border-ink">Reply</a>
              <form action={deleteMessage.bind(null, m.id)}>
                <button className="rounded-md border border-line px-2.5 py-1 text-accent hover:border-accent">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
