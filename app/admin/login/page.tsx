import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { Logo } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center"><Logo /></div>
        <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <h1 className="font-serif text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-muted">Admin access to write and publish articles.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
