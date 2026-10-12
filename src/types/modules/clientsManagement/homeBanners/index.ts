/** @format */

import {
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";
import { PreferredDeliveryTime } from "src/types/modules/clientsManagement/clientSubscriptions";

/** Who can see this home offer — API Audience enum */
export enum HomeBannerAudience {
  All = "All",
  FirstTime = "FirstTime",
  Active = "Active",
  Expired = "Expired",
}

/** Plan duration — API Duration enum */
export enum HomeBannerSubscriptionPlan {
  Weekly = "Weekly",
  OneMonth = "OneMonth",
  ThreeMonths = "ThreeMonths",
}

/**
 * Default `Days` (delivery date count) when Plan Duration changes —
 * same mins as Create Subscription (`getMinDeliveryDatesForDuration`).
 * Field stays editable; max for reference: Weekly 6, OneMonth 24, ThreeMonths 72.
 */
export const HOME_BANNER_SUBSCRIPTION_PLAN_DAYS: Record<
  HomeBannerSubscriptionPlan,
  number
> = {
  [HomeBannerSubscriptionPlan.Weekly]: 4,
  [HomeBannerSubscriptionPlan.OneMonth]: 16,
  [HomeBannerSubscriptionPlan.ThreeMonths]: 48,
};

/** Max delivery dates for each package duration (6 × weeks). */
export const HOME_BANNER_SUBSCRIPTION_PLAN_MAX_DAYS: Record<
  HomeBannerSubscriptionPlan,
  number
> = {
  [HomeBannerSubscriptionPlan.Weekly]: 6,
  [HomeBannerSubscriptionPlan.OneMonth]: 24,
  [HomeBannerSubscriptionPlan.ThreeMonths]: 72,
};

/** .NET DayOfWeek: Sunday=0 … Saturday=6 */
export const HOME_BANNER_DELIVERY_DAY_OPTIONS = [
  { value: 1, labelKey: "homeBanners.deliveryDay.Monday", fallback: "Monday" },
  { value: 2, labelKey: "homeBanners.deliveryDay.Tuesday", fallback: "Tuesday" },
  {
    value: 3,
    labelKey: "homeBanners.deliveryDay.Wednesday",
    fallback: "Wednesday",
  },
  {
    value: 4,
    labelKey: "homeBanners.deliveryDay.Thursday",
    fallback: "Thursday",
  },
  { value: 5, labelKey: "homeBanners.deliveryDay.Friday", fallback: "Friday" },
  {
    value: 6,
    labelKey: "homeBanners.deliveryDay.Saturday",
    fallback: "Saturday",
  },
  { value: 0, labelKey: "homeBanners.deliveryDay.Sunday", fallback: "Sunday" },
] as const;

export type HomeBannerDeliveryDay =
  (typeof HOME_BANNER_DELIVERY_DAY_OPTIONS)[number]["value"];

export const HOME_BANNER_DELIVERY_TIME_OPTIONS = [
  {
    value: PreferredDeliveryTime.EarlyMorning,
    labelKey: "homeBanners.deliveryTime.EarlyMorning",
    fallback: "Early morning (3 am – 7 am)",
  },
  {
    value: PreferredDeliveryTime.Morning,
    labelKey: "homeBanners.deliveryTime.Morning",
    fallback: "Morning (8 am – 12 pm)",
  },
  {
    value: PreferredDeliveryTime.Evening,
    labelKey: "homeBanners.deliveryTime.Evening",
    fallback: "Evening",
  },
] as const;

export const HOME_BANNER_MAX_MEAL_QUANTITY = 10;

/** Same weekday limits as Create Subscription schedule. */
export const HOME_BANNER_MIN_DELIVERY_DAYS = 4;
export const HOME_BANNER_MAX_DELIVERY_DAYS = 6;
/** Saturday — disabled like subscription wizard. */
export const HOME_BANNER_DISABLED_DELIVERY_DAYS = [6] as const;

export interface IHomeBannerMealMacro {
  proteinGrams: number | "" | null;
  carbsGrams: number | "" | null;
  fiberGrams: number | "" | null;
}

export const emptyHomeBannerMealMacro = (): IHomeBannerMealMacro => ({
  proteinGrams: "",
  carbsGrams: "",
  fiberGrams: "",
});

/** Keep macros array length in sync with quantityPerDay (Customize). */
export const syncHomeBannerMealMacros = (
  quantity: number,
  existing?: IHomeBannerMealMacro[] | null,
  seed?: IHomeBannerMealMacro | null
): IHomeBannerMealMacro[] => {
  const qty = Math.max(1, quantity || 1);
  const current = [...(existing || [])];
  while (current.length < qty) {
    current.push(
      seed
        ? { ...seed }
        : emptyHomeBannerMealMacro()
    );
  }
  if (current.length > qty) {
    current.length = qty;
  }
  return current;
};

export interface IHomeBannerMealTypeSelection {
  mealTypeId: string;
  quantityPerDay: number;
  mealTypeNameEn?: string | null;
  mealTypeNameAr?: string | null;
  /**
   * One macro set per quantity unit (Customize).
   * Length should match quantityPerDay.
   */
  macros?: IHomeBannerMealMacro[];
  /** @deprecated Prefer `macros[0]` — kept for older form state. */
  proteinGrams?: number | "" | null;
  carbsGrams?: number | "" | null;
  fiberGrams?: number | "" | null;
}

export const getHomeBannerMealsPerDay = (
  selections: IHomeBannerMealTypeSelection[] | undefined
) =>
  (selections || []).reduce(
    (sum, item) => sum + (Number(item.quantityPerDay) || 0),
    0
  );

export interface IHomeBanner {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  badgeTextEn: string;
  badgeTextAr: string;
  /** Relative image path from API */
  imageUrl: string | null;
  planIds: string[];
  mealPlanNamesEn?: string[];
  mealPlanNamesAr?: string[];
  mealTypeSelections: IHomeBannerMealTypeSelection[];
  mealTypeIds: string[];
  subscriptionPlanType: HomeBannerSubscriptionPlan;
  mealsPerDay: number;
  snacksPerDay: number;
  durationDays: number;
  freeDelivery: boolean;
  preferredDeliveryTime: PreferredDeliveryTime | string;
  deliveryDays: number[];
  audienceType: HomeBannerAudience;
  originalPrice: number;
  salePrice: number;
  currency: string;
  sortOrder: number;
  isActive: boolean;
  /** Customize meal plan macros (optional; used when plan is Customize). */
  proteinGrams?: number | null;
  carbsGrams?: number | null;
  fiberGrams?: number | null;
  createdOn?: string;
  lastModifiedOn?: string;
  createdByName?: string;
  lastModifiedByName?: string;
}

export interface IHomeBannerFormValues {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  badgeTextEn: string;
  badgeTextAr: string;
  image: string | File | null;
  imageUrl: string;
  planIds: string[];
  mealTypeSelections: IHomeBannerMealTypeSelection[];
  mealTypeIds: string[];
  subscriptionPlanType: HomeBannerSubscriptionPlan;
  mealsPerDay: number | "";
  snacksPerDay: number | "";
  durationDays: number | "";
  freeDelivery: boolean;
  preferredDeliveryTime: PreferredDeliveryTime | string;
  deliveryDays: number[];
  audienceType: HomeBannerAudience;
  originalPrice: number | "";
  salePrice: number | "";
  currency: string;
  sortOrder: number | "";
  isActive: boolean;
  /** Customize meal plan — required when Customize is selected. */
  proteinGrams: number | "";
  carbsGrams: number | "";
  fiberGrams: number | "";
  /** Form-only flag for Yup when Customize plan is selected. */
  _isCustomizePlan?: boolean;
}

export interface IHomeBannerApiItem {
  id?: string;
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  offerBadgeEn?: string;
  offerBadgeAr?: string;
  mealPlanIds?: string[];
  mealPlans?: Array<{
    id?: string;
    nameEn?: string;
    nameAr?: string;
  }>;
  mealTypeQuantities?: Array<{
    mealTypeId?: string;
    name?: string | null;
    quantityPerDay?: number;
    quantity?: number;
    mealTypeNameEn?: string;
    mealTypeNameAr?: string;
    proteinGrams?: number | null;
    carbsGrams?: number | null;
    fiberGrams?: number | null;
    macroInstances?: Array<{
      proteinGrams?: number | null;
      carbsGrams?: number | null;
      fiberGrams?: number | null;
    }>;
    mealType?: { id?: string; nameEn?: string; nameAr?: string };
  }>;
  audience?: string;
  duration?: string;
  deliveryTime?: string;
  deliveryDays?: number[];
  mealsPerDay?: number;
  snacksPerDay?: number;
  days?: number;
  originalPrice?: number;
  salePrice?: number;
  sortOrder?: number;
  freeDelivery?: boolean;
  isActive?: boolean;
  proteinGrams?: number | null;
  carbsGrams?: number | null;
  fiberGrams?: number | null;
  image?: string | null;
  imageUrl?: string | null;
  imagePath?: string | null;
  createdOn?: string;
  lastModifiedOn?: string;
  createdByName?: string;
  lastModifiedByName?: string;
  [key: string]: unknown;
}

export interface IHomeBannersListDto
  extends IBaseResponseListDto<IHomeBannerApiItem> {}

export interface IHomeBannerDetailsDto
  extends IBaseResponseDetailsDto<IHomeBannerApiItem> {}

const toNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeDuration = (value: unknown): HomeBannerSubscriptionPlan => {
  const raw = String(value || "");
  if (
    raw === HomeBannerSubscriptionPlan.Weekly ||
    raw === "Weekly" ||
    raw === "0"
  ) {
    return HomeBannerSubscriptionPlan.Weekly;
  }
  if (
    raw === HomeBannerSubscriptionPlan.ThreeMonths ||
    raw === "ThreeMonths" ||
    raw === "3" ||
    raw === "2"
  ) {
    return HomeBannerSubscriptionPlan.ThreeMonths;
  }
  // OneMonth / Monthly / legacy
  return HomeBannerSubscriptionPlan.OneMonth;
};

const normalizeAudience = (value: unknown): HomeBannerAudience => {
  const raw = String(value || "");
  if (raw === "FirstTime" || raw === HomeBannerAudience.FirstTime) {
    return HomeBannerAudience.FirstTime;
  }
  if (
    raw === "Active" ||
    raw === "ActiveSubscriber" ||
    raw === HomeBannerAudience.Active
  ) {
    return HomeBannerAudience.Active;
  }
  if (
    raw === "Expired" ||
    raw === "ExpiredSubscriber" ||
    raw === HomeBannerAudience.Expired
  ) {
    return HomeBannerAudience.Expired;
  }
  return HomeBannerAudience.All;
};

const normalizeDeliveryDays = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((day) => {
      if (typeof day === "number" && Number.isFinite(day)) return day;
      const name = String(day);
      const found = HOME_BANNER_DELIVERY_DAY_OPTIONS.find(
        (opt) =>
          opt.fallback === name ||
          opt.labelKey.endsWith(`.${name}`) ||
          String(opt.value) === name
      );
      return found ? found.value : NaN;
    })
    .filter((day) => Number.isFinite(day));
};

