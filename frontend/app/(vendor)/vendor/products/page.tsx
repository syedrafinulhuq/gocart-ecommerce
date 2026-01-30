"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ApiResponse, Product } from "@/lib/types";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setErr(null);
    try {
      const r = await api<ApiResponse<Product[]>>("/vendor/products", { auth: true });
      setProducts(r.data);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function createQuick() {
    setCreating(true);
    setErr(null);
    try {
      await api<ApiResponse<Product>>("/vendor/products", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          title: "Demo Product",
          description: "Created from vendor UI",
          sku: "DEMO-001",
          price: 499,
          stock: 10,
        }),
      });
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold">My Products</h1>
        <button
          onClick={createQuick}
          disabled={creating}
          className="rounded-xl bg-black px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          {creating ? "Creating..." : "Quick Create"}
        </button>
      </div>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{p.title}</div>
              <div className="text-xs rounded-full bg-gray-100 px-3 py-1">{p.status}</div>
            </div>
            <div className="mt-1 text-sm text-gray-600">{p.description ?? "-"}</div>
            <div className="mt-2 text-sm font-semibold">{p.price} {p.currency ?? "BDT"}</div>
          </div>
        ))}
        {products.length === 0 ? <div className="text-sm text-gray-600">No products yet.</div> : null}
      </div>
    </div>
  );
}
