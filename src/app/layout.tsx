import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRANJAY RATHORE | Creative Developer",
  description: "High-end Scrollytelling Personal Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-[#D4D4D4] antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
