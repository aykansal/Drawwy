import type { Metadata } from "next";
import Script from "next/script";
import DisplayArts from "@/components/bazar/display-arts";
import PixelArtApp from "@/components/pixel-art/pixel-art-app";
import Testimonial from "@/components/testimonial";

export const metadata: Metadata = {
  title: "Drawwy - Create Pixel Art with Permanent Storage",
  description: "Create beautiful pixel art and share it with your friends! Drawwy is a fun pixel art editor with permanent storage on Arweave. Draw on 8x8, 16x16, or 32x32 grids with lots of colors. Built with ❤️ by aykansal.",
  keywords: [
    "pixel art creator",
    "online drawing tool",
    "arweave art storage",
    "digital art editor",
    "pixel art maker",
    "blockchain art platform",
    "permanent art storage",
    "aykansal",
  ],
  authors: [
    { name: "aykansal", url: "https://x.com/aykansal" },
    { name: "aykansal", url: "https://github.com/aykansal" }
  ],
  creator: "aykansal",
  openGraph: {
    title: "Drawwy - Create Pixel Art with Permanent Storage",
    description: "Create beautiful pixel art and share it with your friends! Permanent storage on Arweave. Built with ❤️ by aykansal.",
    url: "https://drawwy_arlink.ar.io",
    siteName: "Drawwy",
    images: [
      {
        url: "https://drawwy_arlink.ar.io/image.png",
        width: 1200,
        height: 630,
        alt: "Drawwy Pixel Art Editor - Create and Share",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawwy - Create Pixel Art with Permanent Storage",
    description: "Create beautiful pixel art and share it with your friends! Permanent storage on Arweave.",
    images: ["https://drawwy_arlink.ar.io/image.png"],
    creator: "@aykansal",
    site: "@aykansal",
  },
  alternates: {
    canonical: "https://drawwy_arlink.ar.io",
    languages: {
      'en': 'https://drawwy_arlink.ar.io',
    },
  },
  other: {
    "author": "aykansal",
    "twitter:creator": "@aykansal",
    "twitter:site": "@aykansal",
    "og:author": "aykansal",
    "page-type": "homepage",
    "page-category": "art-creator",
    "page-features": "pixel-art-editor,permanent-storage,arweave,blockchain",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Drawwy",
    "description": "Create beautiful pixel art and share it with your friends! Drawwy is a fun pixel art editor with permanent storage on Arweave.",
    "url": "https://drawwy_arlink.ar.io",
    "applicationCategory": "ArtApplication",
    "operatingSystem": "Web Browser",
    "author": {
      "@type": "Person",
      "name": "aykansal",
      "url": "https://x.com/aykansal"
    },
    "creator": {
      "@type": "Person",
      "name": "aykansal",
      "url": "https://github.com/aykansal"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Drawwy"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Pixel Art Editor",
      "8x8, 16x16, 32x32, 48x48 Grids",
      "Permanent Storage on Arweave",
      "Digital Art Creation",
      "Blockchain Integration"
    ]
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
