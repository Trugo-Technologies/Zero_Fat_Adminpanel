/** @format */

import { basicUnit, ingredientStatus } from "src/types/enums";

export const ALL_BASIC_UNITS = "All Basic Units";
export const ALL_STATUS = "All Status";
export const ALL_CATEGORIES = "All Categories";

export const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export const BASIC_UNIT_OPTIONS = [
  { value: basicUnit.Solid, labelKey: "ingredients.basicUnit.Solid" },
  { value: basicUnit.Liquid, labelKey: "ingredients.basicUnit.Liquid" },
] as const;

export const STATUS_OPTIONS = [
  {
    value: ingredientStatus.Available,
    labelKey: "ingredients.status.Available",
  },
  {
    value: ingredientStatus.OutOfStock,
    labelKey: "ingredients.status.OutOfStock",
  },
  {
    value: ingredientStatus.Discontinued,
    labelKey: "ingredients.status.Discontinued",
  },
] as const;

export type IngredientAppliedFilters = {
  categoryId: string;
  basicUnit: string;
  status: string;
};

export const createDefaultIngredientFilters = (): IngredientAppliedFilters => ({
  categoryId: ALL_CATEGORIES,
  basicUnit: ALL_BASIC_UNITS,
  status: ALL_STATUS,
});

export const buildIngredientFilterQueryParams = (
  filters: IngredientAppliedFilters
) => ({
  categoryId:
    filters.categoryId === ALL_CATEGORIES ? undefined : filters.categoryId,
  basicUnit:
    filters.basicUnit === ALL_BASIC_UNITS ? undefined : filters.basicUnit,
  status: filters.status === ALL_STATUS ? undefined : filters.status,
});

export type IngredientsFilterRequest = {
  search?: string;
  pageNumber: number;
  pageSize: number;
  categoryId?: string;
  basicUnit?: string;
  status?: string;
};

/** Builds GET query params for `/Ingredients/filter`. */
export const buildIngredientsFilterRequest = (
  params: Record<string, unknown>
): IngredientsFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: IngredientsFilterRequest = {
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

  if (typeof params.basicUnit === "string" && params.basicUnit) {
    request.basicUnit = params.basicUnit;
  }

  if (typeof params.status === "string" && params.status) {
    request.status = params.status;
  }

  return request;
};
