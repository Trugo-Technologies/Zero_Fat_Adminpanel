/** @format */
import { MessageFormatElement } from "react-intl";
import { Duration } from "src/types/modules/clientsManagement/discounts/discountRules";
import * as yup from "yup";

const discountRulesValidationSchema = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  return yup.object({
    isPercent: yup.boolean(),
    code: yup.string().required(String(messages["validation.required"])),
    duration: yup.string().required(String(messages["validation.required"])),
    startDate: yup.string().required(String(messages["validation.required"])),
    expirationDate: yup
      .string()
      .required(String(messages["validation.required"])),

    amountOff: yup
      .number()
      .nullable()
      .when("isPercent", {
        is: (isPercent: boolean) => !isPercent,
        then: () =>
          yup
            .number()
            .nullable()
            .typeError(String(messages["validation.required"]))
            .required(String(messages["validation.required"]))
            .moreThan(0, String(messages["validation.positive"])),
        otherwise: () => yup.number().nullable().notRequired(),
      }),

    percentOff: yup
      .number()
      .nullable()
      .when("isPercent", {
        is: (isPercent: boolean) => isPercent,
        then: () =>
          yup
            .number()
            .nullable()
            .typeError(String(messages["validation.required"]))
            .required(String(messages["validation.required"]))
            .moreThan(0, String(messages["validation.percent"]))
            .lessThan(100, String(messages["validation.percent"])),
        otherwise: () => yup.number().nullable().notRequired(),
      }),

    durationInMonths: yup
      .number()
      .nullable()
      .when("duration", {
        is: (val: string) => val === Duration.Repeating,
        then: () =>
          yup
            .number()
            .nullable()
            .positive(String(messages["validation.positive"]))
            .required(String(messages["validation.required"])),
        otherwise: () => yup.number().nullable().notRequired(),
      }),
  });
};

export default discountRulesValidationSchema;