export const mapHomeBannerApiToUi = (
  item: IHomeBannerApiItem
): IHomeBanner => {
  const packageProtein =
    item.proteinGrams != null ? toNumber(item.proteinGrams) : null;
  const packageCarbs =
    item.carbsGrams != null ? toNumber(item.carbsGrams) : null;
  const packageFiber =
    item.fiberGrams != null ? toNumber(item.fiberGrams) : null;
  const packageSeed: IHomeBannerMealMacro | null =
    packageProtein != null || packageCarbs != null || packageFiber != null
      ? {
          proteinGrams: packageProtein ?? "",
          carbsGrams: packageCarbs ?? "",
          fiberGrams: packageFiber ?? "",
        }
      : null;

  // Prefer API macroInstances; fall back to legacy flat / duplicate rows
  const grouped = new Map<string, IHomeBannerMealTypeSelection>();
  (item.mealTypeQuantities || []).forEach((row) => {
    const mealTypeId = row.mealTypeId || row.mealType?.id || "";
    if (!mealTypeId) return;

    const qty = Math.max(1, toNumber(row.quantityPerDay ?? row.quantity, 1));
    const nameEn =
      row.mealTypeNameEn || row.mealType?.nameEn || row.name || null;
    const nameAr =
      row.mealTypeNameAr || row.mealType?.nameAr || row.name || null;

    const fromInstances: IHomeBannerMealMacro[] | null =
      Array.isArray(row.macroInstances) && row.macroInstances.length > 0
        ? row.macroInstances.map((macro) => ({
            proteinGrams:
              macro.proteinGrams != null
                ? toNumber(macro.proteinGrams)
                : "",
            carbsGrams:
              macro.carbsGrams != null ? toNumber(macro.carbsGrams) : "",
            fiberGrams:
              macro.fiberGrams != null ? toNumber(macro.fiberGrams) : "",
          }))
        : null;

    const rowMacro: IHomeBannerMealMacro = {
      proteinGrams:
        row.proteinGrams != null
          ? toNumber(row.proteinGrams)
          : packageSeed?.proteinGrams ?? "",
      carbsGrams:
        row.carbsGrams != null
          ? toNumber(row.carbsGrams)
          : packageSeed?.carbsGrams ?? "",
      fiberGrams:
        row.fiberGrams != null
          ? toNumber(row.fiberGrams)
          : packageSeed?.fiberGrams ?? "",
    };

    const macrosForRow =
      fromInstances ||
      Array.from({ length: qty }, () => ({ ...rowMacro }));

    const existing = grouped.get(mealTypeId);
    if (!existing) {
      grouped.set(mealTypeId, {
        mealTypeId,
        quantityPerDay: fromInstances ? fromInstances.length || qty : qty,
        mealTypeNameEn: nameEn,
        mealTypeNameAr: nameAr,
        macros: macrosForRow,
        proteinGrams: row.proteinGrams != null ? toNumber(row.proteinGrams) : null,
        carbsGrams: row.carbsGrams != null ? toNumber(row.carbsGrams) : null,
        fiberGrams: row.fiberGrams != null ? toNumber(row.fiberGrams) : null,
      });
      return;
    }

    // Legacy: another API row for same meal type → extra units
    const mergedMacros = [...(existing.macros || []), ...macrosForRow];
    grouped.set(mealTypeId, {
      ...existing,
      quantityPerDay: mergedMacros.length,
      mealTypeNameEn: existing.mealTypeNameEn || nameEn,
      mealTypeNameAr: existing.mealTypeNameAr || nameAr,
      macros: mergedMacros,
    });
  });

  const seededSelections = Array.from(grouped.values()).map((sel) => ({
    ...sel,
    macros: syncHomeBannerMealMacros(
      sel.quantityPerDay,
      sel.macros,
      packageSeed
    ),
  }));

  const planIds =
    item.mealPlanIds?.length
      ? item.mealPlanIds
      : (item.mealPlans || [])
          .map((p) => p.id)
          .filter((id): id is string => !!id);

  const imagePath =
    (typeof item.image === "string" && item.image) ||
    (typeof item.imageUrl === "string" && item.imageUrl) ||
    (typeof item.imagePath === "string" && item.imagePath) ||
    null;

  const duration = normalizeDuration(item.duration);
  const days =
    typeof item.days === "number"
      ? item.days
      : HOME_BANNER_SUBSCRIPTION_PLAN_DAYS[duration];

  return {
    id: item.id || "",
    titleEn: item.nameEn || "",
    titleAr: item.nameAr || "",
    descriptionEn: item.descriptionEn || "",
    descriptionAr: item.descriptionAr || "",
    badgeTextEn: item.offerBadgeEn || "",
    badgeTextAr: item.offerBadgeAr || "",
    imageUrl: imagePath,
    planIds,
    mealPlanNamesEn: (item.mealPlans || [])
      .map((p) => p.nameEn)
      .filter((n): n is string => !!n),
    mealPlanNamesAr: (item.mealPlans || [])
      .map((p) => p.nameAr)
      .filter((n): n is string => !!n),
    mealTypeSelections: seededSelections,
    mealTypeIds: seededSelections.map((s) => s.mealTypeId).filter(Boolean),
    subscriptionPlanType: duration,
    mealsPerDay:
      typeof item.mealsPerDay === "number"
        ? item.mealsPerDay
        : getHomeBannerMealsPerDay(seededSelections),
    snacksPerDay: toNumber(item.snacksPerDay, 0),
    durationDays: days,
    freeDelivery: !!item.freeDelivery,
    preferredDeliveryTime:
      (item.deliveryTime as PreferredDeliveryTime) ||
      PreferredDeliveryTime.EarlyMorning,
    deliveryDays: normalizeDeliveryDays(item.deliveryDays),
    audienceType: normalizeAudience(item.audience),
    originalPrice: toNumber(item.originalPrice),
    salePrice: toNumber(item.salePrice),
    currency: "AED",
    sortOrder: toNumber(item.sortOrder, 1),
    isActive: !!item.isActive,
    proteinGrams: packageProtein,
    carbsGrams: packageCarbs,
    fiberGrams: packageFiber,
    createdOn: item.createdOn,
    lastModifiedOn: item.lastModifiedOn,
    createdByName: item.createdByName,
    lastModifiedByName: item.lastModifiedByName,
  };
};

