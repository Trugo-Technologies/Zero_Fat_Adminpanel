/** @format */

import { MessageFormatElement } from "react-intl";
import * as yup from "yup";

const banksValidationSchema = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const required = String(messages["validation.required"]);

  return yup.object({
    nameEn: yup.string().required(required),
    nameAr: yup.string().required(required),
    cardBinPrefixes: yup
      .array()
      .of(yup.string())
      .min(1, required)
      .required(required),
    isActive: yup.boolean(),
  });
};

export default banksValidationSchema;
