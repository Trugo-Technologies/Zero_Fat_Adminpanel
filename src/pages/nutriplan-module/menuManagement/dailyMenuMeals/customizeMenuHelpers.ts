/** @format */

export enum CustomizeMenuMacroType {
  Protein = "Protein",
  Carbs = "Carbs",
  Fiber = "Fiber",
}

export const CUSTOMIZE_MENU_MACRO_OPTIONS = [
  {
    value: CustomizeMenuMacroType.Protein,
    labelKey: "dailyMenuMeals.macro.Protein",
    fallback: "Protein",
  },
  {
    value: CustomizeMenuMacroType.Carbs,
    labelKey: "dailyMenuMeals.macro.Carbs",
    fallback: "Carbs",
  },
  {
    value: CustomizeMenuMacroType.Fiber,
    labelKey: "dailyMenuMeals.macro.Fiber",
    fallback: "Fiber",
  },
] as const;

export const isCustomizeMealPlan = (plan?: {
  isCustomize?: boolean;
  code?: string;
  nameEn?: string;
  nameAr?: string;
} | null): boolean => {
  if (!plan) return false;
  if (plan.isCustomize) return true;
  if ((plan.code || "").toUpperCase() === "CUSTOMIZE") return true;
  const name = `${plan.nameEn || ""} ${plan.nameAr || ""}`.toLowerCase();
  return name.includes("customize") || name.includes("مخصص");
};
