import type {
  Ingredient,
  Recipe,
  RecipeCategory,
  RecipeSummary,
} from "@/models/recipe";

type TheMealDbRecord = Record<string, unknown>;

const normalizeText = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
};

const requiredText = (
  record: TheMealDbRecord,
  field: string,
): string | null => {
  return normalizeText(record[field]);
};

const getIngredients = (meal: TheMealDbRecord): Ingredient[] => {
  return Array.from({ length: 20 }, (_, index) => index + 1).flatMap(
    (index) => {
      const name = normalizeText(meal[`strIngredient${index}`]);

      if (name === null) {
        return [];
      }

      return [{ name, measure: normalizeText(meal[`strMeasure${index}`]) }];
    },
  );
};

const getTags = (value: unknown): string[] => {
  const tags = normalizeText(value);

  return tags === null
    ? []
    : tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
};

export const toRecipeSummary = (
  meal: TheMealDbRecord,
): RecipeSummary | null => {
  const id = requiredText(meal, "idMeal");
  const name = requiredText(meal, "strMeal");
  const imageUrl = requiredText(meal, "strMealThumb");

  if (id === null || name === null || imageUrl === null) {
    return null;
  }

  return {
    id,
    name,
    imageUrl,
    category: normalizeText(meal.strCategory),
  };
};

export const toRecipe = (meal: TheMealDbRecord): Recipe | null => {
  const summary = toRecipeSummary(meal);
  const instructions = requiredText(meal, "strInstructions");

  if (summary === null || instructions === null) {
    return null;
  }

  return {
    ...summary,
    area: normalizeText(meal.strArea),
    instructions,
    ingredients: getIngredients(meal),
    tags: getTags(meal.strTags),
    sourceUrl: normalizeText(meal.strSource),
    videoUrl: normalizeText(meal.strYoutube),
  };
};

export const toRecipeCategory = (
  category: TheMealDbRecord,
): RecipeCategory | null => {
  const name = requiredText(category, "strCategory");

  if (name === null) {
    return null;
  }

  return {
    // TheMealDB does not provide a category ID, so the stable category name is its ID.
    id: name,
    name,
    description: normalizeText(category.strCategoryDescription),
    imageUrl: normalizeText(category.strCategoryThumb),
  };
};

export const toListValue = (
  record: TheMealDbRecord,
  field: string,
): string | null => normalizeText(record[field]);
