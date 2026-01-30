"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function VendorOrdersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<any>("/vendor/orders/items", { auth: true })
      .then((r) => setItems(r.data ?? r))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Vendor Orders</h1>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-gray-600">
          This shows order items assigned to your vendor.
        </div>

        <div className="mt-3 space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-xl border p-3">
              <div className="text-sm font-medium">OrderItem</div>
              <pre className="mt-2 overflow-auto text-xs text-gray-700">
                {JSON.stringify(it, null, 2)}
              </pre>
            </div>
          ))}
          {items.length === 0 ? <div className="text-sm text-gray-600">No order items yet.</div> : null}
        </div>
      </div>
    </div>
  );
}
