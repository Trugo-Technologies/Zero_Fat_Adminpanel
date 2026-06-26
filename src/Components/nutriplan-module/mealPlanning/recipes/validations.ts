/** @format */

import { MessageFormatElement } from "react-intl";
import * as yup from "yup";

const createValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const validationSchema = yup.object({
    nameEn: yup.string().required(String(messages["validation.required"])),
    nameAr: yup.string().required(String(messages["validation.required"])),
    // fullRecipeTextAr: yup
    //   .string()
    //   .required(String(messages["validation.required"])),
    // fullRecipeTextEn: yup
    //   .string()
    //   .required(String(messages["validation.required"])),
    difficulty: yup.string().required(String(messages["validation.required"])),
    cuisine: yup.string().required(String(messages["validation.required"])),
    dietaryCategories: yup
      .array()
      .min(1, String(messages["validation.required"])),
    cookingTime: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"])),
    preparationTime: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"])),
    servings: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"]))
      .required(String(messages["validation.required"])),
    recipeMealTypeIds: yup
      .array()
      .min(1, String(messages["validation.required"])),
    categoryId: yup.string().required(String(messages["validation.required"])),
    recipeIngredients: yup.array().of(
      yup.object().shape({
        measurementUnitCode: yup
          .string()
          .required(String(messages["validation.required"])),
        ingredientId: yup
          .string()
          .required(String(messages["validation.required"])),

        amount: yup
          .number()
          .nullable()
          .positive(String(messages["validation.positive"]))
          .required(String(messages["validation.required"])),
      })
    ),
  });
  return {
    validationSchema,
  };
};

const updateValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const validationSchema = yup.object({
    nameEn: yup.string().required(String(messages["validation.required"])),
    nameAr: yup.string().required(String(messages["validation.required"])),
    // fullRecipeTextAr: yup
    //   .string()
    //   .required(String(messages["validation.required"])),
    // fullRecipeTextEn: yup
    //   .string()
    //   .required(String(messages["validation.required"])),
    difficulty: yup.string().required(String(messages["validation.required"])),
    cuisine: yup.string().required(String(messages["validation.required"])),
    dietaryCategories: yup
      .array()
      .min(1, String(messages["validation.required"])),
    recipeMealTypeIds: yup
      .array()
      .min(1, String(messages["validation.required"])),
    cookingTime: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"])),
    preparationTime: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"])),
    categoryId: yup.string().required(String(messages["validation.required"])),
    recipeIngredients: yup.array().of(
      yup.object().shape({
        measurementUnitCode: yup
          .string()
          .required(String(messages["validation.required"])),
        ingredientId: yup
          .string()
          .required(String(messages["validation.required"])),

        amount: yup
          .number()
          .nullable()
          .positive(String(messages["validation.positive"]))
          .required(String(messages["validation.required"])),
      })
    ),
  });
  return {
    validationSchema,
  };
};
export { createValidationSchemas, updateValidationSchemas };
