/** @format */

export type CustomizationOptionsFilterRequest = {
  search?: string;
  groupId?: string;
  mealId?: string;
  pageNumber: number;
  pageSize: number;
};

/** Builds GET query params for `/CustomizationOptions/filter`. */
export const buildCustomizationOptionsFilterRequest = (
  params: Record<string, unknown>
): CustomizationOptionsFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: CustomizationOptionsFilterRequest = {
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

  if (typeof params.groupId === "string" && params.groupId) {
    request.groupId = params.groupId;
  }

  if (typeof params.mealId === "string" && params.mealId) {
    request.mealId = params.mealId;
  }

  return request;
};
