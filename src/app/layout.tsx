import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markly - Smart Bookmark Manager",
  description: "Save, organize, and access your links from anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-body">
        {children}
      </body>
    </html>
  );
}
