"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }) as { data: { token: string; user: any } };

      setSession(res.data.token, res.data.user);
      showToast("Login successful", "success");
    } catch (err: any) {
      showToast(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white p-2"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
