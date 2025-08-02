import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playwrite_AU_QLD, Nunito } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
// import { PermawebProvider } from "@/components/layout/PermwebProvider";
import { Toaster } from "@/components/ui/sonner";
import { Github, Twitter } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const playwrite = Playwrite_AU_QLD({
  variable: "--font-playwrite-au-qld",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Drawwy - Pixel Art Editor",
  description:
    "Create pixel art and share it with your friends! Drawwy is a fun pixel art editor with permanent storage on Arweave. Draw on 8x8, 16x16, or 32x32 grids with lots of colors.",
  keywords: [
    "pixel art",
    "drawing tool",
    "art editor",
    "arweave",
    "digital art",
    "pixel editor",
    "creative tool",
  ],
  authors: [{ name: "aykansal", url: "https://x.com/aykansal" }],
  creator: "aykansal",
  publisher: "Drawwy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://drawwy_arlink.ar.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Drawwy - Pixel Art Editor",
    description:
      "Create pixel art and share it with your friends! Permanent storage on Arweave.",
    url: "https://drawwy_arlink.ar.io",
    siteName: "Drawwy",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Drawwy Pixel Art Editor Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawwy - Pixel Art Editor",
    description:
      "Create pixel art and share it with your friends! Permanent storage on Arweave.",
    images: ["/image.png"],
    creator: "@aykansal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  category: "art",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-P6NKXMG2" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playwrite.variable} ${nunito.variable} antialiased`}
      >
        <Script
          id="custom-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      (function() {
        const ANALYTICS_CONFIG = {
          src: 'https://analytics_arlink.ar.io/browser.js',
          processId: 'Nu96T9CvxTA8qcFGUcwrQnsek33PEDbylhlE8brmnXM',
          trackUrlHashes: true,
          debug: false
        };
        function init() {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = ANALYTICS_CONFIG.src;
          script.setAttribute('data-process-id', ANALYTICS_CONFIG.processId);
          script.setAttribute('data-track-url-hashes', ANALYTICS_CONFIG.trackUrlHashes);
          script.setAttribute('data-debug', ANALYTICS_CONFIG.debug);
          document.body.appendChild(script);
        }
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', init);
        } else {
          init();
        }
      })();
    `,
          }}
        />
        {children}
        <Toaster />
        <footer className="mt-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-11 flex items-center justify-between">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground/70 font-nunito">
                crafted with ❤️ by{" "}
                <Link
                  href="https://x.com/aykansal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  aykansal
                </Link>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 w-fit">
            <Link
              href="https://github.com/aykansal/drawwy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5 text-muted-foreground hover:text-gray-900 transition-colors duration-200" />
            </Link>

            <Link
              href="https://x.com/aykansal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-gray-900 transition-colors duration-200" />
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
