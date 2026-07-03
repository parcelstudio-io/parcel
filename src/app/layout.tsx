import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parcel — Your Personal Agent",
  description: "Connect through your personal AI agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-stone-50 text-stone-900 antialiased`}>
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 md:ml-64">{children}</main>
        </div>
      </body>
    </html>
  );
}
