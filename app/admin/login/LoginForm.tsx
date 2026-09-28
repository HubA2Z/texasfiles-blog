"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const input = "mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-ink">
        Email
        <input name="email" type="email" required autoComplete="username" defaultValue={state?.email} key={state?.email} className={input} />
      </label>
      <label className="block text-sm font-medium text-ink">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={input} />
      </label>
      {state?.error && <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent-dark" role="alert">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-ink py-2.5 text-sm font-semibold text-white hover:bg-ink-soft disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
