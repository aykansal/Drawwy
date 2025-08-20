import type { Metadata } from "next";
import Script from "next/script";
import DisplayArts from "@/components/bazar/display-arts";
import PixelArtApp from "@/components/pixel-art/pixel-art-app";
import Testimonial from "@/components/testimonial";

export const metadata: Metadata = {
  title: "Drawwy 🎨 Pixel Art Editor with Permanent Storage",
  description:
    "Drawwy is a fun, browser-based pixel art editor. Draw on customizable grids (8x8 → 48x48), save locally, and publish forever on Arweave. No logins, no signups, just pixels + vibes.",
  keywords: [
    "pixel art editor",
    "pixel art maker online",
    "arweave art storage",
    "web3 art tool",
    "NFT pixel art generator",
    "create pixel sprites",
    "retro art editor",
    "permanent blockchain storage",
    "drawwy",
    "aykansal",
  ],
  authors: [
    { name: "aykansal", url: "https://x.com/aykansal" },
    { name: "aykansal", url: "https://github.com/aykansal" },
  ],
  creator: "aykansal",
  themeColor: "#111111",
  openGraph: {
    title: "Drawwy 🎨 Pixel Art Editor",
    description:
      "Make pixel art, save locally, and publish forever on Arweave. Shareable, permanent links for your creations.",
    url: "https://drawwy_arlink.ar.io",
    siteName: "Drawwy",
    images: [
      {
        url: "https://drawwy_arlink.ar.io/image.png",
        width: 1200,
        height: 630,
        alt: "Drawwy Pixel Art Editor - Create & Store Forever",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawwy 🎨 Pixel Art Editor",
    description:
      "No logins, no signups. Just pixels + vibes. Store your art forever on Arweave.",
    images: ["https://drawwy_arlink.ar.io/image.png"],
    creator: "@aykansal",
    site: "@aykansal",
  },
  alternates: {
    canonical: "https://drawwy_arlink.ar.io",
    languages: {
      en: "https://drawwy_arlink.ar.io",
    },
  },
  other: {
    author: "aykansal",
    "twitter:creator": "@aykansal",
    "twitter:site": "@aykansal",
    "og:author": "aykansal",
    "page-type": "homepage",
    "page-category": "art-creator",
    "page-features":
      "pixel-art-editor,permanent-storage,arweave,blockchain,web3,fun,genz",
    "application-name": "Drawwy",
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Drawwy",
    description:
      "Create fun pixel art, save in your browser, and publish forever on Arweave. No logins, no signups — just pixels + vibes.",
    url: "https://drawwy_arlink.ar.io",
    applicationCategory: "ArtApplication",
    operatingSystem: "Web Browser",
    author: {
      "@type": "Person",
      name: "aykansal",
      url: "https://x.com/aykansal",
    },
    creator: {
      "@type": "Person",
      name: "aykansal",
      url: "https://github.com/aykansal",
    },
    publisher: {
      "@type": "Organization",
      name: "Drawwy",
      url: "https://drawwy_arlink.ar.io",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Pixel Art Editor",
      "8x8, 16x16, 32x32, 48x48 Grids",
      "Permanent Storage on Arweave",
      "Local Save + Continue Later",
      "Community Gallery",
      "Shareable Links",
    ],
    screenshot: "https://drawwy_arlink.ar.io/screenshot.png",
    thumbnailUrl: "https://drawwy_arlink.ar.io/image.png",
    sameAs: ["https://x.com/aykansal", "https://github.com/aykansal/drawwy"],
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="md:space-y-20 px-6">
        <PixelArtApp />
        <div className="max-w-7xl mx-auto space-y-36">
          <Testimonial />
          <DisplayArts />
        </div>
      </div>
    </>
  );
}
