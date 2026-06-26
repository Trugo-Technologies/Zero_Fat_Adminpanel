/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { IAllergens } from "../../allergens";
import { IMeasurmentUnits } from "../../measurementUnits";
import { INutrientsAttributes } from "../../nutrientsAttributes";
import { ICategories } from "../../categories";
export interface IFoodEnergy {
  waterPer100g: number | null;
  sugarPer100Unit: number | null;
  fiberPer100Unit: number | null;
  proteinPer100Unit: number | null;
  carbsPer100Unit: number | null;
  fatPer100Unit: number | null;
  caloriesPer100Unit: number | null;
  cholesterolPer100Unit: number | null;
  totalSaturatedFattyAcids: number | null;
  saturatedFattyAcid4_0: number | null;
  saturatedFattyAcid6_0: number | null;
  saturatedFattyAcid8_0: number | null;
  saturatedFattyAcid10_0: number | null;
  saturatedFattyAcid12_0: number | null;
  saturatedFattyAcid14_0: number | null;
  saturatedFattyAcid16_0: number | null;
  saturatedFattyAcid18_0: number | null;
  monounsaturatedFattyAcid16_1: number | null;
  totalMonounsaturatedFattyAcids: number | null;
  monounsaturatedFattyAcid18_1: number | null;
  monounsaturatedFattyAcid20_1: number | null;
  totalPolyunsaturatedFattyAcids: number | null;
  monounsaturatedFattyAcid22_1: number | null;
  polyunsaturatedFattyAcid18_2: number | null;
  polyunsaturatedFattyAcid18_3: number | null;
  polyunsaturatedFattyAcid20_4: number | null;
  polyunsaturatedFattyAcid18_4: number | null;
  polyunsaturatedFattyAcid20_5: number | null;
  polyunsaturatedFattyAcid22_5: number | null;
  polyunsaturatedFattyAcid22_6: number | null;
  calciumPer100Unit: number | null;
  ironPer100Unit: number | null;
  magnesiumPer100Unit: number | null;
  phosphorusPer100Unit: number | null;
  potassiumPer100Unit: number | null;
  sodiumPer100Unit: number | null;
  zincPer100Unit: number | null;
  copperPer100Unit: number | null;
  seleniumPer100Unit: number | null;
  vitaminARAE: number | null;
  retinol: number | null;
  caroteneAlpha: number | null;
  caroteneBeta: number | null;
  cryptoxanthinBeta: number | null;
  lycopene: number | null;
  luteinZeaxanthin: number | null;
  vitaminE: number | null;
  vitaminD: number | null;
  vitaminK: number | null;
  vitaminC: number | null;
  thiamin: number | null;
  riboflavin: number | null;
  niacin: number | null;
  vitaminB6: number | null;
  folateTotal: number | null;
  folateDFE: number | null;
  folicAcid: number | null;
  folateFood: number | null;
  vitaminB12: number | null;
  choline: number | null;
  alcohol: number | null;
  caffeine: number | null;
  theobromine: number | null;
  addedVitaminE: number | null;
  addedVitaminB12: number | null;
}

export interface IIngredientsListDto
  extends IBaseResponseListDto<IIngredients> {}

export interface IUpdateIngredientDto
  extends IBaseUpdateDto,
    ICreateIngredientsDto {}

export interface IIngredientsDetailsDto
  extends IBaseResponseDetailsDto<IIngredients> {}

export interface IIngredients
  extends IBaseAdditionalResponseDetailsDto,
    IFoodEnergy {
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
  tags: Array<string>;
  caloriesUnit: string;
  costPer100Unit: number;
  status: string;
  dietaryPreference: string;
  type: string;
  allergens: Array<IAllergens>;
  ingredientMeasurementUnits: Array<{
    measurementUnit?: IMeasurmentUnits | null;
    code: string;
    isDefault?: boolean;
    equivalentInUnit: number | null;
  }>;
  attributes: Array<{
    // nameEn: string;
    // nameAr: string;
    // unit: string;
    value: number | null;
    nutrientsAttribute?: INutrientsAttributes | null;
    nutrientsAttributeId: string;
  }>;
  category: ICategories;
}

export interface ICreateIngredientsDto extends IFoodEnergy {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  storageInstructionsAr: string;
  storageInstructionsEn: string;
  basicUnit: string;
  isDairyFree: boolean;
  isLowGI: boolean;
  isSeasonal: boolean;
  isOrganic: boolean;
  isGlutenFree: boolean;
  categoryId: string;
  density: number | null;
  caloriesUnit: string;
  costPer100Unit?: number | null;
  status: string;
  dietaryPreference: string;
  type: string;
  tags: Array<string>;
  allergenIds: Array<string>;
  allergens?: Array<IAllergens> | null;
  price?: number | null;
  amount?: number | null;
  priceUnit?: string;

  ingredientMeasurementUnits: Array<{
    measurementUnit?: IMeasurmentUnits | null;
    code: string;
    equivalentInUnit: number | null;
  }>;

  attributes: Array<{
    // nameEn: string;
    // nameAr: string;
    // unit: string;
    value: number | null;
    nutrientsAttribute?: INutrientsAttributes | null;
    nutrientsAttributeId: string;
  }>;
  category?: ICategories | null;
}
