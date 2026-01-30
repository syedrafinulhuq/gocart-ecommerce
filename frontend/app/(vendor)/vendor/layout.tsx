"use client";

import Sidebar from "@/components/Sidebar";
import Protected from "@/components/Protected";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected allow={["VENDOR", "ADMIN"]}>
      <div className="flex rounded-2xl border bg-white shadow-sm overflow-hidden min-h-[70vh]">
        <Sidebar
          items={[
            { href: "/vendor/dashboard", label: "Dashboard" },
            { href: "/vendor/products", label: "Products" },
            { href: "/vendor/orders", label: "Orders" },
          ]}
        />
        <div className="flex-1 p-6 bg-gray-50">{children}</div>
      </div>
    </Protected>
  );
}
