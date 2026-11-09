import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { RecipeSummary } from "@/models/recipe";
import { RecipeCollection } from "./RecipeCollection";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    createElement("img", { src, alt }),
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode; href: string }) =>
    createElement("a", props, children),
}));
vi.mock("./CollectionRecipeCard", () => ({
  CollectionRecipeCard: ({ recipe }: { recipe: RecipeSummary }) =>
    createElement("article", null, recipe.name),
}));

const recipes: RecipeSummary[] = Array.from({ length: 7 }, (_, index) => ({
  id: String(index),
  name: `Recipe ${index}`,
  imageUrl: `https://www.themealdb.com/images/recipe-${index}.jpg`,
  category: null,
}));
const render = (items: RecipeSummary[], requestedPage?: string) =>
  renderToStaticMarkup(
    <RecipeCollection
      name="Garlic"
      eyebrow="Ingredient spotlight"
      description="Discover dishes that start with this kitchen staple."
      recipes={items}
      requestedPage={requestedPage}
      basePath="/ingredients/Garlic"
      backLink={{ label: "Explore ingredients", href: "/#ingredients" }}
      relatedLinks={[]}
      emptyDescription="Try another ingredient."
      emptyLinkLabel="Explore ingredients"
    />,
  );

describe("recipe collection rendering", () => {
  it("shows an empty state and return link without images or pagination", () => {
    const html = render([]);
    expect(html).toContain("No recipes on the menu yet");
    expect(html).toContain('href="/#ingredients"');
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<article");
    expect(html).not.toContain('aria-label="Recipe pages"');
    expect(html).not.toContain("Keep discovering");
  });

  it("shows one hero image and recipe without pagination for a single result", () => {
    const html = render(recipes.slice(0, 1));
    expect(html.match(/<img /g)).toHaveLength(1);
    expect(html.match(/<article>/g)).toHaveLength(1);
    expect(html).toContain("Recipe 0");
    expect(html).not.toContain('aria-label="Recipe pages"');
  });

  it("keeps hero images stable while showing the final incomplete page", () => {
    const html = render(recipes, "2");
    expect(html).toContain(recipes[0].imageUrl);
    expect(html).toContain(recipes[1].imageUrl);
    expect(html.match(/<article>/g)).toHaveLength(2);
    expect(html).toContain("Recipe 5");
    expect(html).toContain("Recipe 6");
    expect(html).not.toContain("<article>Recipe 0");
    expect(html).toContain(
      'href="/ingredients/Garlic?page=1#recipe-collection"',
    );
    expect(html).toContain('aria-current="page"');
    expect(html).not.toContain('aria-label="Next page"');
  });
});
