/** @format */

import {
  IIngredientsDetailsDto,
  ICreateIngredientsDto,
  IUpdateIngredientDto,
} from "src/types/modules/nutriplan/mealPlanning/ingredients";

import {
  basicUnit,
  dietaryPreference,
  ingredientStatus,
  ingredientType,
} from "src/types/enums";

const EditDefaultValues = (
  ingredientItem: IIngredientsDetailsDto | undefined,
  ingredientIdParams: string
): IUpdateIngredientDto => {
  return {
    id: ingredientIdParams || "",
    nameAr: ingredientItem?.data?.nameAr || "",
    nameEn: ingredientItem?.data?.nameEn || "",
    basicUnit: ingredientItem?.data?.basicUnit || basicUnit.Solid || "",
    dietaryPreference:
      ingredientItem?.data?.dietaryPreference || dietaryPreference.None || "",
    status: ingredientItem?.data?.status || ingredientStatus.Available || "",
    type: ingredientItem?.data?.type || ingredientType.Other || "",
    tags: ingredientItem?.data?.tags || [],

    density: ingredientItem?.data?.density || 1,
    caloriesUnit: ingredientItem?.data?.caloriesUnit || "g",
    categoryId: ingredientItem?.data?.categoryId || "",
    category: ingredientItem?.data?.category || null,
    caloriesPer100Unit: ingredientItem?.data?.caloriesPer100Unit || 0,
    carbsPer100Unit: ingredientItem?.data?.carbsPer100Unit || 0,
    fatPer100Unit: ingredientItem?.data?.fatPer100Unit || 0,
    fiberPer100Unit: ingredientItem?.data?.fiberPer100Unit || 0,
    proteinPer100Unit: ingredientItem?.data?.proteinPer100Unit || 0,
    sugarPer100Unit: ingredientItem?.data?.sugarPer100Unit || 0,
    waterPer100g: ingredientItem?.data?.waterPer100g || 0,
    costPer100Unit: ingredientItem?.data?.costPer100Unit || null,
    price: ingredientItem?.data?.costPer100Unit || 0,
    amount: 100,
    priceUnit: "",
    allergenIds: ingredientItem?.data?.allergens?.map((item) => item.id) || [],
    allergens: ingredientItem?.data?.allergens || null,

    attributes:
      ingredientItem?.data?.attributes ||
      [
        // {
        //   nutrientsAttributeId: "",
        //   value: null,
        //   nutrientsAttribute: null,
        // },
      ],
    ingredientMeasurementUnits:
      ingredientItem?.data?.ingredientMeasurementUnits?.filter(
        (item) => !item?.isDefault
      ) ||
      [
        // {
        //   measurementUnitId: "",
        //   equivalentInUnit: null,
        //   measurementUnit: null,
        // },
      ],

    isDairyFree: ingredientItem?.data?.isDairyFree || false,
    isGlutenFree: ingredientItem?.data?.isGlutenFree || false,
    isLowGI: ingredientItem?.data?.isLowGI || false,
    isOrganic: ingredientItem?.data?.isOrganic || false,
    isSeasonal: ingredientItem?.data?.isSeasonal || false,
    storageInstructionsAr: ingredientItem?.data?.storageInstructionsAr || "",
    storageInstructionsEn: ingredientItem?.data?.storageInstructionsEn || "",
    descriptionAr: ingredientItem?.data?.descriptionAr || "",
    descriptionEn: ingredientItem?.data?.descriptionEn || "",
    cholesterolPer100Unit: ingredientItem?.data?.cholesterolPer100Unit || 0,
    totalSaturatedFattyAcids:
      ingredientItem?.data?.totalSaturatedFattyAcids || 0,
    saturatedFattyAcid4_0: ingredientItem?.data?.saturatedFattyAcid4_0 || 0,
    saturatedFattyAcid6_0: ingredientItem?.data?.saturatedFattyAcid6_0 || 0,
    saturatedFattyAcid8_0: ingredientItem?.data?.saturatedFattyAcid8_0 || 0,
    saturatedFattyAcid10_0: ingredientItem?.data?.saturatedFattyAcid10_0 || 0,
    saturatedFattyAcid12_0: ingredientItem?.data?.saturatedFattyAcid12_0 || 0,
    saturatedFattyAcid14_0: ingredientItem?.data?.saturatedFattyAcid14_0 || 0,
    saturatedFattyAcid16_0: ingredientItem?.data?.saturatedFattyAcid16_0 || 0,
    saturatedFattyAcid18_0: ingredientItem?.data?.saturatedFattyAcid18_0 || 0,
    monounsaturatedFattyAcid16_1:
      ingredientItem?.data?.monounsaturatedFattyAcid16_1 || 0,
    totalMonounsaturatedFattyAcids:
      ingredientItem?.data?.totalMonounsaturatedFattyAcids || 0,
    monounsaturatedFattyAcid18_1:
      ingredientItem?.data?.monounsaturatedFattyAcid18_1 || 0,
    monounsaturatedFattyAcid20_1:
      ingredientItem?.data?.monounsaturatedFattyAcid20_1 || 0,
    totalPolyunsaturatedFattyAcids:
      ingredientItem?.data?.totalPolyunsaturatedFattyAcids || 0,
    monounsaturatedFattyAcid22_1:
      ingredientItem?.data?.monounsaturatedFattyAcid22_1 || 0,
    polyunsaturatedFattyAcid18_2:
      ingredientItem?.data?.polyunsaturatedFattyAcid18_2 || 0,
    polyunsaturatedFattyAcid18_3:
      ingredientItem?.data?.polyunsaturatedFattyAcid18_3 || 0,
    polyunsaturatedFattyAcid20_4:
      ingredientItem?.data?.polyunsaturatedFattyAcid20_4 || 0,
    polyunsaturatedFattyAcid18_4:
      ingredientItem?.data?.polyunsaturatedFattyAcid18_4 || 0,
    polyunsaturatedFattyAcid20_5:
      ingredientItem?.data?.polyunsaturatedFattyAcid20_5 || 0,
    polyunsaturatedFattyAcid22_5:
      ingredientItem?.data?.polyunsaturatedFattyAcid22_5 || 0,
    polyunsaturatedFattyAcid22_6:
      ingredientItem?.data?.polyunsaturatedFattyAcid22_6 || 0,
    calciumPer100Unit: ingredientItem?.data?.calciumPer100Unit || 0,
    ironPer100Unit: ingredientItem?.data?.ironPer100Unit || 0,
    magnesiumPer100Unit: ingredientItem?.data?.magnesiumPer100Unit || 0,
    phosphorusPer100Unit: ingredientItem?.data?.phosphorusPer100Unit || 0,
    potassiumPer100Unit: ingredientItem?.data?.potassiumPer100Unit || 0,
    sodiumPer100Unit: ingredientItem?.data?.sodiumPer100Unit || 0,
    zincPer100Unit: ingredientItem?.data?.zincPer100Unit || 0,
    copperPer100Unit: ingredientItem?.data?.copperPer100Unit || 0,
    seleniumPer100Unit: ingredientItem?.data?.seleniumPer100Unit || 0,
    vitaminARAE: ingredientItem?.data?.vitaminARAE || 0,
    retinol: ingredientItem?.data?.retinol || 0,
    caroteneAlpha: ingredientItem?.data?.caroteneAlpha || 0,
    caroteneBeta: ingredientItem?.data?.caroteneBeta || 0,
    cryptoxanthinBeta: ingredientItem?.data?.cryptoxanthinBeta || 0,
    lycopene: ingredientItem?.data?.lycopene || 0,
    luteinZeaxanthin: ingredientItem?.data?.luteinZeaxanthin || 0,
    vitaminE: ingredientItem?.data?.vitaminE || 0,
    vitaminD: ingredientItem?.data?.vitaminD || 0,
    vitaminK: ingredientItem?.data?.vitaminK || 0,
    vitaminC: ingredientItem?.data?.vitaminC || 0,
    thiamin: ingredientItem?.data?.thiamin || 0,
    riboflavin: ingredientItem?.data?.riboflavin || 0,
    niacin: ingredientItem?.data?.niacin || 0,
    vitaminB6: ingredientItem?.data?.vitaminB6 || 0,
    folateTotal: ingredientItem?.data?.folateTotal || 0,
    folateDFE: ingredientItem?.data?.folateDFE || 0,
    folicAcid: ingredientItem?.data?.folicAcid || 0,
    folateFood: ingredientItem?.data?.folateFood || 0,
    vitaminB12: ingredientItem?.data?.vitaminB12 || 0,
    choline: ingredientItem?.data?.choline || 0,
    alcohol: ingredientItem?.data?.alcohol || 0,
    caffeine: ingredientItem?.data?.caffeine || 0,
    theobromine: ingredientItem?.data?.theobromine || 0,
    addedVitaminE: ingredientItem?.data?.addedVitaminE || 0,
    addedVitaminB12: ingredientItem?.data?.addedVitaminB12 || 0,
  };
};
const CreateDefaultValues = (): ICreateIngredientsDto => {
  return {
    nameAr: "",
    nameEn: "",
    basicUnit: basicUnit.Solid,
    dietaryPreference: dietaryPreference.None,
    status: ingredientStatus.Available,
    type: ingredientType.Other || "",
    tags: [],
    density: 1,
    caloriesUnit: "g",
    categoryId: "",
    caloriesPer100Unit: 0,
    carbsPer100Unit: 0,
    fatPer100Unit: 0,
    fiberPer100Unit: 0,
    proteinPer100Unit: 0,
    sugarPer100Unit: 0,
    waterPer100g: 0,
    costPer100Unit: null,
    price: null,
    amount: null,
    priceUnit: "g",
    allergenIds: [],

    attributes: [
      // {
      //   nutrientsAttributeId: "",
      //   value: null,
      //   nutrientsAttribute: null,
      // },
    ],
    ingredientMeasurementUnits: [
      // {
      //   measurementUnitId: "",
      //   equivalentInUnit: null,
      //   measurementUnit: null,
      // },
    ],

    isDairyFree: false,
    isGlutenFree: false,
    isLowGI: false,
    isOrganic: false,
    isSeasonal: false,
    storageInstructionsAr: "",
    storageInstructionsEn: "",
    descriptionAr: "",
    descriptionEn: "",
    cholesterolPer100Unit: 0,
    totalSaturatedFattyAcids: 0,
    saturatedFattyAcid4_0: 0,
    saturatedFattyAcid6_0: 0,
    saturatedFattyAcid8_0: 0,
    saturatedFattyAcid10_0: 0,
    saturatedFattyAcid12_0: 0,
    saturatedFattyAcid14_0: 0,
    saturatedFattyAcid16_0: 0,
    saturatedFattyAcid18_0: 0,
    monounsaturatedFattyAcid16_1: 0,
    totalMonounsaturatedFattyAcids: 0,
    monounsaturatedFattyAcid18_1: 0,
    monounsaturatedFattyAcid20_1: 0,
    totalPolyunsaturatedFattyAcids: 0,
    monounsaturatedFattyAcid22_1: 0,
    polyunsaturatedFattyAcid18_2: 0,
    polyunsaturatedFattyAcid18_3: 0,
    polyunsaturatedFattyAcid20_4: 0,
    polyunsaturatedFattyAcid18_4: 0,
    polyunsaturatedFattyAcid20_5: 0,
    polyunsaturatedFattyAcid22_5: 0,
    polyunsaturatedFattyAcid22_6: 0,
    calciumPer100Unit: 0,
    ironPer100Unit: 0,
    magnesiumPer100Unit: 0,
    phosphorusPer100Unit: 0,
    potassiumPer100Unit: 0,
    sodiumPer100Unit: 0,
    zincPer100Unit: 0,
    copperPer100Unit: 0,
    seleniumPer100Unit: 0,
    vitaminARAE: 0,
    retinol: 0,
    caroteneAlpha: 0,
    caroteneBeta: 0,
    cryptoxanthinBeta: 0,
    lycopene: 0,
    luteinZeaxanthin: 0,
    vitaminE: 0,
    vitaminD: 0,
    vitaminK: 0,
    vitaminC: 0,
    thiamin: 0,
    riboflavin: 0,
    niacin: 0,
    vitaminB6: 0,
    folateTotal: 0,
    folateDFE: 0,
    folicAcid: 0,
    folateFood: 0,
    vitaminB12: 0,
    choline: 0,
    alcohol: 0,
    caffeine: 0,
    theobromine: 0,
    addedVitaminE: 0,
    addedVitaminB12: 0,
  };
};

export const defaultValues = {
  EditDefaultValues,
  CreateDefaultValues,
};
