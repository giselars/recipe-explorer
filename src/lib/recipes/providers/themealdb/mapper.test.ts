import { describe, expect, it } from "vitest";
import { toRecipe, toRecipeCategory, toRecipeSummary } from "./mapper";

describe("TheMealDB mappers", () => {
  it("normalizes a complete recipe and pairs ingredients with measures", () => {
    const recipe = toRecipe({
      idMeal: " 52772 ",
      strMeal: " Teriyaki Chicken Casserole ",
      strMealThumb: " https://example.com/chicken.jpg ",
      strCategory: " Chicken ",
      strArea: " Japanese ",
      strInstructions: " Bake until cooked through. ",
      strTags: "Meat, Casserole, ,Dinner ",
      strSource: " https://example.com/source ",
      strYoutube: " ",
      strIngredient1: " chicken ",
      strMeasure1: " 3 cups ",
      strIngredient2: " soy sauce ",
      strMeasure2: " ",
      strIngredient3: " ",
      strMeasure3: " ignored ",
    });

    expect(recipe).toEqual({
      id: "52772",
      name: "Teriyaki Chicken Casserole",
      imageUrl: "https://example.com/chicken.jpg",
      category: "Chicken",
      area: "Japanese",
      instructions: "Bake until cooked through.",
      ingredients: [
        { name: "chicken", measure: "3 cups" },
        { name: "soy sauce", measure: null },
      ],
      tags: ["Meat", "Casserole", "Dinner"],
      sourceUrl: "https://example.com/source",
      videoUrl: null,
    });
  });

  it("rejects records without required recipe fields", () => {
    expect(
      toRecipeSummary({
        idMeal: "52772",
        strMeal: "Missing image",
      }),
    ).toBeNull();
    expect(
      toRecipe({
        idMeal: "52772",
        strMeal: "Missing instructions",
        strMealThumb: "https://example.com/image.jpg",
      }),
    ).toBeNull();
  });

  it("uses the category name as an ID when TheMealDB has no category ID", () => {
    expect(
      toRecipeCategory({
        strCategory: "  Beef ",
        strCategoryDescription: " Rich recipes ",
        strCategoryThumb: " ",
      }),
    ).toEqual({
      id: "Beef",
      name: "Beef",
      description: "Rich recipes",
      imageUrl: null,
    });
  });
});
