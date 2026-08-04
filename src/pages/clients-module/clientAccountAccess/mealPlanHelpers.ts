/** @format */

import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";

const getMealPlanMealTypes = (plan: IMealPlans) => plan.mealPlanMealTypes ?? [];

export const getMealPlanTotalCalories = (plan: IMealPlans) =>
  getMealPlanMealTypes(plan).reduce(
    (sum, item) => sum + (item.averageCalories ?? 0),
    0
  );

export const getMealPlanMealTypesCount = (plan: IMealPlans) =>
  getMealPlanMealTypes(plan).length;

export const getMealPlanVariantCounts = (
  plan: IMealPlans | undefined
): number[] => {
  if (!plan) return [];

  const count = getMealPlanMealTypesCount(plan);
  return Array.from({ length: count }, (_, index) => index + 1);
};

export const getMealPlanAvailableMealTypes = (
  plan: IMealPlans | undefined
): IMealTypes[] => {
  if (!plan) return [];

  return getMealPlanMealTypes(plan)
    .filter((item) => item.mealType)
    .map((item) => item.mealType!);
};

export type MealPlanMealTypeOption = {
  mealType: IMealTypes;
  averageCalories: number;
};

export const getMealPlanMealTypeOptions = (
  plan: IMealPlans | undefined
): MealPlanMealTypeOption[] => {
  if (!plan) return [];

  return getMealPlanMealTypes(plan)
    .filter((item) => item.mealType)
    .map((item) => ({
      mealType: item.mealType!,
      averageCalories: item.averageCalories ?? 0,
    }));
};

export const getSelectedMealTypesTotalCalories = (
  plan: IMealPlans | undefined,
  selectedMealTypeIds: string[]
): number => {
  if (!plan || !selectedMealTypeIds.length) return 0;

  const selectedIds = new Set(selectedMealTypeIds);

  return getMealPlanMealTypes(plan)
    .filter((item) => selectedIds.has(item.mealType?.id ?? item.mealTypeId))
    .reduce((sum, item) => sum + (item.averageCalories ?? 0), 0);
};

export const getMealTypeSelectionsTotalCalories = (
  plan: IMealPlans | undefined,
  selections: { mealTypeId: string; quantityPerDay: number }[]
): number => {
  if (!plan || !selections.length) return 0;

  const qtyById = new Map(
    selections.map((selection) => [selection.mealTypeId, selection.quantityPerDay])
  );

  return getMealPlanMealTypes(plan)
    .filter((item) => qtyById.has(item.mealType?.id ?? item.mealTypeId))
    .reduce((sum, item) => {
      const id = item.mealType?.id ?? item.mealTypeId;
      const quantity = qtyById.get(id) ?? 1;
      return sum + (item.averageCalories ?? 0) * quantity;
    }, 0);
};

export const getMealTypeSelectionsTotalQuantity = (
  selections: { quantityPerDay: number }[]
): number =>
  selections.reduce((sum, selection) => sum + (selection.quantityPerDay || 0), 0);
