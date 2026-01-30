"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    try {
      await api<ApiResponse<any>>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setOk("Registered. You can login now.");
    } catch (e: any) {
      setErr(e.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Register</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input name="email" placeholder="Email" className="w-full rounded-xl border px-3 py-2" />
        <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border px-3 py-2" />

        {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}
        {ok ? <div className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</div> : null}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-black px-3 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <div className="text-sm text-gray-600">
          Already have an account? <a className="underline" href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}
