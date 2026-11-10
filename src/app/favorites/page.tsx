import type { Metadata } from "next";
import { FavoritesGrid } from "./_components";
import { DiscoveryPage } from "@/components/DiscoveryPage/DiscoveryPage";

export const metadata: Metadata = {
  title: "Favorite recipes",
  description: "Return to the Recipe Explorer recipes you saved for later.",
};

const FavoritesPage = () => {
  return (
    <DiscoveryPage
      eyebrow="Your recipe box"
      title="Favorite recipes"
      description="Keep the dishes you love close and return whenever inspiration strikes."
    >
      <FavoritesGrid />
    </DiscoveryPage>
  );
};

export default FavoritesPage;
