/** @format */

import { IMealPlans, isCustomizeMealPlanRow } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import {
  ICustomMealInstance,
  ISubscriptionWizardMealTypeSelection,
} from "src/types/modules/clientsManagement/clientAccountAccess";
import { CustomizeMacroType, ICustomizePricingTier } from "src/types/modules/nutriplan/customizePricing";

/** @deprecated Prefer real Customize plan id from MealPlans API. */
export const CUSTOMIZE_PLAN_ID = "__customize__";

export const isCustomizePlan = (
  planId: string,
  plans: IMealPlans[] = []
) => {
  if (!planId) return false;
  if (planId === CUSTOMIZE_PLAN_ID) return true;
  const plan = plans.find((item) => item.id === planId);
  return isCustomizeMealPlanRow(plan);
};

export const findCustomizeMealPlan = (plans: IMealPlans[] = []) =>
  plans.find((plan) => isCustomizeMealPlanRow(plan)) || null;

/** Lookup price tier for a gram amount from API (or any) pricing list. */
export const findCustomizePrice = (
  tiers: ICustomizePricingTier[],
  macroType: CustomizeMacroType,
  grams: number,
  mealPlanId?: string | null,
  mealTypeId?: string | null
): ICustomizePricingTier | null => {
  const active = tiers.filter(
    (row) =>
      row.isActive &&
      row.macroType === macroType &&
      grams >= row.fromGrams &&
      grams <= row.toGrams
  );

  const specific = active.find(
    (row) =>
      (!mealPlanId || !row.mealPlanId || row.mealPlanId === mealPlanId) &&
      (!mealTypeId || !row.mealTypeId || row.mealTypeId === mealTypeId) &&
      (row.mealPlanId || row.mealTypeId)
  );

  if (specific) return specific;

  return (
    active.find((row) => !row.mealPlanId && !row.mealTypeId) ||
    active[0] ||
    null
  );
};

const getMealPlanMealTypes = (plan: IMealPlans) => plan.mealPlanMealTypes ?? [];

