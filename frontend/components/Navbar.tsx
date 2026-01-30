"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout, ready } = useAuth();

  return (
    <div className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-lg">GoCart</Link>

        <div className="flex items-center gap-3">
          {ready && user ? (
            <>
              <span className="text-sm text-gray-600">{user.email} • {user.role}</span>
              <button
                onClick={logout}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50" href="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
