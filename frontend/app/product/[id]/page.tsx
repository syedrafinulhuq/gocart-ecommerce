import { api } from "@/lib/api";
import type { ApiResponse, Product } from "@/lib/types";

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const res = await api<ApiResponse<Product>>(`/products/${params.id}`);

  const p = res.data;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="text-2xl font-semibold">{p.title}</div>
      <div className="mt-2 text-gray-600">{p.description ?? "No description"}</div>

      <div className="mt-4 flex gap-4 text-sm">
        <div><span className="text-gray-500">SKU:</span> {p.sku ?? "-"}</div>
        <div><span className="text-gray-500">Stock:</span> {p.stock}</div>
        <div><span className="text-gray-500">Status:</span> {p.status}</div>
      </div>

      <div className="mt-6 text-lg font-semibold">
        {p.price} {p.currency ?? "BDT"}
      </div>

      {/* Level 2: you can add "Add to cart" next; keep simple for assessment */}
      <div className="mt-4 text-sm text-gray-500">
        Ordering UI can be added in the next step (customer checkout page).
      </div>
    </div>
  );
}
