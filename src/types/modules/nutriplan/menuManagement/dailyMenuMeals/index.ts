/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { IMealPlans } from "../../mealPlans";

export interface IDailyMenuMealsListDto
  extends IBaseResponseListDto<IDailyMenuMeals> {}

export interface ICreateDailyMenuMealsDto {
  // nameAr: string;
  // nameEn: string;
  date: string;
  // recipeId: string;
  mealPlanId: string;
  mealTypeId: string;
  menuId: string;
  mealId: string;
  isDefault: boolean;
  /** Required for Customize meal plan (Protein | Carbs | Fiber). */
  macroCategory?: string;
  // image: string;
}

export interface ICreateDailyMenuMealsMultiDto {
  mealIds: string[];
  menuId: string;
  mealPlanId: string;
  mealTypeId: string;
  date: string;
  /** Required for Customize meal plan (Protein | Carbs | Fiber). */
  macroCategory?: string;
}

export interface IExportDailyMenuMealsDto
  extends ICreateDailyMenuMealsMultiDto {}

export interface IAddDailyMenuMealsMultiMealsDto {
  menuId: string;
  mealIds: string[];
  dates: string[];
  mealPlanIds: Array<{
    mealPlanId: string;
    mealPlan: IMealPlans | null;
    mealTypeIds: string[];
    /** UI-only for Customize rows; collected into macroCategories on submit. */
    macroCategory?: string;
  }>;
  /** New API: list of macros for Customize plans. */
  macroCategories?: string[];
  /** Legacy / still accepted single macro. */
  macroCategory?: string;
}

export interface IUpdateDailyMenuMealsDto
  extends IBaseUpdateDto,
    ICreateDailyMenuMealsDto {}

export interface IDailyMenuMealsDetailsDto
  extends IBaseResponseDetailsDto<IDailyMenuMeals> {}

export interface IDailyMenuMeals extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  date: string;
  isDefault: boolean;
  weightInGrams: number;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  water: number;
  imageUrl: string;
}

export interface IMealsByPlanArgs {
  mealTypeId: string;
  date: string;
  clientId: string;
  mealPlanId?: string;
  search?: string;
}

export interface IAdminMealsByPlanMeal {
  id: string;
  mealPlanId: string;
  meal: {
    id: string;
    nameEn: string;
    nameAr: string;
    imageUrl?: string;
    priceForCustomer?: number;
  };
  defaultPrice: number;
}

export interface IAdminMealsByPlan {
  id: string;
  nameEn: string;
  nameAr: string;
  meals: IAdminMealsByPlanMeal[];
  customMeals: IAdminMealsByPlanMeal[];
}

export interface IMealsByPlanDetails
  extends IBaseResponseDetailsDto<IAdminMealsByPlan[]> {}

export interface IMealsByPlanOption {
  /** `id` from mealsbyPlan API — sent as `dailyMenuMealId` in replace-meals payloads. */
  dailyMenuMealId: string;
  mealId: string;
  nameEn: string;
  nameAr: string;
}