export const createCustomMealInstance = (
  mealType: Pick<IMealTypes, "id" | "nameEn">
): ICustomMealInstance => ({
  localId: `${mealType.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  mealTypeId: mealType.id,
  name: mealType.nameEn,
  proteinG: "",
  carbsG: "",
  fiberG: "",
});

/** Meal types hidden from Customize → Meals Per Day picker */
export const isExcludedCustomizeMealType = (
  mealType: Pick<IMealTypes, "nameEn" | "nameAr">
) => {
  const name = `${mealType.nameEn || ""} ${mealType.nameAr || ""}`.toLowerCase();
  return (
    name.includes("dessert") ||
    name.includes("salad") ||
    name.includes("حلوى") ||
    name.includes("سلطة")
  );
};

export const aggregateCustomMealsToSelections = (
  instances: ICustomMealInstance[]
): ISubscriptionWizardMealTypeSelection[] => {
  const byType = new Map<string, ISubscriptionWizardMealTypeSelection>();

  instances.forEach((instance) => {
    const existing = byType.get(instance.mealTypeId);
    if (existing) {
      existing.quantityPerDay += 1;
      return;
    }
    byType.set(instance.mealTypeId, {
      mealTypeId: instance.mealTypeId,
      name: instance.name,
      quantityPerDay: 1,
    });
  });

  return Array.from(byType.values());
};

/**
 * Group customized meals by meal type for API:
 * one selection row with quantityPerDay + macroInstances[].
 */
export const mapCustomMealsToSelectionRows = (
  instances: ICustomMealInstance[]
): ISubscriptionWizardMealTypeSelection[] => {
  const byType = new Map<string, ISubscriptionWizardMealTypeSelection>();

  instances.forEach((instance) => {
    const proteinGrams =
      typeof instance.proteinG === "number" ? instance.proteinG : 0;
    const carbsGrams =
      typeof instance.carbsG === "number" ? instance.carbsG : 0;
    const fiberGrams =
      typeof instance.fiberG === "number" ? instance.fiberG : 0;

    const macroInstance = { proteinGrams, carbsGrams, fiberGrams };
    const existing = byType.get(instance.mealTypeId);

    if (!existing) {
      byType.set(instance.mealTypeId, {
        mealTypeId: instance.mealTypeId,
        name: instance.name,
        quantityPerDay: 1,
        proteinGrams,
        carbsGrams,
        fiberGrams,
        macroInstances: [macroInstance],
      });
      return;
    }

    const macroInstances = [
      ...(existing.macroInstances || []),
      macroInstance,
    ];
    byType.set(instance.mealTypeId, {
      ...existing,
      quantityPerDay: macroInstances.length,
      proteinGrams: (existing.proteinGrams || 0) + proteinGrams,
      carbsGrams: (existing.carbsGrams || 0) + carbsGrams,
      fiberGrams: (existing.fiberGrams || 0) + fiberGrams,
      macroInstances,
    });
  });

  return Array.from(byType.values());
};

export const getCustomMealsTotalProtein = (
  instances: ICustomMealInstance[]
): number =>
  instances.reduce((sum, item) => {
    const value = typeof item.proteinG === "number" ? item.proteinG : 0;
    return sum + value;
  }, 0);

export const getCustomMealsTotalCarbs = (
  instances: ICustomMealInstance[]
): number =>
  instances.reduce((sum, item) => {
    const value = typeof item.carbsG === "number" ? item.carbsG : 0;
    return sum + value;
  }, 0);

export const getCustomMealsTotalFiber = (
  instances: ICustomMealInstance[]
): number =>
  instances.reduce((sum, item) => {
    const value = typeof item.fiberG === "number" ? item.fiberG : 0;
    return sum + value;
  }, 0);

export const CUSTOMIZE_MACRO_GRAMS_MIN = 50;
export const CUSTOMIZE_MACRO_GRAMS_MAX = 200;
/** @deprecated Use CUSTOMIZE_MACRO_GRAMS_MIN */
export const CUSTOMIZE_PROTEIN_GRAMS_MIN = CUSTOMIZE_MACRO_GRAMS_MIN;
/** @deprecated Use CUSTOMIZE_MACRO_GRAMS_MAX */
export const CUSTOMIZE_PROTEIN_GRAMS_MAX = CUSTOMIZE_MACRO_GRAMS_MAX;

const isRequiredMacroInRange = (value: number | "") =>
  typeof value === "number" &&
  value >= CUSTOMIZE_MACRO_GRAMS_MIN &&
  value <= CUSTOMIZE_MACRO_GRAMS_MAX;

/** True when user entered a number outside 50–200 (empty is not an error state). */
export const isCustomizeMacroOutOfRange = (value: number | "") =>
  typeof value === "number" &&
  (value < CUSTOMIZE_MACRO_GRAMS_MIN || value > CUSTOMIZE_MACRO_GRAMS_MAX);

export const getCustomMealsValidationMessage = (
  instances: ICustomMealInstance[]
): string | null => {
  if (instances.length === 0) {
    return "Please add at least one customized meal";
  }

  for (const item of instances) {
    // Out-of-range only when a value was entered
    if (isCustomizeMacroOutOfRange(item.proteinG)) {
      return `Protein per meal must be between ${CUSTOMIZE_MACRO_GRAMS_MIN} and ${CUSTOMIZE_MACRO_GRAMS_MAX}g (${item.name}: ${item.proteinG}g)`;
    }
    if (isCustomizeMacroOutOfRange(item.carbsG)) {
      return `Carbs per meal must be between ${CUSTOMIZE_MACRO_GRAMS_MIN} and ${CUSTOMIZE_MACRO_GRAMS_MAX}g (${item.name}: ${item.carbsG}g)`;
    }
    if (typeof item.fiberG === "number" && item.fiberG < 0) {
      return `Fiber cannot be negative (${item.name})`;
    }
  }

  // Incomplete (empty) — block Next, but no field-level "fail" styling
  const incomplete = instances.some(
    (item) => !isRequiredMacroInRange(item.proteinG) || !isRequiredMacroInRange(item.carbsG)
  );
  if (incomplete) {
    return "Enter protein and carbs (50–200g) for each customized meal";
  }

  return null;
};

export const areCustomMealsValid = (instances: ICustomMealInstance[]): boolean =>
  getCustomMealsValidationMessage(instances) === null;

/** Message shown under Macros summary — only for out-of-range fails, not empty fields. */
export const getCustomMealsRangeErrorMessage = (
  instances: ICustomMealInstance[]
): string | null => {
  for (const item of instances) {
    if (isCustomizeMacroOutOfRange(item.proteinG)) {
      return `Protein per meal must be between ${CUSTOMIZE_MACRO_GRAMS_MIN} and ${CUSTOMIZE_MACRO_GRAMS_MAX}g (${item.name}: ${item.proteinG}g)`;
    }
    if (isCustomizeMacroOutOfRange(item.carbsG)) {
      return `Carbs per meal must be between ${CUSTOMIZE_MACRO_GRAMS_MIN} and ${CUSTOMIZE_MACRO_GRAMS_MAX}g (${item.name}: ${item.carbsG}g)`;
    }
  }
  return null;
};

export type CustomMealPriceBreakdown = {
  proteinPrice: number;
  carbsPrice: number;
  total: number;
  currency: string;
};

export const getCustomMealInstancePrice = (
  instance: ICustomMealInstance,
  tiers: ICustomizePricingTier[] = [],
  mealPlanId?: string | null
): CustomMealPriceBreakdown => {
  const proteinG =
    typeof instance.proteinG === "number" ? instance.proteinG : 0;
  const carbsG = typeof instance.carbsG === "number" ? instance.carbsG : 0;

  const proteinTier = findCustomizePrice(
    tiers,
    CustomizeMacroType.Protein,
    proteinG,
    mealPlanId,
    instance.mealTypeId
  );
  const carbsTier = findCustomizePrice(
    tiers,
    CustomizeMacroType.Carbs,
    carbsG,
    mealPlanId,
    instance.mealTypeId
  );

  const proteinPrice = proteinG > 0 ? proteinTier?.price ?? 0 : 0;
  const carbsPrice = carbsG > 0 ? carbsTier?.price ?? 0 : 0;
  const currency =
    proteinTier?.currency || carbsTier?.currency || "AED";

  return {
    proteinPrice,
    carbsPrice,
    total: proteinPrice + carbsPrice,
    currency,
  };
};

export const getCustomMealsTotalPrice = (
  instances: ICustomMealInstance[],
  tiers: ICustomizePricingTier[] = [],
  mealPlanId?: string | null
): { total: number; currency: string } => {
  let total = 0;
  let currency = "AED";

  instances.forEach((instance) => {
    const breakdown = getCustomMealInstancePrice(instance, tiers, mealPlanId);
    total += breakdown.total;
    if (breakdown.currency) currency = breakdown.currency;
  });

  return { total, currency };
};

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
