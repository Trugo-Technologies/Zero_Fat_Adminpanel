/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { IIngredients } from "../Ingredients";
import { IMeals } from "../mealPlanning/meals";

export interface IExtraMealsListDto extends IBaseResponseListDto<IExtraMeal> {}

export interface ICreateExtraMealDto {
  nameAr: string;
  nameEn: string;
  price: number | null;
  amount: number | null;
  weightInGrams: number | null;
  orginalIngredientId: string;
  ingredientId: string;
  mealId: string;
  image: string | File;
}

export interface IUpdateIExtraMealDto
  extends IBaseUpdateDto,
    ICreateExtraMealDto {
  imageUrl?: string;
}

export interface IExtraMealsDetailsDto
  extends IBaseResponseDetailsDto<IExtraMeal> {}

export interface IExtraMeal extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number | null;
  amount: number | null;
  weightInGrams: number | null;
  orginalIngredient: IIngredients;
  ingredient: IIngredients;
  meal: IMeals;
  imageUrl: string | null;
  isActive: boolean;
}
