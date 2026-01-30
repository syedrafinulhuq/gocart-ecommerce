"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Item({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm ${
        active ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Sidebar({ items }: { items: { href: string; label: string }[] }) {
  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="p-4 space-y-1">
        {items.map((it) => (
          <Item key={it.href} href={it.href} label={it.label} />
        ))}
      </div>
    </aside>
  );
}
