import { afterEach, describe, expect, it, vi } from "vitest";
import { RecipeProviderError } from "../../recipe-provider";
import { createTheMealDbProvider } from "./themealdb-provider";

const recipeSummary = {
  idMeal: "52772",
  strMeal: "Teriyaki Chicken Casserole",
  strMealThumb: "https://www.themealdb.com/images/media/meals/example.jpg",
};

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("TheMealDB provider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("encodes normalized category filters and applies recipe caching", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        meals: [recipeSummary],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const recipes =
      await createTheMealDbProvider().getRecipesByCategory("  Beef & Pork  ");

    expect(recipes).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe(
      "https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef+%26+Pork",
    );
    expect(options).toEqual({ next: { revalidate: 3600 } });
  });

  it("does not request an empty filter", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createTheMealDbProvider().getRecipesByIngredient("   "),
    ).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("loads unique recipe summaries for a list of favorite IDs", async () => {
    const fetchMock = vi.fn().mockImplementation((url: URL) => {
      const id = url.searchParams.get("i");

      if (id === "404") {
        return Promise.resolve(jsonResponse({ meals: null }));
      }

      return Promise.resolve(
        jsonResponse({
          meals: [{ ...recipeSummary, idMeal: id, strMeal: `Recipe ${id}` }],
        }),
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const recipes = await createTheMealDbProvider().getRecipesByIds([
      " 52772 ",
      "52959",
      "52772",
      " ",
      "404",
    ]);

    expect(recipes.map((recipe) => recipe.id)).toEqual(["52772", "52959"]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(
      fetchMock.mock.calls.map(([url]) => (url as URL).toString()),
    ).toEqual([
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772",
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=52959",
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=404",
    ]);
  });

  it("treats a null meals list as an empty search result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ meals: null })),
    );

    await expect(
      createTheMealDbProvider().searchRecipes("nothing"),
    ).resolves.toEqual([]);
  });

  it("reads categories from the provider category envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          categories: [
            {
              strCategory: "Beef",
              strCategoryDescription: "Rich beef recipes",
              strCategoryThumb:
                "https://www.themealdb.com/images/category/beef.png",
            },
          ],
        }),
      ),
    );

    await expect(createTheMealDbProvider().getCategories()).resolves.toEqual([
      {
        id: "Beef",
        name: "Beef",
        description: "Rich beef recipes",
        imageUrl: "https://www.themealdb.com/images/category/beef.png",
      },
    ]);
  });

  it("rejects unsuccessful and malformed responses", async () => {
    const provider = createTheMealDbProvider();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 503)));

    await expect(provider.getCategories()).rejects.toThrow(RecipeProviderError);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ meals: [] })),
    );
    await expect(provider.getCategories()).rejects.toThrow(
      "TheMealDB returned an invalid response.",
    );
  });

  it("wraps network and invalid JSON failures", async () => {
    const provider = createTheMealDbProvider();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(provider.getCategories()).rejects.toThrow(
      "Unable to reach TheMealDB.",
    );

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("not json", { status: 200 })),
    );
    await expect(provider.getCategories()).rejects.toThrow(
      "TheMealDB returned invalid JSON.",
    );
  });
});
