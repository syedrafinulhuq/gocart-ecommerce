import { getToken, clearSession } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_BASE;

if (!BASE) {
  console.warn("NEXT_PUBLIC_API_BASE is not set");
}

type ApiOptions = RequestInit & { auth?: boolean };

export async function api<T>(path: string, options: ApiOptions = {}) {
  const url = `${BASE}${path}`;
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  // Try JSON; fallback to text
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    if (res.status === 401) clearSession();
    const msg = json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json as T;
}
