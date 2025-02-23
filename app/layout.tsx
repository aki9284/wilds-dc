import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MenuBar } from "@/components/navigation/MenuBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wilds DC",
  description: "Monster Hunter Wilds DC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MenuBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
