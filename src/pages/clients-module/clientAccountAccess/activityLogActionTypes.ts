/** @format */

export const ACTIVITY_LOG_ACTION_TYPES = [
  { value: 0, id: "DeliveryMoved" },
  { value: 1, id: "MealPlanChanged" },
  { value: 2, id: "AdditionalItemAdded" },
  { value: 3, id: "DeliveryCancelled" },
  { value: 4, id: "DeliveryMethodChanged" },
  { value: 5, id: "MealsReplaced" },
  { value: 6, id: "ProfileUpdated" },
  { value: 7, id: "CutoffSettingsChanged" },
  { value: 8, id: "ClientBlocked" },
  { value: 9, id: "ClientUnblocked" },
] as const;

export type ActivityLogActionTypeId =
  (typeof ACTIVITY_LOG_ACTION_TYPES)[number]["id"];

export const ALL_ACTIVITY_LOG_ACTION_TYPES = "all" as const;

export type ActivityLogActionTypeFilter =
  | typeof ALL_ACTIVITY_LOG_ACTION_TYPES
  | `${(typeof ACTIVITY_LOG_ACTION_TYPES)[number]["value"]}`;

export const parseActivityLogActionTypeFilter = (
  actionType: ActivityLogActionTypeFilter
): number | undefined => {
  if (actionType === ALL_ACTIVITY_LOG_ACTION_TYPES) {
    return undefined;
  }

  return Number(actionType);
};
