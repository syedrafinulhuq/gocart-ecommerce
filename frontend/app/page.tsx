import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const res = await api("/products") as { data: { items: any[] } };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {res.data.items.map((p: any) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}
