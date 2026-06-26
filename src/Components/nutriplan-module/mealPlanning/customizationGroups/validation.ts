/** @format */
import { MessageFormatElement } from "react-intl";
import * as yup from "yup";

const customizationGroupsValidationSchema = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  return yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    displayOrder: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"]))
      .moreThan(0, String(messages["validation.positive"])),

    caloriesAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"]))
      .moreThan(0, String(messages["validation.positive"])),

    fatAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"]))
      .moreThan(0, String(messages["validation.positive"])),
    carbsAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"]))
      .moreThan(0, String(messages["validation.positive"])),
    proteinAdjustment: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"]))
      .moreThan(0, String(messages["validation.positive"])),
  });
};

export default customizationGroupsValidationSchema;
