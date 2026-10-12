/** @format */

import { MessageFormatElement } from "react-intl";
import {
  CustomizeMacroType,
  ICustomizePricingTier,
} from "src/types/modules/nutriplan/customizePricing";
import * as yup from "yup";

export type CustomizePricingExistingTier = Pick<
  ICustomizePricingTier,
  "id" | "macroType" | "fromGrams" | "toGrams"
>;

const rangesOverlap = (
  fromA: number,
  toA: number,
  fromB: number,
  toB: number
) => fromA <= toB && fromB <= toA;

const customizePricingValidationSchema = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>,
  existingTiers: CustomizePricingExistingTier[] = [],
  excludeId?: string
) => {
  const required = String(messages["validation.required"]);
  const positive = String(messages["validation.positive"] || required);
  const fromMin = String(
    messages["customizePricing.validation.fromMin"] || "Min 50 g"
  );
  const fromMax = String(
    messages["customizePricing.validation.fromMax"] || "Max 200 g"
  );
  const toMin = String(
    messages["customizePricing.validation.toMin"] || "Min 50 g"
  );
  const toMax = String(
    messages["customizePricing.validation.toMax"] || "Max 200 g"
  );
  const duplicateMsg = String(
    messages["customizePricing.validation.duplicateRange"] ||
      "A pricing tier with this macro and grams range already exists"
  );

  const isDuplicateRange = (
    macroType: CustomizeMacroType,
    fromGrams: number,
    toGrams: number
  ) =>
    existingTiers.some(
      (tier) =>
        tier.id !== excludeId &&
        tier.macroType === macroType &&
        rangesOverlap(fromGrams, toGrams, tier.fromGrams, tier.toGrams)
    );

  return yup.object({
    macroType: yup.string().required(required),
    fromGrams: yup
      .number()
      .typeError(required)
      .required(required)
      .min(50, fromMin)
      .max(200, fromMax),
    toGrams: yup
      .number()
      .typeError(required)
      .required(required)
      .min(50, toMin)
      .max(200, toMax)
      .test(
        "gte-from",
        String(messages["customizePricing.validation.toGrams"] || required),
        function (value) {
          const from = this.parent.fromGrams;
          if (typeof from !== "number" || typeof value !== "number") return true;
          return value >= from;
        }
      )
      .test("unique-range", duplicateMsg, function (value) {
        const { macroType, fromGrams } = this.parent;
        if (
          typeof fromGrams !== "number" ||
          typeof value !== "number" ||
          !macroType
        ) {
          return true;
        }
        return !isDuplicateRange(
          macroType as CustomizeMacroType,
          fromGrams,
          value
        );
      }),
    price: yup
      .number()
      .typeError(required)
      .required(required)
      .min(0, positive),
    isActive: yup.boolean(),
  });
};

export default customizePricingValidationSchema;
