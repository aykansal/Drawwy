import type { Metadata } from "next";
import { Geist, Geist_Mono, Playwrite_AU_QLD, Nunito } from "next/font/google";
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

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playwrite.variable} ${nunito.variable} font-nunito antialiased`}
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
