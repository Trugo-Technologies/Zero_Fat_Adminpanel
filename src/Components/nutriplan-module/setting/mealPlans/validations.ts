import { MessageFormatElement } from "react-intl";
import * as yup from "yup";

const createValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const validationSchemaStep1 = yup.object({
    nameEn: yup.string().required(String(messages["validation.required"])),
    nameAr: yup.string().required(String(messages["validation.required"])),
    code: yup.string().required(String(messages["validation.required"])),
    defaultDietitianGoal: yup
      .string()
      .required(String(messages["validation.required"])),
    mainImage: yup.string().required(String(messages["validation.required"])),
  });

  const validationSchemaStep2 = yup.object({
    carbPercentage: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"]))
      .min(1, String(messages["validation.custom.min"]) + ` ${1}`)
      .max(100, String(messages["validation.custom.max"]) + ` ${100}`)
      .required(String(messages["validation.required"])),
    proteinPercentage: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"]))
      .min(1, String(messages["validation.custom.min"]) + ` ${1}`)
      .max(100, String(messages["validation.custom.max"]) + ` ${100}`)
      .required(String(messages["validation.required"])),
    fatPercentage: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"]))
      .min(1, String(messages["validation.custom.min"]) + ` ${1}`)
      .max(100, String(messages["validation.custom.max"]) + ` ${100}`)
      .required(String(messages["validation.required"])),
    mealTypes: yup.array().of(
      yup.object().shape({
        mealTypeId: yup
          .string()
          .required(String(messages["validation.required"])),
        averageCalories: yup
          .number()
          .nullable()
          .positive(String(messages["validation.positive"]))
          .required(String(messages["validation.required"])),
        price: yup
          .number()
          .nullable()
          .positive(String(messages["validation.positive"]))
          .required(String(messages["validation.required"])),
      })
    ),
  });

  return [validationSchemaStep1, validationSchemaStep2];
};

const updateValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => createValidationSchemas(messages);

const createCustomizeValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const required = String(messages["validation.required"]);
  const positive = String(messages["validation.positive"] || required);
  const rangeMsg = String(
    messages["mealPlans.customize.validation.proteinGramsRange"] ||
      "Protein must be between 50 and 200 g"
  );

  const validationSchemaStep1 = yup.object({
    nameEn: yup.string().required(required),
    nameAr: yup.string().required(required),
    code: yup.string().required(required),
    defaultDietitianGoal: yup.string().required(required),
    mainImage: yup.mixed().nullable(),
  });

  const validationSchemaStep2 = yup.object({
    mealTypeIds: yup
      .array()
      .of(yup.string().required(required))
      .min(1, required),
    protein: yup.object({
      grams: yup
        .number()
        .nullable()
        .typeError(required)
        .required(required)
        .min(50, rangeMsg)
        .max(200, rangeMsg),
      calories: yup
        .number()
        .nullable()
        .typeError(required)
        .required(required)
        .positive(positive),
    }),
    carbs: yup.object({
      grams: yup
        .number()
        .nullable()
        .typeError(required)
        .required(required)
        .min(0, positive),
      calories: yup
        .number()
        .nullable()
        .typeError(required)
        .required(required)
        .positive(positive),
    }),
    fiber: yup.object({
      grams: yup
        .number()
        .nullable()
        .typeError(required)
        .required(required)
        .min(0, positive),
      calories: yup
        .number()
        .nullable()
        .typeError(required)
        .required(required)
        .min(0, positive),
    }),
  });

  return [validationSchemaStep1, validationSchemaStep2];
};

export {
  createValidationSchemas,
  updateValidationSchemas,
  createCustomizeValidationSchemas,
};
