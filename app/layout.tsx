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
  title: "かりぴきゅれーたー：狩猟笛ダメージ計算機",
  description: "モンスターハンター ワイルズの狩猟笛について様々な条件でダメージ計算を行うことができます。",
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
