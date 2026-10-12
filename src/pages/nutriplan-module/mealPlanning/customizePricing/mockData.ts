/** @format */

import {
  CustomizeMacro,
  CustomizeMacroType,
  ICustomizePricingTier,
} from "src/types/modules/nutriplan/customizePricing";

export const CUSTOMIZE_PRICING_MEAL_PLANS = [
  { id: "plan-weight-loss", nameEn: "Weight Loss", nameAr: "إنقاص الوزن" },
  { id: "plan-lifestyle", nameEn: "Lifestyle", nameAr: "نمط الحياة" },
  { id: "plan-muscle", nameEn: "Muscle Gain", nameAr: "بناء العضلات" },
];

export const CUSTOMIZE_PRICING_MEAL_TYPES = [
  { id: "mt-breakfast", nameEn: "Breakfast", nameAr: "الإفطار" },
  { id: "mt-lunch", nameEn: "Lunch", nameAr: "الغداء" },
  { id: "mt-dinner", nameEn: "Dinner", nameAr: "العشاء" },
  { id: "mt-snack", nameEn: "Snack", nameAr: "وجبة خفيفة" },
];

export let MOCK_CUSTOMIZE_PRICING: ICustomizePricingTier[] = [
  {
    id: "cp-p-001",
    macro: CustomizeMacro.Protein,
    macroType: CustomizeMacroType.Protein,
    fromGrams: 0,
    toGrams: 100,
    price: 25,
    currency: "AED",
    mealPlanId: null,
    mealPlanNameEn: null,
    mealTypeId: null,
    mealTypeNameEn: null,
    sortOrder: 1,
    isActive: true,
    createdOn: "2026-08-01T10:00:00Z",
    lastModifiedOn: "2026-08-01T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
  {
    id: "cp-p-002",
    macro: CustomizeMacro.Protein,
    macroType: CustomizeMacroType.Protein,
    fromGrams: 101,
    toGrams: 150,
    price: 35,
    currency: "AED",
    mealPlanId: null,
    mealPlanNameEn: null,
    mealTypeId: null,
    mealTypeNameEn: null,
    sortOrder: 2,
    isActive: true,
    createdOn: "2026-08-01T10:00:00Z",
    lastModifiedOn: "2026-08-01T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
  {
    id: "cp-p-003",
    macro: CustomizeMacro.Protein,
    macroType: CustomizeMacroType.Protein,
    fromGrams: 151,
    toGrams: 200,
    price: 45,
    currency: "AED",
    mealPlanId: null,
    mealPlanNameEn: null,
    mealTypeId: null,
    mealTypeNameEn: null,
    sortOrder: 3,
    isActive: true,
    createdOn: "2026-08-01T10:00:00Z",
    lastModifiedOn: "2026-08-01T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
  {
    id: "cp-c-001",
    macro: CustomizeMacro.Carbs,
    macroType: CustomizeMacroType.Carbs,
    fromGrams: 0,
    toGrams: 50,
    price: 15,
    currency: "AED",
    mealPlanId: null,
    mealPlanNameEn: null,
    mealTypeId: null,
    mealTypeNameEn: null,
    sortOrder: 1,
    isActive: true,
    createdOn: "2026-08-01T10:00:00Z",
    lastModifiedOn: "2026-08-01T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
  {
    id: "cp-c-002",
    macro: CustomizeMacro.Carbs,
    macroType: CustomizeMacroType.Carbs,
    fromGrams: 51,
    toGrams: 100,
    price: 22,
    currency: "AED",
    mealPlanId: "plan-weight-loss",
    mealPlanNameEn: "Weight Loss",
    mealTypeId: "mt-breakfast",
    mealTypeNameEn: "Breakfast",
    sortOrder: 2,
    isActive: true,
    createdOn: "2026-08-02T10:00:00Z",
    lastModifiedOn: "2026-08-02T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
  {
    id: "cp-c-003",
    macro: CustomizeMacro.Carbs,
    macroType: CustomizeMacroType.Carbs,
    fromGrams: 101,
    toGrams: 150,
    price: 30,
    currency: "AED",
    mealPlanId: null,
    mealPlanNameEn: null,
    mealTypeId: null,
    mealTypeNameEn: null,
    sortOrder: 3,
    isActive: false,
    createdOn: "2026-08-02T10:00:00Z",
    lastModifiedOn: "2026-08-10T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
];

export const upsertMockCustomizePricing = (item: ICustomizePricingTier) => {
  const index = MOCK_CUSTOMIZE_PRICING.findIndex((row) => row.id === item.id);
  if (index >= 0) {
    MOCK_CUSTOMIZE_PRICING[index] = item;
  } else {
    MOCK_CUSTOMIZE_PRICING = [item, ...MOCK_CUSTOMIZE_PRICING];
  }
};

export const removeMockCustomizePricing = (id: string) => {
  MOCK_CUSTOMIZE_PRICING = MOCK_CUSTOMIZE_PRICING.filter(
    (row) => row.id !== id
  );
};

/** Lookup price for a gram amount (used later by Customize subscription). */
export const findCustomizePrice = (
  macroType: CustomizeMacroType,
  grams: number,
  mealPlanId?: string | null,
  mealTypeId?: string | null
): ICustomizePricingTier | null => {
  const active = MOCK_CUSTOMIZE_PRICING.filter(
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
