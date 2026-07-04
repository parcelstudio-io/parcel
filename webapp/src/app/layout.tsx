import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
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
        className={`${montserrat.variable} ${montserrat.className} bg-app-bg text-app-text antialiased`}
      >
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 md:ml-64">{children}</main>
        </div>
      </body>
    </html>
  );
}
