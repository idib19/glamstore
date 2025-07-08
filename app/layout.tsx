import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth";
import { CartProvider } from "../lib/cartContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Queen&apos;s Glam - Beauté & Bien-être",
  description: "Découvrez notre sélection de produits de beauté et services de bien-être",
  keywords: "beauté, bien-être, soins, produits cosmétiques, rendez-vous, France",
  authors: [{ name: "Queen&apos;s Glam" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Fonts are loaded via next/font/google - no need for manual links */}
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
