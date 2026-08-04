/** @format */

export const ALL_STATUS = "All Status";
export const ALL_TYPES = "All Types";

export const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export type MealAppliedFilters = {
  status: string;
  addOn: string;
  priceMin: string;
  priceMax: string;
};

export const createDefaultMealFilters = (): MealAppliedFilters => ({
  status: ALL_STATUS,
  addOn: ALL_TYPES,
  priceMin: "",
  priceMax: "",
});

const parsePrice = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

export const buildMealFilterQueryParams = (filters: MealAppliedFilters) => ({
  isActive:
    filters.status === "Active"
      ? true
      : filters.status === "Inactive"
        ? false
        : undefined,
  isAddOn:
    filters.addOn === "AddOn"
      ? true
      : filters.addOn === "Regular"
        ? false
        : undefined,
  priceMin: parsePrice(filters.priceMin),
  priceMax: parsePrice(filters.priceMax),
});

export type MealsFilterRequest = {
  search?: string;
  pageNumber: number;
  pageSize: number;
  priceMin?: number;
  priceMax?: number;
  isAddOn?: boolean;
  isActive?: boolean;
};

/** Builds GET query params for `/Meals/filter`. */
export const buildMealsFilterRequest = (
  params: Record<string, unknown>
): MealsFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: MealsFilterRequest = {
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

  if (typeof params.priceMin === "number") {
    request.priceMin = params.priceMin;
  }

  if (typeof params.priceMax === "number") {
    request.priceMax = params.priceMax;
  }

  if (typeof params.isAddOn === "boolean") {
    request.isAddOn = params.isAddOn;
  }

  if (typeof params.isActive === "boolean") {
    request.isActive = params.isActive;
  }

  return request;
};
