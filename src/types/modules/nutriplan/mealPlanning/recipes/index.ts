/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { ICategories } from "src/types/modules/nutriplan/categories";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import { IMeasurmentUnits } from "src/types/modules/nutriplan/measurementUnits";
import { IIngredients } from "../ingredients";

export interface IRecipesListDto extends IBaseResponseListDto<IRecipes> {}

export interface IEditRecipeImageDto {
  image: string;
  id: string;
}

export interface ICreateRecipesDto {
  nameAr: string;
  nameEn: string;
  fullRecipeTextAr: string;
  fullRecipeTextEn: string;
  preparationMethodAr: string;
  preparationMethodEn: string;
  preparationTime: number | null;
  cookingTime: number | null;
  servings: number | null;
  difficulty: string;
  cuisine: string;
  tags: Array<string>;
  categoryId: string;
  category?: ICategories | null;
  dietaryCategories: Array<string>;
  recipeMealTypeIds: Array<string>;
  recipeMealTypes?: Array<IMealTypes> | null;

  recipeIngredients: Array<IRecipeIngredient>;
  // image: string;

  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isLowGI: boolean;
  isCold: boolean;
  isWarm: boolean;
  suitableForFreezing: boolean;
}

export interface IRecipeIngredient {
  hideOnCustomerPorter: boolean;
  isOptional: boolean;
  amount: number | null;
  ingredientId: string;
  ingredient?: IIngredients | null;
  measurementUnitCode: string;
  measurementUnit: {
    measurementUnit?: IMeasurmentUnits | null;
    code: string;
    isDefault?: boolean;
    equivalentInUnit: number | null;
  } | null; // code - equivalentInUnit - isDefault
}
export interface IUpdateRecipeDto extends IBaseUpdateDto, ICreateRecipesDto {
  // imageUrl: string;
}

export interface IRecipesDetailsDto extends IBaseResponseDetailsDto<IRecipes> {}

export interface IRecipes extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  fullRecipeTextAr: string;
  fullRecipeTextEn: string;
  preparationMethodAr: string;
  preparationMethodEn: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  tags: Array<string>;
  categoryId: string;
  category: ICategories;
  dietaryCategories: Array<string>;
  mealTypes: Array<IMealTypes>;
  recipeIngredients: Array<IRecipeIngredient>;
  imageUrl: string;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isLowGI: boolean;
  isCold: boolean;
  isWarm: boolean;
  suitableForFreezing: boolean;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  water: number;
  weightInGrams: number;
}
