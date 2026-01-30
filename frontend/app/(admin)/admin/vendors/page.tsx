"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ApiResponse, Vendor } from "@/lib/types";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const r = await api<ApiResponse<Vendor[]>>("/admin/vendors", { auth: true });
      setVendors(r.data);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id: string) {
    await api(`/admin/vendors/${id}/approve`, { method: "PATCH", auth: true });
    await load();
  }

  async function suspend(id: string) {
    await api(`/admin/vendors/${id}/suspend`, { method: "PATCH", auth: true });
    await load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Vendors</h1>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="space-y-3">
        {vendors.map((v) => (
          <div key={v.id} className="rounded-2xl border bg-white p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{v.name}</div>
              <div className="text-sm text-gray-600">@{v.slug}</div>
              <div className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs">
                {v.status}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => approve(v.id)}
                className="rounded-xl bg-black px-3 py-2 text-sm text-white"
              >
                Approve
              </button>
              <button
                onClick={() => suspend(v.id)}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Suspend
              </button>
            </div>
          </div>
        ))}
        {vendors.length === 0 ? <div className="text-sm text-gray-600">No vendors found.</div> : null}
      </div>
    </div>
  );
}
