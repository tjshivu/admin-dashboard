import type { Metadata } from "next";
import { Titillium_Web, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import "./globals.css";

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrikUp - Find Trusted Pros",
    template: "%s | BrikUp",
  },
  description: "Discover, compare, and book trusted service professionals in your neighborhood. Verified experts, authentic reviews, and community-vetted services.",
  keywords: ["service professionals", "local experts", "home services", "trusted pros", "BrikUp", "Bangalore"],
  authors: [{ name: "BrikUp Team" }],
  creator: "BrikUp",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: "BrikUp - Find Trusted Pros",
    description: "Discover, compare, and book trusted service professionals in your neighborhood.",
    siteName: "BrikUp",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrikUp - Find Trusted Pros",
    description: "Discover, compare, and book trusted service professionals in your neighborhood.",
    creator: "@brikup",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

/**
 * RootLayout Component
 *
 * Defines the global structure of the application.
 * - Imports global fonts (Inter, Titillium Web).
 * - Sets up SEO metadata.
 * - Injects structural JSON-LD data.
 * - Wraps all pages with the Header and global styles.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${titillium.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      </head>
      <body className="antialiased bg-white text-[#09090b] selection:bg-[#D4AF37] selection:text-black font-sans">
        <Header />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "BrikUp",
                  "url": "https://brikuptech.com",
                  "logo": "https://brikuptech.com/logo.png",
                  "sameAs": [
                    "https://twitter.com/brikup",
                    "https://instagram.com/brikup",
                    "https://linkedin.com/company/brikup"
                  ]
                },
                {
                  "@type": "WebSite",
                  "name": "BrikUp",
                  "url": "https://brikuptech.com",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://brikuptech.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
