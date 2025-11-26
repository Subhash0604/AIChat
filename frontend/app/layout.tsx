import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const inter = Inter({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Support Chat platfrom",
  description: "AI-powered support chat platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="font-semibold text-lg">AI Support</h1>
            <nav className="flex gap-6 text-sm">
              <Link href="/">Chat</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>

        <Separator />

        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
