import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
});

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
      <body
        className={`${jost.variable} ${jost.className} bg-app-bg text-app-text antialiased`}
      >
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 md:ml-64">{children}</main>
        </div>
      </body>
    </html>
  );
}