export const buildHomeBannerFormData = (
  values: IHomeBannerFormValues,
  options?: { id?: string }
): FormData => {
  const formData = new FormData();
  if (options?.id) {
    formData.append("Id", options.id);
  }

  const toOptionalNumber = (value: unknown): number | null => {
    if (value === "" || value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };

  const isCustomize = !!values._isCustomizePlan;

  type QuantityRow = {
    mealTypeId: string;
    quantityPerDay: number;
    name: string;
    proteinGrams: number | null;
    carbsGrams: number | null;
    fiberGrams: number | null;
    macroInstances: Array<{
      proteinGrams: number | null;
      carbsGrams: number | null;
      fiberGrams: number | null;
    }>;
  };

  const mealTypeSelections: QuantityRow[] = (values.mealTypeSelections || []).map(
    (item) => {
      const qty = Math.max(1, Number(item.quantityPerDay) || 1);
      const name = (item.mealTypeNameEn || item.mealTypeNameAr || "").trim();
      const macros = syncHomeBannerMealMacros(
        qty,
        item.macros,
        item.proteinGrams != null || item.carbsGrams != null
          ? {
              proteinGrams: item.proteinGrams ?? "",
              carbsGrams: item.carbsGrams ?? "",
              fiberGrams: item.fiberGrams ?? "",
            }
          : null
      );

      const macroInstances = isCustomize
        ? macros.map((macro) => ({
            proteinGrams: toOptionalNumber(macro.proteinGrams),
            carbsGrams: toOptionalNumber(macro.carbsGrams),
            fiberGrams: toOptionalNumber(macro.fiberGrams),
          }))
        : [];

      const sumOrNull = (
        key: "proteinGrams" | "carbsGrams" | "fiberGrams"
      ): number | null => {
        if (!macroInstances.length) return null;
        const values = macroInstances
          .map((m) => m[key])
          .filter((n): n is number => n != null);
        if (!values.length) return null;
        return values.reduce((a, b) => a + b, 0);
      };

      return {
        mealTypeId: item.mealTypeId,
        quantityPerDay: qty,
        name,
        proteinGrams: isCustomize ? sumOrNull("proteinGrams") : null,
        carbsGrams: isCustomize ? sumOrNull("carbsGrams") : null,
        fiberGrams: isCustomize ? sumOrNull("fiberGrams") : null,
        macroInstances,
      };
    }
  );

  const mealsPerDay =
    getHomeBannerMealsPerDay(values.mealTypeSelections) ||
    toNumber(values.mealsPerDay, 0);
  const duration =
    values.subscriptionPlanType || HomeBannerSubscriptionPlan.OneMonth;
  const days =
    typeof values.durationDays === "number"
      ? values.durationDays
      : HOME_BANNER_SUBSCRIPTION_PLAN_DAYS[duration];

  formData.append("NameEn", values.titleEn.trim());
  formData.append("NameAr", values.titleAr.trim());
  formData.append("DescriptionEn", values.descriptionEn.trim());
  formData.append("DescriptionAr", values.descriptionAr.trim());
  formData.append("OfferBadgeEn", values.badgeTextEn.trim());
  formData.append("OfferBadgeAr", values.badgeTextAr.trim());
  formData.append("Audience", values.audienceType || HomeBannerAudience.All);
  formData.append("Duration", duration);
  formData.append(
    "DeliveryTime",
    String(
      values.preferredDeliveryTime || PreferredDeliveryTime.EarlyMorning
    )
  );
  formData.append("MealsPerDay", String(mealsPerDay));
  formData.append(
    "SnacksPerDay",
    String(toNumber(values.snacksPerDay, 0))
  );
  formData.append("Days", String(days));
  formData.append(
    "OriginalPrice",
    String(toNumber(values.originalPrice, 0))
  );
  formData.append("SalePrice", String(toNumber(values.salePrice, 0)));
  formData.append("SortOrder", String(toNumber(values.sortOrder, 1)));
  formData.append("FreeDelivery", String(!!values.freeDelivery));
  formData.append("IsActive", String(!!values.isActive));

  // Package-level macros = sum of all per-unit macros
  const sumMacro = (
    key: "proteinGrams" | "carbsGrams" | "fiberGrams"
  ): number | null => {
    const fromRows = mealTypeSelections.reduce((sum, item) => {
      const n = item[key];
      return n != null ? sum + n : sum;
    }, 0);
    if (mealTypeSelections.some((item) => item[key] != null)) {
      return fromRows;
    }
    return toOptionalNumber(values[key]);
  };

  const proteinGrams = sumMacro("proteinGrams");
  const carbsGrams = sumMacro("carbsGrams");
  const fiberGrams = sumMacro("fiberGrams");

  if (proteinGrams != null) {
    formData.append("ProteinGrams", String(proteinGrams));
  }
  if (carbsGrams != null) {
    formData.append("CarbsGrams", String(carbsGrams));
  }
  if (fiberGrams != null) {
    formData.append("FiberGrams", String(fiberGrams));
  }

  (values.planIds || []).forEach((id) => {
    if (id) formData.append("MealPlanIds", id);
  });

  (values.deliveryDays || [])
    .filter(
      (day) =>
        !HOME_BANNER_DISABLED_DELIVERY_DAYS.includes(
          day as (typeof HOME_BANNER_DISABLED_DELIVERY_DAYS)[number]
        )
    )
    .forEach((day) => {
      formData.append("DeliveryDays", String(day));
    });

  mealTypeSelections.forEach((item, index) => {
    formData.append(
      `MealTypeQuantities[${index}].MealTypeId`,
      item.mealTypeId
    );
    formData.append(
      `MealTypeQuantities[${index}].QuantityPerDay`,
      String(item.quantityPerDay)
    );
    if (item.name) {
      formData.append(`MealTypeQuantities[${index}].Name`, item.name);
    }
    if (item.proteinGrams != null) {
      formData.append(
        `MealTypeQuantities[${index}].ProteinGrams`,
        String(item.proteinGrams)
      );
    }
    if (item.carbsGrams != null) {
      formData.append(
        `MealTypeQuantities[${index}].CarbsGrams`,
        String(item.carbsGrams)
      );
    }
    if (item.fiberGrams != null) {
      formData.append(
        `MealTypeQuantities[${index}].FiberGrams`,
        String(item.fiberGrams)
      );
    }
    item.macroInstances.forEach((macro, macroIndex) => {
      if (macro.proteinGrams != null) {
        formData.append(
          `MealTypeQuantities[${index}].MacroInstances[${macroIndex}].ProteinGrams`,
          String(macro.proteinGrams)
        );
      }
      if (macro.carbsGrams != null) {
        formData.append(
          `MealTypeQuantities[${index}].MacroInstances[${macroIndex}].CarbsGrams`,
          String(macro.carbsGrams)
        );
      }
      if (macro.fiberGrams != null) {
        formData.append(
          `MealTypeQuantities[${index}].MacroInstances[${macroIndex}].FiberGrams`,
          String(macro.fiberGrams)
        );
      }
    });
  });

  if (values.image instanceof File) {
    formData.append("Image", values.image);
  }

  return formData;
};

export const getHomeBannerDeliveryDayLabel = (
  day: number,
  messages: Record<string, string>
) => {
  const option = HOME_BANNER_DELIVERY_DAY_OPTIONS.find(
    (opt) => opt.value === day
  );
  if (!option) return String(day);
  return messages[option.labelKey] || option.fallback;
};

export const formatHomeBannerPlanSummary = (item: {
  mealsPerDay: number;
  snacksPerDay: number;
  durationDays: number;
  freeDelivery: boolean;
}) => {
  const meals =
    item.snacksPerDay > 0
      ? `${item.mealsPerDay} meals + ${item.snacksPerDay} snacks/day`
      : `${item.mealsPerDay} meals/day`;
  const days = `${item.durationDays} days`;
  const delivery = item.freeDelivery ? "Free delivery" : null;
  return [meals, days, delivery].filter(Boolean).join(" • ");
};
