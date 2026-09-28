"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-ink";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, null);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900" role="status">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4" key={state?.message}>
      <div className="hidden" aria-hidden>
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="block text-sm font-medium text-ink">
        Your Name*
        <input name="name" defaultValue={state?.values?.name} required maxLength={120} className={field} autoComplete="name" />
      </label>
      <label className="block text-sm font-medium text-ink">
        Your Email*
        <input name="email" type="email" defaultValue={state?.values?.email} required maxLength={200} className={field} autoComplete="email" />
      </label>
      <label className="block text-sm font-medium text-ink">
        Your Story or Inquiry*
        <textarea name="body" defaultValue={state?.values?.body} required rows={6} maxLength={5000} className={field} />
      </label>
      {state && !state.ok && <p className="text-sm text-accent" role="alert">{state.message}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send My Story"}
      </button>
    </form>
  );
}
