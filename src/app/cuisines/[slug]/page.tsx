import type { Metadata } from "next";
import { RecipeCollection } from "@/components/RecipeCollection/RecipeCollection";
import { recipeService } from "@/lib/recipes/recipe-service";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}

const countryNames: Record<string, string> = {
  American: "the United States",
  British: "the United Kingdom",
  Canadian: "Canada",
  Chinese: "China",
  Croatian: "Croatia",
  Dutch: "the Netherlands",
  Egyptian: "Egypt",
  Filipino: "the Philippines",
  French: "France",
  Greek: "Greece",
  Indian: "India",
  Irish: "Ireland",
  Italian: "Italy",
  Jamaican: "Jamaica",
  Japanese: "Japan",
  Kenyan: "Kenya",
  Malaysian: "Malaysia",
  Mexican: "Mexico",
  Moroccan: "Morocco",
  Norwegian: "Norway",
  Polish: "Poland",
  Portuguese: "Portugal",
  Russian: "Russia",
  Spanish: "Spain",
  Thai: "Thailand",
  Tunisian: "Tunisia",
  Turkish: "Türkiye",
  Ukrainian: "Ukraine",
  Uruguayan: "Uruguay",
  Vietnamese: "Vietnam",
};

const getCuisine = async (params: Props["params"]) => {
  const { slug } = await params;
  return decodeURIComponent(slug).trim();
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const cuisine = await getCuisine(params);

  return {
    title: `${cuisine} recipes`,
    description: `Explore recipes from the ${cuisine} cuisine collection.`,
  };
};

const CuisineRecipesPage = async ({ params, searchParams }: Props) => {
  const cuisine = await getCuisine(params);
  const [recipes, cuisines] = await Promise.all([
    recipeService.getRecipesByArea(cuisine),
    recipeService.getAreas().catch((): string[] => []),
  ]);
  const country = countryNames[cuisine] ?? cuisine;
  const relatedLinks = cuisines
    .filter((name) => name.toLocaleLowerCase() !== cuisine.toLocaleLowerCase())
    .slice(0, 5)
    .map((name) => ({
      label: name,
      href: `/cuisines/${encodeURIComponent(name)}`,
    }));

  return (
    <RecipeCollection
      name={cuisine}
      title={`A taste of ${country}`}
      waves
      eyebrow="Global cuisine"
      description="Explore recipes from this culinary collection and bring a new favorite to your table."
      recipes={recipes}
      requestedPage={(await searchParams).page}
      basePath={`/cuisines/${encodeURIComponent(cuisine)}`}
      backLink={{ label: "All cuisines", href: "/cuisines" }}
      relatedLinks={
        relatedLinks.length
          ? relatedLinks
          : [{ label: "All cuisines", href: "/cuisines" }]
      }
      emptyDescription="Try another cuisine to keep exploring."
      emptyLinkLabel="Browse cuisines"
    />
  );
};

export default CuisineRecipesPage;
