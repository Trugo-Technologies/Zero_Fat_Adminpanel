/** @format */

import * as yup from "yup";

export const getChallengeValidationSchema = (messages: Record<string, string>) =>
  yup.object({
    title: yup.string().required(String(messages["validation.required"])),
    subtitle: yup.string().required(String(messages["validation.required"])),
    badgeLabel: yup.string().required(String(messages["validation.required"])),
    month: yup.string().required(String(messages["validation.required"])),
    startDate: yup.string().required(String(messages["validation.required"])),
    endDate: yup.string().required(String(messages["validation.required"])),
    isFeaturedOnHome: yup.boolean(),
  });
