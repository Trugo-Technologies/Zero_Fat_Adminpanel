/** @format */

import { MessageFormatElement } from "react-intl";
import {
  HomeBannerSubscriptionPlan,
  HOME_BANNER_MAX_DELIVERY_DAYS,
  HOME_BANNER_MIN_DELIVERY_DAYS,
} from "src/types/modules/clientsManagement/homeBanners";
import * as yup from "yup";

const isFilledMacro = (value: unknown) =>
  value !== "" &&
  value != null &&
  !Number.isNaN(Number(value)) &&
  Number(value) >= 0;

const homeBannersValidationSchema = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const required = String(messages["validation.required"]);
  const positive = String(messages["validation.positive"] || required);
  const deliveryDaysMsg = `Select ${HOME_BANNER_MIN_DELIVERY_DAYS}–${HOME_BANNER_MAX_DELIVERY_DAYS} delivery days`;

  return yup.object({
    titleEn: yup.string().required(required),
    titleAr: yup.string().required(required),
    descriptionEn: yup.string().required(required),
    descriptionAr: yup.string().required(required),
    badgeTextEn: yup.string().required(required),
    badgeTextAr: yup.string().required(required),
    planIds: yup.array().of(yup.string()).min(1, required),
    mealTypeIds: yup.array().of(yup.string()).min(1, required),
    _isCustomizePlan: yup.boolean(),
    mealTypeSelections: yup
      .array()
      .of(
        yup.object({
          mealTypeId: yup.string().required(required),
          quantityPerDay: yup
            .number()
            .typeError(required)
            .required(required)
            .min(1, positive),
          macros: yup.array().of(
            yup.object({
              proteinGrams: yup.mixed().nullable(),
              carbsGrams: yup.mixed().nullable(),
              fiberGrams: yup.mixed().nullable(),
            })
          ),
        })
      )
      .min(1, required)
      .test("customize-macros-required", required, function (selections) {
        const isCustomize = this.parent?._isCustomizePlan;
        if (!isCustomize || !selections?.length) return true;
        return selections.every((item) => {
          const qty = Math.max(1, Number(item.quantityPerDay) || 1);
          const macros = item.macros || [];
          if (macros.length < qty) return false;
          return macros
            .slice(0, qty)
            .every(
              (macro) =>
                isFilledMacro(macro?.proteinGrams) &&
                isFilledMacro(macro?.carbsGrams)
            );
        });
      }),
    subscriptionPlanType: yup.string().required(required),
    mealsPerDay: yup
      .number()
      .typeError(required)
      .required(required)
      .min(1, positive),
    snacksPerDay: yup
      .number()
      .typeError(required)
      .required(required)
      .min(0, positive),
    durationDays: yup
      .number()
      .typeError(required)
      .required(required)
      .min(1, positive)
      .test(
        "weekly-matches-delivery-days",
        `For Weekly, Days must equal selected delivery days (${HOME_BANNER_MIN_DELIVERY_DAYS}–${HOME_BANNER_MAX_DELIVERY_DAYS})`,
        function (value) {
          if (
            this.parent.subscriptionPlanType !==
            HomeBannerSubscriptionPlan.Weekly
          )
            return true;
          const selected = (this.parent.deliveryDays || []).length;
          return value === selected;
        }
      ),
    freeDelivery: yup.boolean(),
    preferredDeliveryTime: yup.string().required(required),
    deliveryDays: yup
      .array()
      .of(yup.number())
      .min(HOME_BANNER_MIN_DELIVERY_DAYS, deliveryDaysMsg)
      .max(HOME_BANNER_MAX_DELIVERY_DAYS, deliveryDaysMsg)
      .required(required),
    audienceType: yup.string().required(required),
    originalPrice: yup
      .number()
      .typeError(required)
      .required(required)
      .moreThan(0, positive),
    salePrice: yup
      .number()
      .typeError(required)
      .required(required)
      .moreThan(0, positive),
    sortOrder: yup
      .number()
      .typeError(required)
      .required(required)
      .min(0, positive),
    isActive: yup.boolean(),
    proteinGrams: yup.mixed().nullable(),
    carbsGrams: yup.mixed().nullable(),
    fiberGrams: yup.mixed().nullable(),
  });
};

export default homeBannersValidationSchema;
