/** @format */
import { MessageFormatElement } from "react-intl";
import * as yup from "yup";

const customizationOptionsValidationSchema = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  return yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    ingredientId: yup
      .string()
      .required(String(messages["validation.required"])),
    groupId: yup.string().required(String(messages["validation.required"])),

    priceAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .moreThan(-1, String(messages["validation.allowPositive"])),
    caloriesAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .moreThan(-1, String(messages["validation.allowPositive"])),
    fatAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .moreThan(-1, String(messages["validation.allowPositive"])),
    carbsAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .moreThan(-1, String(messages["validation.allowPositive"])),
    proteinAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .moreThan(-1, String(messages["validation.allowPositive"])),
    isAllMeals: yup.boolean(),
    mealId: yup.string().when("isAllMeals", {
      is: (val: boolean) => !val,
      then: () =>
        yup.string().required(String(messages["validation.required"])),
      otherwise: () => yup.string().notRequired(),
    }),
  });
};

export default customizationOptionsValidationSchema;
