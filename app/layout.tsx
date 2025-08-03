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
    "blockchain art",
    "permanent storage",
    "digital creation",
    "art platform",
  ],
  authors: [
    { name: "aykansal", url: "https://x.com/aykansal" },
    { name: "aykansal", url: "https://github.com/aykansal" },
  ],
  creator: "aykansal",
  publisher: "Drawwy",
  applicationName: "Drawwy",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
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
      "Create pixel art and share it with your friends! Permanent storage on Arweave. Built with ❤️ by aykansal.",
    url: "https://drawwy_arlink.ar.io",
    siteName: "Drawwy",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Drawwy Pixel Art Editor Interface",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Drawwy Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawwy - Pixel Art Editor",
    description:
      "Create pixel art and share it with your friends! Permanent storage on Arweave. Built with ❤️ by aykansal.",
    images: ["/image.png"],
    creator: "@aykansal",
    site: "@aykansal",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    author: "aykansal",
    "twitter:creator": "@aykansal",
    "twitter:site": "@aykansal",
    "og:author": "aykansal",
    "article:author": "aykansal",
    "theme-color": "#000000",
    "color-scheme": "light dark",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Drawwy",
    "mobile-web-app-capable": "yes",
    "application-name": "Drawwy",
    "msapplication-config": "/browserconfig.xml",
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
  classification: "Creative Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Raw Meta Tags for Arweave Deployment */}
        <meta name="author" content="aykansal" />
        <meta name="creator" content="aykansal" />
        <meta name="publisher" content="Drawwy" />
        <meta name="application-name" content="Drawwy" />
        <meta name="generator" content="Next.js" />
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        {/* Mobile App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Drawwy" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Social Media Meta Tags */}
        <meta property="og:author" content="aykansal" />
        <meta property="og:site_name" content="Drawwy" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:creator" content="@aykansal" />
        <meta name="twitter:site" content="@aykansal" />
        
        {/* Verification Meta Tags */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        <meta name="yahoo-verification" content="your-yahoo-verification-code" />
        
        {/* Additional Meta Tags */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://drawwy_arlink.ar.io" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://analytics_arlink.ar.io" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//x.com" />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//arweave.net" />
        
        {/* Arweave and Blockchain Specific Meta Tags */}
        <meta name="blockchain" content="arweave" />
        <meta name="permanent-storage" content="true" />
        <meta name="decentralized" content="true" />
        <meta name="web3" content="true" />
        <meta name="crypto-art" content="true" />
        <meta name="nft-platform" content="true" />
        
        {/* Security Meta Tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* Viewport and Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        
        {/* Performance Meta Tags */}
        <meta name="renderer" content="webkit" />
        <meta name="force-rendering" content="webkit" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      </head>
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
        </footer>
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col-reverse items-center gap-4">
            {links.map(({ href, icon: Icon, label }) => (
              <div
                key={href}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </footer>
      </body>
    </html>
  );
}

const links = [
  {
    href: "https://github.com/aykansal/drawwy",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://x.com/aykansal",
    icon: Twitter,
    label: "Twitter",
  },
];
