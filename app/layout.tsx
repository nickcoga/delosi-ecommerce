import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/Header";

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
  title: "Delosi Ecommerce",
  description:
    "Tienda de demostración del reto técnico Delosi: catálogo de productos con búsqueda, filtros y carrito.",
  openGraph: {
    title: "Delosi Ecommerce",
    description:
      "Tienda de demostración del reto técnico Delosi: catálogo de productos con búsqueda, filtros y carrito.",
    siteName: "Delosi Ecommerce",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
