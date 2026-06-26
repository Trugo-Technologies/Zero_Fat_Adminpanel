import { MessageFormatElement } from 'react-intl';
import * as yup from 'yup';

const createValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  const validationSchemaStep1 = yup.object({
    nameEn: yup.string().required(String(messages['validation.required'])),
    nameAr: yup.string().required(String(messages['validation.required'])),
    code: yup.string().required(String(messages['validation.required'])),
    defaultDietitianGoal: yup
      .string()
      .required(String(messages['validation.required'])),
    mainImage: yup.string().required(String(messages['validation.required'])),
  });

  const validationSchemaStep2 = yup.object({
    carbPercentage: yup
      .number()
      .nullable()
      .positive(String(messages['validation.positive']))
      .min(1, String(messages['validation.custom.min']) + ` ${1}`) // Adjust the message as needed
      .max(100, String(messages['validation.custom.max']) + ` ${100}`) // Adjust the message as needed
      .required(String(messages['validation.required'])),
    proteinPercentage: yup
      .number()
      .nullable()
      .positive(String(messages['validation.positive']))
      .min(1, String(messages['validation.custom.min']) + ` ${1}`) // Adjust the message as needed
      .max(100, String(messages['validation.custom.max']) + ` ${100}`) // Adjust the message as needed
      .required(String(messages['validation.required'])),

    fatPercentage: yup
      .number()
      .nullable()
      .positive(String(messages['validation.positive']))
      .min(1, String(messages['validation.custom.min']) + ` ${1}`) // Adjust the message as needed
      .max(100, String(messages['validation.custom.max']) + ` ${100}`) // Adjust the message as needed
      .required(String(messages['validation.required'])),
    mealTypes: yup.array().of(
      yup.object().shape({
        mealTypeId: yup
          .string()
          .required(String(messages['validation.required'])),

        averageCalories: yup
          .number()
          .nullable()
          .positive(String(messages['validation.positive']))
          .required(String(messages['validation.required'])),

        price: yup
          .number()
          .nullable()
          .positive(String(messages['validation.positive']))
          .required(String(messages['validation.required'])),
      }),
    ),
  });

  return [validationSchemaStep1, validationSchemaStep2];
};

const updateValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  const validationSchemaStep1 = yup.object({
    nameEn: yup.string().required(String(messages['validation.required'])),
    nameAr: yup.string().required(String(messages['validation.required'])),
    code: yup.string().required(String(messages['validation.required'])),
    defaultDietitianGoal: yup
      .string()
      .required(String(messages['validation.required'])),
    mainImage: yup.string().required(String(messages['validation.required'])),
  });

  const validationSchemaStep2 = yup.object({
    carbPercentage: yup
      .number()
      .nullable()
      .positive(String(messages['validation.positive']))
      .min(1, String(messages['validation.custom.min']) + ` ${1}`) // Adjust the message as needed
      .max(100, String(messages['validation.custom.max']) + ` ${100}`) // Adjust the message as needed
      .required(String(messages['validation.required'])),
    proteinPercentage: yup
      .number()
      .nullable()
      .positive(String(messages['validation.positive']))
      .min(1, String(messages['validation.custom.min']) + ` ${1}`) // Adjust the message as needed
      .max(100, String(messages['validation.custom.max']) + ` ${100}`) // Adjust the message as needed
      .required(String(messages['validation.required'])),

    fatPercentage: yup
      .number()
      .nullable()
      .positive(String(messages['validation.positive']))
      .min(1, String(messages['validation.custom.min']) + ` ${1}`) // Adjust the message as needed
      .max(100, String(messages['validation.custom.max']) + ` ${100}`) // Adjust the message as needed
      .required(String(messages['validation.required'])),
    mealTypes: yup.array().of(
      yup.object().shape({
        mealTypeId: yup
          .string()
          .required(String(messages['validation.required'])),

        averageCalories: yup
          .number()
          .nullable()
          .positive(String(messages['validation.positive']))
          .required(String(messages['validation.required'])),

        price: yup
          .number()
          .nullable()
          .positive(String(messages['validation.positive']))
          .required(String(messages['validation.required'])),
      }),
    ),
  });

  return [validationSchemaStep1, validationSchemaStep2];
};

export { createValidationSchemas, updateValidationSchemas };
