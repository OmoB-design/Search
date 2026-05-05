import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DialProvider } from "@/components/providers/DialProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terrah 360",
  description: "Real estate platform for agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="antialiased">
        {children}
        <DialProvider />
      </body>
    </html>
  );
}
