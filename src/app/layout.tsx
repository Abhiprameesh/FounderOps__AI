import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "FounderOps AI - Founder Memory & Decision Intelligence",
  description: "AI-powered decision intelligence and memory repository platform for startup founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-row bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-screen relative grid-bg flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}

