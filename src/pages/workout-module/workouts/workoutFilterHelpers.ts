/** @format */

export const ALL_FORMATS = "All Formats";
export const ALL_LEVELS = "All Levels";
export const ALL_STATUS = "All Status";

export type WorkoutFilters = {
  format: string;
  level: string;
  status: string;
};

export const createDefaultWorkoutFilters = (): WorkoutFilters => ({
  format: ALL_FORMATS,
  level: ALL_LEVELS,
  status: ALL_STATUS,
});

export const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

/** Builds POST body for `/Workouts/search`. */
export const buildWorkoutsSearchRequest = (
  params: Record<string, unknown>
) => {
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

  if (typeof params.format === "string" && params.format) {
    request.format = params.format;
  }

  if (typeof params.trainerId === "string" && params.trainerId) {
    request.trainerId = params.trainerId;
  }

  if (typeof params.workoutTypeId === "string" && params.workoutTypeId) {
    request.workoutTypeId = params.workoutTypeId;
  }

  return request;
};
