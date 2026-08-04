/** @format */

import dayjs from "dayjs";
import { mealPlansDefaultDietitianGoal } from "src/types/enums";

export const ALL_DIETITIAN_GOALS = "All Dietitian Goals";
export const ALL_MEAL_PLANS = "All Meal Plans";
export const ALL_DATE_PERIODS = "All Time";
export const ALL_STATUS = "All Status";

export type DatePeriod =
  | typeof ALL_DATE_PERIODS
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

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

export const DATE_PERIOD_OPTIONS = [
  { value: "weekly", labelKey: "common.weekly" },
  { value: "monthly", labelKey: "common.monthly" },
  { value: "yearly", labelKey: "common.yearly" },
  { value: "custom", labelKey: "common.customDateRange" },
] as const;

export const DIETITIAN_GOAL_OPTIONS = [
  {
    value: mealPlansDefaultDietitianGoal.BuildMuscles,
    labelKey: "defaultDietitianGoal.type.BuildMuscles",
  },
  {
    value: mealPlansDefaultDietitianGoal.GainWeight,
    labelKey: "defaultDietitianGoal.type.GainWeight",
  },
  {
    value: mealPlansDefaultDietitianGoal.GeneralHealth,
    labelKey: "defaultDietitianGoal.type.GeneralHealth",
  },
  {
    value: mealPlansDefaultDietitianGoal.LoseWeight,
    labelKey: "defaultDietitianGoal.type.LoseWeight",
  },
  {
    value: mealPlansDefaultDietitianGoal.LoseFat,
    labelKey: "defaultDietitianGoal.type.LoseFat",
  },
] as const;

export type MealPlanListFilters = {
  status: string;
};

export type MealPlanExportFilters = {
  datePeriod: DatePeriod;
  startDate: string;
  endDate: string;
  mealPlanId: string;
  defaultDietitianGoal: string;
};

export const createDefaultMealPlanListFilters = (): MealPlanListFilters => ({
  status: ALL_STATUS,
});

export const createDefaultMealPlanExportFilters = (): MealPlanExportFilters => ({
  datePeriod: ALL_DATE_PERIODS,
  startDate: "",
  endDate: "",
  mealPlanId: ALL_MEAL_PLANS,
  defaultDietitianGoal: ALL_DIETITIAN_GOALS,
});

export const resolveDatePeriodRange = (
  period: DatePeriod,
  customStart = "",
  customEnd = ""
): { startDate?: string; endDate?: string } => {
  const today = dayjs();

  switch (period) {
    case "weekly":
      return {
        startDate: today.startOf("week").format("YYYY-MM-DD"),
        endDate: today.endOf("week").format("YYYY-MM-DD"),
      };
    case "monthly":
      return {
        startDate: today.startOf("month").format("YYYY-MM-DD"),
        endDate: today.endOf("month").format("YYYY-MM-DD"),
      };
    case "yearly":
      return {
        startDate: today.startOf("year").format("YYYY-MM-DD"),
        endDate: today.endOf("year").format("YYYY-MM-DD"),
      };
    case "custom":
      return {
        startDate: customStart || undefined,
        endDate: customEnd || undefined,
      };
    default:
      return {};
  }
};

export const buildMealPlanListFilterQueryParams = (
  filters: MealPlanListFilters
) => ({
  isActive:
    filters.status === "Active"
      ? true
      : filters.status === "Inactive"
        ? false
        : undefined,
});

/** Builds POST body for `/MealPlans/search`. */
export const buildMealPlansSearchRequest = (
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

  return request;
};

export const buildMealPlanExportParams = (
  filters: MealPlanExportFilters
): Record<string, string> => {
  const { startDate, endDate } = resolveDatePeriodRange(
    filters.datePeriod,
    filters.startDate,
    filters.endDate
  );
  const params: Record<string, string> = {};

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (filters.mealPlanId !== ALL_MEAL_PLANS) {
    params.mealPlanId = filters.mealPlanId;
  }
  if (filters.defaultDietitianGoal !== ALL_DIETITIAN_GOALS) {
    params.defaultDietitianGoal = filters.defaultDietitianGoal;
  }

  return params;
};
