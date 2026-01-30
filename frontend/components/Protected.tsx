"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/lib/types";

export default function Protected({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[]; // optional role whitelist
}) {
  const { user, role, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!user) window.location.href = "/login";
    if (allow && role && !allow.includes(role)) window.location.href = "/";
  }, [ready, user, role, allow]);

  if (!ready) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Redirecting...</div>;
  if (allow && role && !allow.includes(role)) return <div className="p-6">Redirecting...</div>;

  return <>{children}</>;
}
