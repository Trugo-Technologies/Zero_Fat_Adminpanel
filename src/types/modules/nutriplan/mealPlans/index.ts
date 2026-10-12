import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { IMealTypes } from "../mealTypes";

export interface IMealPlansListDto extends IBaseResponseListDto<IMealPlans> {}

/** Shared Step 1 fields for regular + customize meal plans */
export interface IMealPlanBasicFormFields {
  nameAr: string;
  nameEn: string;
  code: string;
  defaultDietitianGoal: string;
  descriptionEn: string;
  descriptionAr: string;
  mainImage?: string | File;
  isActive: boolean;
}

export interface IMacroGramsCalories {
  grams: number | null;
  calories: number | null;
}

export interface ICreateCustomizeMealPlanDto extends IMealPlanBasicFormFields {
  /** UI flag — not always required by API */
  isCustomize?: true;
  /** Meal types available on this customize plan only */
  mealTypes: IMealTypes[];
  mealTypeIds: string[];
  protein: IMacroGramsCalories;
  carbs: IMacroGramsCalories;
  fiber: IMacroGramsCalories;
}

export interface ICreateMealPlanDto extends IMealPlanBasicFormFields {
  carbPercentage: number | null;
  proteinPercentage: number | null;
  fatPercentage: number | null;
  images?: Array<string | File>;
  mealTypes: Array<{
    mealType: IMealTypes | null;
    mealTypeId: string;
    averageCalories: number | null;
    price: number | null;
  }>;
  /** Customize plan macros (same MealPlans POST/PUT) */
  proteinGrams?: number | null;
  carbsGrams?: number | null;
  fiberGrams?: number | null;
  proteinCalories?: number | null;
  carbsCalories?: number | null;
  fiberCalories?: number | null;
}

export interface IUpdateMealPlanDto extends IBaseUpdateDto, ICreateMealPlanDto {
  imageUrl: string;
}

export interface IMealPlansDetailsDto
  extends IBaseResponseDetailsDto<IMealPlans> {}

export interface IMealPlans extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  descriptionEn: string;
  descriptionAr: string;
  defaultDietitianGoal: string;
  carbPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
  MealPlans: Array<IMealPlans>;
  mainImageUrl: string | null;
  imageUrl: string;
  images: Array<string>;
  isActive: boolean;
  /** Present when this row is the Customize meal plan */
  isCustomize?: boolean;
  proteinGrams?: number | null;
  carbsGrams?: number | null;
  fiberGrams?: number | null;
  proteinCalories?: number | null;
  carbsCalories?: number | null;
  fiberCalories?: number | null;
  protein?: IMacroGramsCalories;
  carbs?: IMacroGramsCalories;
  fiber?: IMacroGramsCalories;
  mealPlanMealTypes: Array<{
    mealType: IMealTypes | null;
    mealTypeId: string;
    averageCalories: number | null;
    price: number | null;
  }>;
}

export const isCustomizeMealPlanRow = (
  plan?: Pick<IMealPlans, "isCustomize" | "code" | "nameEn" | "nameAr"> | null
) => {
  if (!plan) return false;
  if (plan.isCustomize) return true;
  if ((plan.code || "").toUpperCase() === "CUSTOMIZE") return true;
  const name = `${plan.nameEn || ""} ${plan.nameAr || ""}`.toLowerCase();
  return name.includes("customize") || name.includes("مخصص");
};

const toNullableNumber = (value: number | null | undefined) =>
  typeof value === "number" && !Number.isNaN(value) ? value : null;

/** Map Customize form → MealPlans POST/PUT body (same endpoint as regular plans). */
export const mapCustomizeFormToMealPlanPayload = (
  data: ICreateCustomizeMealPlanDto,
  options?: { id?: string; imageUrl?: string }
) => {
  const mealTypes = (data.mealTypes || []).map((mealType) => ({
    mealTypeId: mealType.id,
    mealType,
    averageCalories: null as number | null,
    price: null as number | null,
  }));

  return {
    ...(options?.id ? { id: options.id } : {}),
    nameEn: data.nameEn?.trim() || "",
    nameAr: data.nameAr?.trim() || "",
    descriptionEn: data.descriptionEn || "",
    descriptionAr: data.descriptionAr || "",
    code: data.code?.trim() || "CUSTOMIZE",
    defaultDietitianGoal: data.defaultDietitianGoal || "",
    mainImage: data.mainImage,
    ...(options?.imageUrl != null ? { imageUrl: options.imageUrl } : {}),
    carbPercentage: null as number | null,
    proteinPercentage: null as number | null,
    fatPercentage: null as number | null,
    proteinGrams: toNullableNumber(data.protein?.grams),
    carbsGrams: toNullableNumber(data.carbs?.grams),
    fiberGrams: toNullableNumber(data.fiber?.grams),
    proteinCalories: toNullableNumber(data.protein?.calories),
    carbsCalories: toNullableNumber(data.carbs?.calories),
    fiberCalories: toNullableNumber(data.fiber?.calories),
    isActive: !!data.isActive,
    mealTypes,
  };
};

export const mapMealPlanApiMacrosToForm = (
  plan?: IMealPlans | null
): {
  protein: IMacroGramsCalories;
  carbs: IMacroGramsCalories;
  fiber: IMacroGramsCalories;
} => ({
  protein: {
    grams: toNullableNumber(plan?.proteinGrams ?? plan?.protein?.grams),
    calories: toNullableNumber(
      plan?.proteinCalories ?? plan?.protein?.calories
    ),
  },
  carbs: {
    grams: toNullableNumber(plan?.carbsGrams ?? plan?.carbs?.grams),
    calories: toNullableNumber(plan?.carbsCalories ?? plan?.carbs?.calories),
  },
  fiber: {
    grams: toNullableNumber(plan?.fiberGrams ?? plan?.fiber?.grams),
    calories: toNullableNumber(plan?.fiberCalories ?? plan?.fiber?.calories),
  },
});
