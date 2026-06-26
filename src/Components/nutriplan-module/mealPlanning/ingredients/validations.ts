/** @format */

import { MessageFormatElement } from "react-intl";
import { basicUnit } from "src/types/enums";
import * as yup from "yup";

const createValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const validationSchema = yup.object({
    nameEn: yup.string().required(String(messages["validation.required"])),
    nameAr: yup.string().required(String(messages["validation.required"])),
    basicUnit: yup.string().required(String(messages["validation.required"])),
    categoryId: yup.string().required(String(messages["validation.required"])),
    caloriesPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    fatPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    carbsPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    proteinPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    fiberPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    sugarPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),

    waterPer100g: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    density: yup
      .number()
      .nullable()
      .when("basicUnit", {
        is: (val: string) => val !== basicUnit.Solid,
        then: () =>
          yup
            .number()
            .nullable()
            .positive(String(messages["validation.positive"]))
            .min(1, String(messages["validation.custom.min"]) + ` ${1}`)
            .required(String(messages["validation.required"])),
        otherwise: () => yup.number().notRequired(),
      }),
    // allergenIds: yup.array().min(1, String(messages["validation.required"])),
    // tags: yup.array().min(1, String(messages["validation.required"])),

    ingredientMeasurementUnits: yup.array().of(
      yup.object().shape({
        code: yup.string().required(String(messages["validation.required"])),

        equivalentInUnit: yup
          .number()
          .nullable()
          .positive(String(messages["validation.positive"]))
          .required(String(messages["validation.required"])),
      })
    ),
    price: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    amount: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"]))
      .required(String(messages["validation.required"])),
    attributes: yup.array().of(
      yup.object().shape({
        nutrientsAttributeId: yup
          .string()
          .required(String(messages["validation.required"])),

        value: yup
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
    basicUnit: yup.string().required(String(messages["validation.required"])),
    categoryId: yup.string().required(String(messages["validation.required"])),
    caloriesPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    fatPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    carbsPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    proteinPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    fiberPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    sugarPer100Unit: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),

    waterPer100g: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    density: yup
      .number()
      .nullable()
      .when("basicUnit", {
        is: (val: string) => val !== basicUnit.Solid,
        then: () =>
          yup
            .number()
            .nullable()
            .positive(String(messages["validation.positive"]))
            .min(1, String(messages["validation.custom.min"]) + ` ${1}`)
            .required(String(messages["validation.required"])),
        otherwise: () => yup.number().notRequired(),
      }),
    // allergenIds: yup.array().min(1, String(messages["validation.required"])),
    // tags: yup.array().min(1, String(messages["validation.required"])),

    ingredientMeasurementUnits: yup.array().of(
      yup.object().shape({
        code: yup.string().required(String(messages["validation.required"])),

        equivalentInUnit: yup
          .number()
          .nullable()
          .positive(String(messages["validation.positive"]))
          .required(String(messages["validation.required"])),
      })
    ),
    price: yup
      .number()
      .nullable()
      .min(0, String(messages["validation.positive"])),
    amount: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"]))
      .required(String(messages["validation.required"])),
    attributes: yup.array().of(
      yup.object().shape({
        nutrientsAttributeId: yup
          .string()
          .required(String(messages["validation.required"])),

        value: yup
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
