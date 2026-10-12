/** @format */

/** Helpers for display labels when API does not embed names */

export const formatHomeBannerPlanNames = (
  names: string[] | undefined,
  fallbackIds: string[] = []
) => {
  if (names?.length) return names.join(", ");
  if (fallbackIds.length) return fallbackIds.join(", ");
  return "—";
};

export const formatHomeBannerMealTypeNames = (
  selections:
    | {
        mealTypeId: string;
        quantityPerDay: number;
        mealTypeNameEn?: string | null;
        mealTypeNameAr?: string | null;
      }[]
    | undefined,
  locale = "en-US",
  lookup?: Array<{ id: string; nameEn: string; nameAr: string }>
) => {
  if (!selections?.length) return "—";
  return selections
    .map((item) => {
      const fromApi =
        locale === "en-US" ? item.mealTypeNameEn : item.mealTypeNameAr;
      const fromLookup = lookup?.find((m) => m.id === item.mealTypeId);
      const name =
        fromApi ||
        (fromLookup
          ? locale === "en-US"
            ? fromLookup.nameEn
            : fromLookup.nameAr
          : item.mealTypeId);
      const quantity = item.quantityPerDay || 1;
      return quantity > 1 ? `${name} × ${quantity}` : name;
    })
    .join(", ");
};
