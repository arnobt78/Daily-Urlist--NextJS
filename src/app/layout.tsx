import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { LinkIcon } from "@heroicons/react/24/outline";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daily-urlist.vercel.app"),
  title: "The Urlist - Share Your URLs",
  description:
    "Create and share lists of URLs easily. Perfect for sharing resources, bookmarks, and collections with others.",
  openGraph: {
    title: "The Urlist - Share Your URLs",
    description:
      "Create and share lists of URLs easily. Perfect for sharing resources, bookmarks, and collections with others.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "The Urlist Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Urlist - Share Your URLs",
    description:
      "Create and share lists of URLs easily. Perfect for sharing resources, bookmarks, and collections with others.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        {/* SEO: Open Graph and Twitter meta tags for logo */}
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:alt" content="The Urlist Logo" />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <div className="flex flex-col min-h-screen bg-gray-50">
          <nav className="bg-white border-b border-gray-200/80 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <a
                  href="/"
                  className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors font-mono"
                >
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-2">
                    <LinkIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  The Daily Urlist
                </a>
                <div className="flex items-center gap-4">
                  <a
                    href="/lists"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors font-mono text-lg"
                  >
                    My Lists
                  </a>
                  <a
                    href="/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-mono text-lg"
                  >
                    Create New List
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-grow container mx-auto px-6 py-8">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200/80 py-8 mt-auto">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-2">
                    <LinkIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-600 font-mono">
                    © {new Date().getFullYear()} The Daily Urlist
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-mono"
                  >
                    About
                  </a>
                  <a
                    href="/privacy"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-mono"
                  >
                    Privacy
                  </a>
                  <a
                    href="/terms"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-mono"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
