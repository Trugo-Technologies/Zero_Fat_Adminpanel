/** @format */

import { ArgsType } from "src/types";

export const buildCustomizePricingSearchRequest = (
  params: Record<string, unknown> | ArgsType
) => {
  const source = params as Record<string, unknown> & ArgsType;
  const keyword =
    typeof source.keyword === "string"
      ? source.keyword.trim()
      : typeof source.search === "string"
        ? source.search.trim()
        : typeof source.searchValue === "string"
          ? source.searchValue.trim()
          : "";

  const request: Record<string, unknown> = {
    pageNumber:
      typeof source.pageNumber === "number" && source.pageNumber > 0
        ? source.pageNumber
        : 1,
    pageSize:
      typeof source.pageSize === "number" && source.pageSize > 0
        ? source.pageSize
        : 10,
  };

  if (keyword) {
    request.keyword = keyword;
  }

  if (Array.isArray(source.orderBy) && source.orderBy.length) {
    request.orderBy = source.orderBy;
  }

  if (typeof source.isActive === "boolean") {
    request.isActive = source.isActive;
  }

  if (typeof source.macro === "number") {
    request.macro = source.macro;
  }

  if (typeof source.mealPlanId === "string" && source.mealPlanId) {
    request.mealPlanId = source.mealPlanId;
  }

  return request;
};
