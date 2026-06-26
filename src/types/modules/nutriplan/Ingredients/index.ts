/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { IMeasurmentUnits } from "../measurementUnits";

export interface IIngredientsListDto
  extends IBaseResponseListDto<IIngredients> {}

export interface ICreateIngredientsDto {
  nameAr: string;
  nameEn: string;
  DescriptionAr: string;
  DescriptionEn: string;
  StorageInstructionsAr: string;
  StorageInstructionsEn: string;
  BasicUnit: string;
  CaloriesPer100Unit: number;
  FatPer100Unit: number;
  CarbsPer100Unit: number;
  ProteinPer100Unit: number;
  FiberPer100Unit: number;
  SugarPer100Unit: number;
  WaterPer100g: number;
  IsDairyFree: boolean;
  IsLowGI: boolean;
  IsSeasonal: boolean;
  IsOrganic: boolean;
  IsGlutenFree: boolean;
  CategoryId: string;
  Density: number;
  CaloriesUnit: string;
  CostPer100Unit?: number;
  Status: string;
  DietaryPreference: string;
  Type: string;
  tags: string[];
  AllergenIds: string[];
  IngredientMeasurementUnits: {
    measurementUnitId: string;
    equivalentInUnit: number;
  }[];
  Attributes: {
    nameEn: string;
    nameAr: string;
    unit: string;
    value: number;
    nutrientsAttributeId: string;
  }[];
}

export interface IUpdateIngredientDto
  extends IBaseUpdateDto,
    ICreateIngredientsDto {}

export interface IIngredientsDetailsDto
  extends IBaseResponseDetailsDto<IIngredients> {}

export interface IIngredients extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  storageInstructionsEn: string;
  storageInstructionsAr: string;
  isDairyFree: boolean;
  isLowGI: boolean;
  isSeasonal: boolean;
  isGlutenFree: boolean;
  isOrganic: boolean;
  categoryId: string;
  basicUnit: string;
  density: number;
  tags: string[];
  caloriesPer100Unit: number;
  fatPer100Unit: number;
  carbsPer100Unit: number;
  proteinPer100Unit: number;
  fiberPer100Unit: number;
  sugarPer100Unit: number;
  caloriesUnit: string;
  waterPer100g: number;
  costPer100Unit: number;
  status: string;
  dietaryPreference: string;
  type: string;
  allergens: string[];
  ingredientMeasurementUnits: Array<IMeasurmentUnits>;
  attributes: any[];
  category: {
    id: string;
    nameAr: string;
    nameEn: string;
    iconUrl: string;
    imageUrl: string;
    icocategoryTypenUrl: string;
  };
}
