import type { Metadata } from "next";
import { Geist, Geist_Mono, Playwrite_AU_QLD } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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

export const metadata: Metadata = {
  title: "Drawwy",
  description:
    "Drawwy is a pixel art editor that allows you to create pixel art and share it with your friends.",
  authors: [{ name: "Aykansal", url: "https://x.com/aykansal" }],
  creator: "Aykansal",
  publisher: "Aykansal",
  openGraph: {
    title: "Drawwy",
    description:
      "Drawwy is a pixel art editor that allows you to create pixel art and share it with your friends.",
  },
  category: "art",
  robots: {
    index: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawwy",
    description:
      "Drawwy is a pixel art editor that allows you to create pixel art and share it with your friends.",
    images: [""],
  },
  metadataBase: new URL("https://x.com/aykansal"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playwrite.variable} ${nunito.variable} antialiased`}
      >
        {children}
        <footer className="mt-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground/70">
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
      </body>
    </html>
  );
}
