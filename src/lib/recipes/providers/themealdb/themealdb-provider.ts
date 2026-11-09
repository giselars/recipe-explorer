import type { RecipeSummary } from "@/models/recipe";
import {
  RecipeProviderError,
  type RecipeProvider,
} from "../../recipe-provider";
import {
  toListValue,
  toRecipe,
  toRecipeCategory,
  toRecipeSummary,
} from "./mapper";

type TheMealDbRecord = Record<string, unknown>;

const baseUrl = "https://www.themealdb.com/api/json/v1/1/";
const listRevalidate = 60 * 60 * 24;
const recipeRevalidate = 60 * 60;
const maxSearchLength = 100;

const isRecord = (value: unknown): value is TheMealDbRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getRecords = (
  payload: unknown,
  key: "meals" | "categories",
): TheMealDbRecord[] | null => {
  if (!isRecord(payload) || !(key in payload)) {
    throw new RecipeProviderError("TheMealDB returned an invalid response.");
  }

  const records = payload[key];

  if (records === null) {
    return null;
  }

  if (!Array.isArray(records) || !records.every(isRecord)) {
    throw new RecipeProviderError(
      "TheMealDB returned an invalid records list.",
    );
  }

  return records;
};

const createUrl = (path: string, parameter?: [string, string]): URL => {
  const url = new URL(path, baseUrl);

  if (parameter !== undefined) {
    url.searchParams.set(...parameter);
  }

  return url;
};

const requestMeals = async (
  url: URL,
  revalidate: number | 0,
  key: "meals" | "categories" = "meals",
): Promise<TheMealDbRecord[] | null> => {
  let response: Response;

  try {
    response = await fetch(url, { next: { revalidate } });
  } catch {
    throw new RecipeProviderError("Unable to reach TheMealDB.");
  }

  if (!response.ok) {
    throw new RecipeProviderError(
      `TheMealDB request failed with status ${response.status}.`,
    );
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new RecipeProviderError("TheMealDB returned invalid JSON.");
  }

  return getRecords(payload, key);
};

const mapRequired = <Result>(
  records: TheMealDbRecord[],
  mapRecord: (record: TheMealDbRecord) => Result | null,
): Result[] => {
  const results: Result[] = [];

  for (const record of records) {
    const result = mapRecord(record);

    if (result === null) {
      throw new RecipeProviderError("TheMealDB returned an incomplete record.");
    }

    results.push(result);
  }

  return results;
};

const getSummaries = async (
  path: string,
  parameter: [string, string],
  revalidate = recipeRevalidate,
): Promise<RecipeSummary[]> => {
  if (parameter[1].length === 0) {
    return [];
  }

  const meals = await requestMeals(createUrl(path, parameter), revalidate);
  return meals === null ? [] : mapRequired(meals, toRecipeSummary);
};

export const createTheMealDbProvider = (): RecipeProvider => ({
  async getRecipeById(id) {
    const normalizedId = id.trim();

    if (normalizedId.length === 0) {
      return null;
    }

    const meals = await requestMeals(
      createUrl("lookup.php", ["i", normalizedId]),
      recipeRevalidate,
    );

    if (meals === null) {
      return null;
    }

    const [meal] = mapRequired(meals, toRecipe);
    return meal ?? null;
  },

  async getRecipesByIds(ids) {
    const normalizedIds = Array.from(
      new Set(ids.map((id) => id.trim()).filter(Boolean)),
    );
    const recipes = await Promise.all(
      normalizedIds.map(async (id) => {
        const meals = await requestMeals(
          createUrl("lookup.php", ["i", id]),
          recipeRevalidate,
        );

        if (meals === null) {
          return null;
        }

        const [recipe] = mapRequired(meals, toRecipeSummary);
        return recipe ?? null;
      }),
    );

    return recipes.filter((recipe) => recipe !== null);
  },

  async searchRecipes(query) {
    const normalizedQuery = query.trim().slice(0, maxSearchLength);

    if (normalizedQuery.length === 0) {
      return [];
    }

    return getSummaries("search.php", ["s", normalizedQuery], 0);
  },

  async getCategories() {
    const meals = await requestMeals(
      createUrl("categories.php"),
      listRevalidate,
      "categories",
    );
    return meals === null ? [] : mapRequired(meals, toRecipeCategory);
  },

  async getRecipesByCategory(category) {
    return getSummaries("filter.php", ["c", category.trim()]);
  },

  async getAreas() {
    const meals = await requestMeals(
      createUrl("list.php", ["a", "list"]),
      listRevalidate,
    );

    if (meals === null) {
      return [];
    }

    return Array.from(
      new Set(mapRequired(meals, (meal) => toListValue(meal, "strArea"))),
    );
  },

  async getIngredients() {
    const meals = await requestMeals(
      createUrl("list.php", ["i", "list"]),
      listRevalidate,
    );

    return meals === null
      ? []
      : mapRequired(meals, (meal) => toListValue(meal, "strIngredient"));
  },

  async getRecipesByArea(area) {
    return getSummaries("filter.php", ["a", area.trim()]);
  },

  async getRecipesByIngredient(ingredient) {
    return getSummaries("filter.php", ["i", ingredient.trim()]);
  },

  async getRandomRecipe() {
    const meals = await requestMeals(createUrl("random.php"), 0);

    if (meals === null) {
      throw new RecipeProviderError("TheMealDB returned no random recipe.");
    }

    const [meal] = mapRequired(meals, toRecipe);

    if (meal === undefined) {
      throw new RecipeProviderError("TheMealDB returned no random recipe.");
    }

    return meal;
  },
});
