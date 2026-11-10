import type { Metadata } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import { Footer, Header } from "@/components";
import { FavoritesProvider } from "@/features/favorites";
import "./globals.scss";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://recipe-explorer-gray.vercel.app"),
  ),
  title: {
    default: "Recipe Explorer",
    template: "%s | Recipe Explorer",
  },
  description: "Discover recipes for every table and occasion.",
  openGraph: {
    type: "website",
    siteName: "Recipe Explorer",
    locale: "en_US",
    images: [
      {
        url: "/images/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Recipe Explorer — recipes for every table.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/images/social-preview.png",
        alt: "Recipe Explorer — recipes for every table.",
      },
    ],
  },
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} ${caveat.variable}`}
    >
      <body>
        <FavoritesProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
};

export default RootLayout;
