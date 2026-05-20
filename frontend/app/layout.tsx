import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "EdgePrint AI — Futuristic Anti-Spoof Security Dashboard",
  description: "Computer vision and deep learning powered fingertip liveness verification platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} h-full bg-[#030712] text-white antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}

