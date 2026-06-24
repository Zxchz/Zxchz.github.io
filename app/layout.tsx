import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zach Krivis",
  description:
    "Zach Krivis — machine learning researcher and software developer in Cleveland, Ohio. Audio foundation model research, C++ development, and writing on AI and quantum computing.",
  authors: [{ name: "Zach Krivis" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Zach Krivis",
    description: "Machine learning research, software, and writing. Cleveland, Ohio.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-black font-sans text-[#f2f2ee] antialiased">
        {children}
      </body>
    </html>
  );
}
