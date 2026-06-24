import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zach Krivis",
  description:
    "Zach Krivis — machine learning researcher and software developer in Cleveland, Ohio. Audio foundation model research, high-performance infrastructure, and writing on AI and quantum computing.",
  authors: [{ name: "Zach Krivis" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Zach Krivis",
    description: "Machine learning research, software, and writing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="overflow-x-hidden bg-[#050506] font-sans text-[#e7e7ea] antialiased">
        {children}
      </body>
    </html>
  );
}
