import type { Metadata } from "next";
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
        url: "/image.png",
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
    images: ["/image.png"],
    creator: "@aykansal",
    site: "@aykansal",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "author": "aykansal",
    "twitter:creator": "@aykansal",
    "twitter:site": "@aykansal",
    "og:author": "aykansal",
  },
};

export default function Home() {
  return (
    <>
      {/* Raw Meta Tags for Home Page - Arweave Deployment */}
      <head>
        {/* Page Specific Meta Tags */}
        <meta name="title" content="Drawwy - Create Pixel Art with Permanent Storage" />
        <meta name="description" content="Create beautiful pixel art and share it with your friends! Drawwy is a fun pixel art editor with permanent storage on Arweave. Draw on 8x8, 16x16, or 32x32 grids with lots of colors. Built with ❤️ by aykansal." />
        <meta name="keywords" content="pixel art creator, online drawing tool, arweave art storage, digital art editor, pixel art maker, blockchain art platform, permanent art storage, aykansal" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Drawwy - Create Pixel Art with Permanent Storage" />
        <meta property="og:description" content="Create beautiful pixel art and share it with your friends! Permanent storage on Arweave. Built with ❤️ by aykansal." />
        <meta property="og:url" content="https://drawwy_arlink.ar.io" />
        <meta property="og:image" content="https://drawwy_arlink.ar.io/image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Drawwy Pixel Art Editor - Create and Share" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Drawwy" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Drawwy - Create Pixel Art with Permanent Storage" />
        <meta name="twitter:description" content="Create beautiful pixel art and share it with your friends! Permanent storage on Arweave." />
        <meta name="twitter:image" content="https://drawwy_arlink.ar.io/image.png" />
        <meta name="twitter:creator" content="@aykansal" />
        <meta name="twitter:site" content="@aykansal" />
        
        {/* Canonical and Alternate URLs */}
        <link rel="canonical" href="https://drawwy_arlink.ar.io" />
        <link rel="alternate" href="https://drawwy_arlink.ar.io" hrefLang="en" />
        
        {/* Page Specific SEO */}
        <meta name="page-type" content="homepage" />
        <meta name="page-category" content="art-creator" />
        <meta name="page-features" content="pixel-art-editor,permanent-storage,arweave,blockchain" />
        
        {/* Structured Data for Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
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
              "8x8, 16x16, 32x32 Grids",
              "Permanent Storage on Arweave",
              "Digital Art Creation",
              "Blockchain Integration"
            ]
          })}
        </script>
      </head>
      
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
