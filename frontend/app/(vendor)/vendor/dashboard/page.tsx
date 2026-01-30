"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ApiResponse, Vendor } from "@/lib/types";

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<ApiResponse<Vendor>>("/vendor/me", { auth: true })
      .then((r) => setVendor(r.data))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Vendor Dashboard</h1>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      {!vendor ? (
        <div className="text-sm text-gray-600">Loading vendor profile...</div>
      ) : (
        <div className="rounded-2xl border bg-white p-4">
          <div className="font-medium">{vendor.name}</div>
          <div className="text-sm text-gray-600">Slug: {vendor.slug}</div>
          <div className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs">
            Status: {vendor.status}
          </div>
        </div>
      )}
    </div>
  );
}
