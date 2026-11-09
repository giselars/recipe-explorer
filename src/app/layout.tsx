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
  title: {
    default: "Recipe Explorer",
    template: "%s | Recipe Explorer",
  },
  description: "Discover recipes for every table and occasion.",
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
