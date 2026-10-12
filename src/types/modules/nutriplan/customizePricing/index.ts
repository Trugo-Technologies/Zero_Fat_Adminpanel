/** @format */

import {
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";

/** UI / display labels for macro */
export enum CustomizeMacroType {
  Protein = "Protein",
  Carbs = "Carbs",
}

/**
 * API `macro` enum on CustomizePricingTiers
 * Protein = 0, Carbs = 1
 */
export enum CustomizeMacro {
  Protein = 0,
  Carbs = 1,
}

export const customizeMacroToLabel = (
  macro: number | string | null | undefined
): CustomizeMacroType => {
  if (
    macro === CustomizeMacro.Carbs ||
    macro === CustomizeMacroType.Carbs ||
    macro === "1" ||
    macro === 1
  ) {
    return CustomizeMacroType.Carbs;
  }
  return CustomizeMacroType.Protein;
};

export const customizeMacroToApi = (
  macro: CustomizeMacroType | number | string
): CustomizeMacro => {
  if (
    macro === CustomizeMacroType.Carbs ||
    macro === CustomizeMacro.Carbs ||
    macro === "1" ||
    macro === 1
  ) {
    return CustomizeMacro.Carbs;
  }
  return CustomizeMacro.Protein;
};

/** API list/details item (flexible field names) */
export interface ICustomizePricingTier {
  id: string;
  /** API numeric enum */
  macro: number;
  /** UI convenience — mapped from `macro` */
  macroType: CustomizeMacroType;
  fromGrams: number;
  toGrams: number;
  price: number;
  mealPlanId: string | null;
  mealPlanNameEn?: string | null;
  mealPlanNameAr?: string | null;
  mealTypeId: string | null;
  mealTypeNameEn?: string | null;
  mealTypeNameAr?: string | null;
  isActive: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createdByName?: string;
  lastModifiedByName?: string;
  /** Legacy UI fields — not on API */
  currency?: string;
  sortOrder?: number;
}

export interface ICustomizePricingFormValues {
  macroType: CustomizeMacroType;
  fromGrams: number | "";
  toGrams: number | "";
  price: number | "";
  mealPlanId: string;
  mealTypeId: string;
  isActive: boolean;
}

export interface ICreateCustomizePricingDto {
  macro: number;
  fromGrams: number;
  toGrams: number;
  price: number;
  mealPlanId: string | null;
  mealTypeId: string | null;
  isActive: boolean;
}

export interface IUpdateCustomizePricingDto
  extends IBaseUpdateDto,
    ICreateCustomizePricingDto {}

export interface ICustomizePricingListDto
  extends IBaseResponseListDto<ICustomizePricingApiItem> {}

export interface ICustomizePricingDetailsDto
  extends IBaseResponseDetailsDto<ICustomizePricingApiItem> {}

export interface ICustomizePricingApiItem {
  id: string;
  macro?: number;
  fromGrams?: number;
  toGrams?: number;
  price?: number;
  mealPlanId?: string | null;
  mealPlanNameEn?: string | null;
  mealPlanNameAr?: string | null;
  mealTypeId?: string | null;
  mealTypeNameEn?: string | null;
  mealTypeNameAr?: string | null;
  isActive?: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createdByName?: string;
  lastModifiedByName?: string;
  [key: string]: unknown;
}

export const mapCustomizePricingApiToUi = (
  item: ICustomizePricingApiItem
): ICustomizePricingTier => {
  const macro = typeof item.macro === "number" ? item.macro : CustomizeMacro.Protein;
  return {
    id: item.id,
    macro,
    macroType: customizeMacroToLabel(macro),
    fromGrams: Number(item.fromGrams ?? 0),
    toGrams: Number(item.toGrams ?? 0),
    price: Number(item.price ?? 0),
    mealPlanId: item.mealPlanId || null,
    mealPlanNameEn: item.mealPlanNameEn || null,
    mealPlanNameAr: item.mealPlanNameAr || null,
    mealTypeId: item.mealTypeId || null,
    mealTypeNameEn: item.mealTypeNameEn || null,
    mealTypeNameAr: item.mealTypeNameAr || null,
    isActive: !!item.isActive,
    createdOn: item.createdOn,
    lastModifiedOn: item.lastModifiedOn,
    createdByName: item.createdByName,
    lastModifiedByName: item.lastModifiedByName,
    currency: "AED",
  };
};

export const mapFormToCustomizePricingPayload = (
  data: ICustomizePricingFormValues
): ICreateCustomizePricingDto => ({
  macro: customizeMacroToApi(data.macroType),
  fromGrams: typeof data.fromGrams === "number" ? data.fromGrams : 0,
  toGrams: typeof data.toGrams === "number" ? data.toGrams : 0,
  price: typeof data.price === "number" ? data.price : 0,
  // Meal plan / meal type temporarily disabled in UI
  mealPlanId: null,
  mealTypeId: null,
  isActive: !!data.isActive,
});
