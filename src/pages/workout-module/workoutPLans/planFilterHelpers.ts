/** @format */

export const ALL_LEVELS = "All Levels";
export const ALL_ENVIRONMENTS = "All Environments";
export const ALL_STATUS = "All Status";
export const ALL_TRAINERS = "All Trainers";
export const ALL_PLAN_GOALS = "All Plan Goals";

export type PlanFilters = {
  level: string;
  environment: string;
  status: string;
  trainerId: string;
  planGoalId: string;
};

export const createDefaultPlanFilters = (): PlanFilters => ({
  level: ALL_LEVELS,
  environment: ALL_ENVIRONMENTS,
  status: ALL_STATUS,
  trainerId: ALL_TRAINERS,
  planGoalId: ALL_PLAN_GOALS,
});

export const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

/** Builds POST body for `/Plans/search`. */
export const buildPlansSearchRequest = (params: Record<string, unknown>) => {
  const keyword =
    typeof params.keyword === "string"
      ? params.keyword.trim()
      : typeof params.search === "string"
        ? params.search.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: Record<string, unknown> = {
    pageNumber:
      typeof params.pageNumber === "number" && params.pageNumber > 0
        ? params.pageNumber
        : 1,
    pageSize:
      typeof params.pageSize === "number" && params.pageSize > 0
        ? params.pageSize
        : 10,
  };

  if (keyword) {
    request.keyword = keyword;
  }

  if (Array.isArray(params.orderBy) && params.orderBy.length) {
    request.orderBy = params.orderBy;
  }

  if (typeof params.isActive === "boolean") {
    request.isActive = params.isActive;
  }

  if (typeof params.level === "string" && params.level) {
    request.level = params.level;
  }

  if (typeof params.environment === "string" && params.environment) {
    request.environment = params.environment;
  }

  if (typeof params.trainerId === "string" && params.trainerId) {
    request.trainerId = params.trainerId;
  }

  if (typeof params.planGoalId === "string" && params.planGoalId) {
    request.planGoalId = params.planGoalId;
  }

  return request;
};
