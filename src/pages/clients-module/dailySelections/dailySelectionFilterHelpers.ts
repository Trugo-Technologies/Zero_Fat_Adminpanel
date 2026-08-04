/** @format */

export type DailySelectionsFilterRequest = {
  search?: string;
  date?: string;
  dailySelectionStatus?: string;
  deliveryTime?: string;
  clientId?: string;
  pageNumber: number;
  pageSize: number;
};

/** Builds GET query params for `/DailySelections/filter`. */
export const buildDailySelectionsFilterRequest = (
  params: Record<string, unknown>
): DailySelectionsFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: DailySelectionsFilterRequest = {
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

  if (typeof params.date === "string" && params.date) {
    request.date = params.date;
  }

  if (
    typeof params.dailySelectionStatus === "string" &&
    params.dailySelectionStatus
  ) {
    request.dailySelectionStatus = params.dailySelectionStatus;
  }

  if (typeof params.deliveryTime === "string" && params.deliveryTime) {
    request.deliveryTime = params.deliveryTime;
  }

  if (typeof params.clientId === "string" && params.clientId) {
    request.clientId = params.clientId;
  }

  return request;
};
