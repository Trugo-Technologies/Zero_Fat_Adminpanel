/** @format */

import {
  recipeDietaryCategories,
  recipesDifficulty,
} from "src/types/enums";

export const ALL_CATEGORIES = "All Categories";
export const ALL_DIFFICULTY = "All Difficulty";
export const ALL_DIETARY = "All Dietary Categories";

export const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export const DIFFICULTY_OPTIONS = [
  { value: recipesDifficulty.Easy, labelKey: "recipes.difficulty.Easy" },
  { value: recipesDifficulty.Medium, labelKey: "recipes.difficulty.Medium" },
  { value: recipesDifficulty.Hard, labelKey: "recipes.difficulty.Hard" },
] as const;

export const DIETARY_CATEGORY_OPTIONS = [
  {
    value: recipeDietaryCategories.Vegan,
    labelKey: "recipes.dietaryCategories.Vegan",
  },
  {
    value: recipeDietaryCategories.Vegetarian,
    labelKey: "recipes.dietaryCategories.Vegetarian",
  },
  {
    value: recipeDietaryCategories.Pescatarian,
    labelKey: "recipes.dietaryCategories.Pescatarian",
  },
  {
    value: recipeDietaryCategories.Omnivore,
    labelKey: "recipes.dietaryCategories.Omnivore",
  },
  {
    value: recipeDietaryCategories.None,
    labelKey: "recipes.dietaryCategories.None",
  },
] as const;

export type RecipeAppliedFilters = {
  categoryId: string;
  difficulty: string;
  dietaryCategory: string;
};

export const createDefaultRecipeFilters = (): RecipeAppliedFilters => ({
  categoryId: ALL_CATEGORIES,
  difficulty: ALL_DIFFICULTY,
  dietaryCategory: ALL_DIETARY,
});

export const buildRecipeFilterQueryParams = (
  filters: RecipeAppliedFilters
) => ({
  categoryId:
    filters.categoryId === ALL_CATEGORIES ? undefined : filters.categoryId,
  difficulty:
    filters.difficulty === ALL_DIFFICULTY ? undefined : filters.difficulty,
  dietaryCategory:
    filters.dietaryCategory === ALL_DIETARY
      ? undefined
      : filters.dietaryCategory,
});

export type RecipesFilterRequest = {
  search?: string;
  pageNumber: number;
  pageSize: number;
  categoryId?: string;
  difficulty?: string;
  dietaryCategory?: string;
};

/** Builds GET query params for `/Recipes/filter`. */
export const buildRecipesFilterRequest = (
  params: Record<string, unknown>
): RecipesFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: RecipesFilterRequest = {
    pageNumber:
      typeof params.pageNumber === "number" && params.pageNumber > 0
        ? params.pageNumber
        : 1,
    pageSize:
      typeof params.pageSize === "number" && params.pageSize > 0
        ? params.pageSize
        : 10,
  };

  if (search) {
    request.search = search;
  }

  if (typeof params.categoryId === "string" && params.categoryId) {
    request.categoryId = params.categoryId;
  }

  if (typeof params.difficulty === "string" && params.difficulty) {
    request.difficulty = params.difficulty;
  }

  if (typeof params.dietaryCategory === "string" && params.dietaryCategory) {
    request.dietaryCategory = params.dietaryCategory;
  }

  return request;
};
