/** @format */

import { MessageFormatElement } from "react-intl";
import {
  PromoApplyMode,
  PromoDuration,
  PromoRewardType,
} from "src/types/modules/clientsManagement/discounts/promoCodes";
import * as yup from "yup";

const promoCodesValidationSchema = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const required = String(messages["validation.required"]);
  const positive = String(messages["validation.positive"]);
  const percent = String(messages["validation.percent"]);

  return yup.object({
    code: yup.string().required(required),
    duration: yup.string().required(required),
    startDate: yup.string().required(required),
    expirationDate: yup.string().required(required),
    applyMode: yup.string().required(required),
    eligibilityType: yup.string().required(required),
    rewardType: yup.string().required(required),
    bankIds: yup
      .array()
      .of(yup.string())
      .when("applyMode", {
        is: PromoApplyMode.AutoOnBank,
        then: (schema) =>
          schema.min(1, required).required(required),
        otherwise: (schema) => schema.notRequired(),
      }),
    amountOff: yup
      .number()
      .nullable()
      .when("rewardType", {
        is: PromoRewardType.Amount,
        then: () =>
          yup
            .number()
            .nullable()
            .typeError(required)
            .required(required)
            .moreThan(0, positive),
        otherwise: () => yup.number().nullable().notRequired(),
      }),
    percentOff: yup
      .number()
      .nullable()
      .when("rewardType", {
        is: PromoRewardType.Percent,
        then: () =>
          yup
            .number()
            .nullable()
            .typeError(required)
            .required(required)
            .moreThan(0, percent)
            .lessThan(100, percent),
        otherwise: () => yup.number().nullable().notRequired(),
      }),
    buyQuantity: yup
      .number()
      .nullable()
      .when("rewardType", {
        is: PromoRewardType.BuyXGetY,
        then: () =>
          yup
            .number()
            .nullable()
            .typeError(required)
            .required(required)
            .moreThan(0, positive),
        otherwise: () => yup.number().nullable().notRequired(),
      }),
    getQuantity: yup
      .number()
      .nullable()
      .when("rewardType", {
        is: PromoRewardType.BuyXGetY,
        then: () =>
          yup
            .number()
            .nullable()
            .typeError(required)
            .required(required)
            .moreThan(0, positive),
        otherwise: () => yup.number().nullable().notRequired(),
      }),
    durationInMonths: yup
      .number()
      .nullable()
      .when("duration", {
        is: (val: string) => val === PromoDuration.Repeating,
        then: () =>
          yup
            .number()
            .nullable()
            .positive(positive)
            .required(required),
        otherwise: () => yup.number().nullable().notRequired(),
      }),
  });
};

export default promoCodesValidationSchema;
