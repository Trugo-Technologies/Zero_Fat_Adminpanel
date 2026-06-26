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
  // image: string;
}

export interface ICreateDailyMenuMealsMultiDto {
  mealIds: string[];
  menuId: string;
  mealPlanId: string;
  mealTypeId: string;
  date: string;
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
  }>;
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
