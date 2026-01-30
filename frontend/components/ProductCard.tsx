import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/product/${p.id}`}
      className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow transition"
    >
      <div className="font-medium">{p.title}</div>
      {p.description ? <div className="mt-1 line-clamp-2 text-sm text-gray-600">{p.description}</div> : null}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm font-semibold">
          {p.price} {p.currency ?? "BDT"}
        </div>
        <div className="text-xs text-gray-500">Stock: {p.stock}</div>
      </div>
    </Link>
  );
}
