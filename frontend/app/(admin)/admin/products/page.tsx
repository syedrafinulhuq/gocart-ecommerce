"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ApiResponse, Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      // Reuse public list for admin UI; if you have an admin list endpoint, switch it here.
      const r = await api<ApiResponse<Product[]>>("/products");
      setProducts(r.data);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function activate(id: string) {
    await api(`/admin/products/${id}/activate`, { method: "PATCH", auth: true });
    await load();
  }

  async function block(id: string) {
    await api(`/admin/products/${id}/block`, { method: "PATCH", auth: true });
    await load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Product Moderation</h1>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="rounded-2xl border bg-white p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600">{p.price} {p.currency ?? "BDT"} • Stock {p.stock}</div>
              <div className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs">
                {p.status}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => activate(p.id)}
                className="rounded-xl bg-black px-3 py-2 text-sm text-white"
              >
                Activate
              </button>
              <button
                onClick={() => block(p.id)}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Block
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 ? <div className="text-sm text-gray-600">No products found.</div> : null}
      </div>
    </div>
  );
}
