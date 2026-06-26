import { MessageFormatElement } from "react-intl";
import * as yup from "yup";

const createValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const validationSchemaStep1 = yup.object({
    nameEn: yup.string().required(String(messages["validation.required"])),
    nameAr: yup.string().required(String(messages["validation.required"])),
    level: yup.string().required(String(messages["validation.required"])),
    avatarImage: yup.string().required(String(messages["validation.required"])),
    profileMedia: yup
      .string()
      .required(String(messages["validation.required"])),
    equipmentCategoryId: yup
      .string()
      .required(String(messages["validation.required"])),
  });

  const validationSchemaStep2 = yup.object({
    planGoalId: yup.string().required(String(messages["validation.required"])),
    trainerId: yup.string().required(String(messages["validation.required"])),
    weeklyRepetition: yup
      .number()
      .nullable()
      .required(String(messages["validation.required"]))
      .typeError(String(messages["validation.required"])),
    daysPerWeek: yup
      .number()
      .nullable()
      .required(String(messages["validation.required"]))

      .typeError(String(messages["validation.required"]))
      .integer(String(messages["validation.positive"]))

      .positive(String(messages["validation.positive"])) // Ensures the number is positive
      .min(1, String(messages["validation.min"])) // Minimum value of 1
      .max(7, String(messages["validation.max"])), // Maximum value of 7
  });

  return [validationSchemaStep1, validationSchemaStep2];
};

export default createValidationSchemas;
