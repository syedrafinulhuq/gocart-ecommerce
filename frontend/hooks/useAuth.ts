"use client";

import { useEffect, useMemo, useState } from "react";
import { clearSession, getUser } from "@/lib/auth";
import type { Role, User } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setReady(true);
  }, []);

  const role: Role | null = useMemo(() => user?.role ?? null, [user]);

  function logout() {
    clearSession();
    setUser(null);
    window.location.href = "/login";
  }

  return { user, role, ready, setUser, logout };
}
