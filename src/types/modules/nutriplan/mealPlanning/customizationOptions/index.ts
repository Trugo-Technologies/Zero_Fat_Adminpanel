/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";
import { ICustomizationGroup } from "../customizationGroups";
import { IIngredients } from "../ingredients";
import { IMeals } from "../meals";

export interface ICustomizationOption
  extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  groupId: string;
  ingredientId: string;
  priceAdjustment: number | null;
  caloriesAdjustment: number | null;
  fatAdjustment: number | null;
  carbsAdjustment: number | null;
  proteinAdjustment: number | null;
  isDefault: boolean;
  // isReplacement: boolean;
  // replacesComponent: string;
  mealId: string | null;
  // objects
  group: ICustomizationGroup;
  ingredient: IIngredients;
  meal: IMeals | null;
}

export interface ICustomizationOptionsListDto
  extends IBaseResponseListDto<ICustomizationOption> {}

export interface ICreateCustomizationOptionDto {
  nameAr: string;
  nameEn: string;
  groupId: string;
  ingredientId: string;
  image: string;
  priceAdjustment: number | null;
  caloriesAdjustment: number | null;
  fatAdjustment: number | null;
  carbsAdjustment: number | null;
  proteinAdjustment: number | null;
  // isReplacement: boolean;
  // replacesComponent: string;
  mealId: string;
  isDefault: boolean;
  isAllMeals: boolean;
}

export interface IUpdateCustomizationOptionDto
  extends IBaseUpdateDto,
    ICreateCustomizationOptionDto {
  imageUrl: string;
}

export interface ICustomizationOptionDetailsDto
  extends IBaseResponseDetailsDto<ICustomizationOption> {}
