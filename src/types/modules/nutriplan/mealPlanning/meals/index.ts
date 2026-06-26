/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { IRecipes } from "../recipes";
import { IAllergens } from "../../allergens";

export interface IMealsListDto extends IBaseResponseListDto<IMeals> {}

export interface ICreateMealDto {
  nameAr: string;
  nameEn: string;
  image: string | File;
  recipeId: string;
  priceForCustomer: number | null;
  suitableForFreezing: boolean;
  // isDefault: boolean;
  isAddOn: boolean;
  isActive: boolean;
}

export interface IUpdateMealDto extends IBaseUpdateDto, ICreateMealDto {
  imageUrl: string;
}

export interface IMealsDetailsDto
  extends IBaseResponseDetailsDto<IMeals>,
    IMeals {}

export interface IMeals extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  weightInGrams: string;
  calories: string;
  fat: string;
  carbs: string;
  cuisine: string;
  customeMealName: string;
  protein: string;
  water: string;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isLowGI: boolean;
  isCold: boolean;
  isWarm: boolean;
  imageUrl: string | null;
  recipe: IRecipes;
  priceForCustomer: number;
  suitableForFreezing: boolean;
  // isDefault: boolean;
  allergens: Array<IAllergens>;
  isAddOn: boolean;
  isActive: boolean;
}
