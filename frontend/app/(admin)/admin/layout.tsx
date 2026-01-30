"use client";

import Sidebar from "@/components/Sidebar";
import Protected from "@/components/Protected";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected allow={["ADMIN"]}>
      <div className="flex rounded-2xl border bg-white shadow-sm overflow-hidden min-h-[70vh]">
        <Sidebar
          items={[
            { href: "/admin/dashboard", label: "Dashboard" },
            { href: "/admin/vendors", label: "Vendors" },
            { href: "/admin/products", label: "Products" },
          ]}
        />
        <div className="flex-1 p-6 bg-gray-50">{children}</div>
      </div>
    </Protected>
  );
}
