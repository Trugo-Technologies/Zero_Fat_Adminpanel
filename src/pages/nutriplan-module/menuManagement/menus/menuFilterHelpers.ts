/** @format */

export const ALL_PUBLISH_STATUS = "All Status";

export const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export const dateInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export type MenuAppliedFilters = {
  publishStatus: string;
  startDateFrom: string;
  startDateTo: string;
  endDateFrom: string;
  endDateTo: string;
};

export const createDefaultMenuFilters = (): MenuAppliedFilters => ({
  publishStatus: ALL_PUBLISH_STATUS,
  startDateFrom: "",
  startDateTo: "",
  endDateFrom: "",
  endDateTo: "",
});

export const buildMenuFilterQueryParams = (filters: MenuAppliedFilters) => ({
  isPublished:
    filters.publishStatus === "Published"
      ? true
      : filters.publishStatus === "Unpublished"
        ? false
        : undefined,
  startDateFrom: filters.startDateFrom || undefined,
  startDateTo: filters.startDateTo || undefined,
  endDateFrom: filters.endDateFrom || undefined,
  endDateTo: filters.endDateTo || undefined,
});

export type MenusFilterRequest = {
  search?: string;
  isPublished?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  pageNumber: number;
  pageSize: number;
};

/** Builds GET query params for `/Menus/filter`. */
export const buildMenusFilterRequest = (
  params: Record<string, unknown>
): MenusFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: MenusFilterRequest = {
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

  if (typeof params.isPublished === "boolean") {
    request.isPublished = params.isPublished;
  }

  if (typeof params.startDateFrom === "string" && params.startDateFrom) {
    request.startDateFrom = params.startDateFrom;
  }

  if (typeof params.startDateTo === "string" && params.startDateTo) {
    request.startDateTo = params.startDateTo;
  }

  if (typeof params.endDateFrom === "string" && params.endDateFrom) {
    request.endDateFrom = params.endDateFrom;
  }

  if (typeof params.endDateTo === "string" && params.endDateTo) {
    request.endDateTo = params.endDateTo;
  }

  return request;
};
