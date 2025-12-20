import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Photolectic | Verified Human Photography",
    template: "%s | Photolectic",
  },
  description:
    "The premier marketplace for verified, authentic human-made photography. Every image authenticated, every creator celebrated.",
  keywords: [
    "photography",
    "stock photos",
    "authentic photography",
    "human-made",
    "verified photos",
    "photo licensing",
    "creative marketplace",
  ],
  authors: [{ name: "Photolectic" }],
  creator: "Photolectic",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://photolectic.com",
    siteName: "Photolectic",
    title: "Photolectic | Verified Human Photography",
    description:
      "The premier marketplace for verified, authentic human-made photography.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Photolectic - Verified Human Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photolectic | Verified Human Photography",
    description:
      "The premier marketplace for verified, authentic human-made photography.",
    images: ["/og-image.png"],
    creator: "@photolectic",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bebasNeue.variable} ${inter.variable} font-body antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
