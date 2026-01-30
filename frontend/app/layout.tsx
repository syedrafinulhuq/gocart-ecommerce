import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/Toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <ToastProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-6">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
