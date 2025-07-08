import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "GlamStore - Beauté & Bien-être",
  description: "Votre destination beauté et bien-être. Découvrez nos services et produits de qualité pour prendre soin de vous.",
  keywords: "beauté, bien-être, soins, produits cosmétiques, rendez-vous, France",
  authors: [{ name: "GlamStore" }],
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
