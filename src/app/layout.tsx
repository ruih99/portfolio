import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/language-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rui Honda",
  description:
    "Portfolio site of ruih99, a software engineer. Showcasing skills, careers, and projects.",
  keywords: ["ruih99", "portfolio", "software engineer", "web development"],
  authors: [{ name: "ruih99", url: "https://ruih99.dev" }],
  creator: "ruih99",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://www.ruih99.dev",
    title: "Rui Honda",
    description:
      "Portfolio site of Rui Honda, a software engineer. Showcasing skills, careers, and projects.",
    siteName: "ruih99.dev",
    locale: "ja_JP",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rui Honda - Portfolio",
      },
    ],
  },
  metadataBase: new URL("https://www.ruih99.dev"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * アプリケーションのルートレイアウトコンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.children - 子要素
 * @returns ルートレイアウトのJSX要素
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d1117] text-gray-100`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
