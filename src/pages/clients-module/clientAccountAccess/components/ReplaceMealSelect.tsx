import { Autocomplete, Stack, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useDebounce } from "src/@crema/hooks/useDebounce";
import { useGetMealsByPlanQuery } from "src/pages/nutriplan-module/menuManagement/dailyMenuMeals/services/api";
import {
  IAdminMealsByPlan,
  IMealsByPlanOption,
} from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";

type Props = {
  clientId: string;
  date: string;
  mealTypeId: string;
  /** Selected mealsbyPlan item `id` (dailyMenuMealId). */
  value: string;
  mealPlanId?: string;
  label: string;
  onChange: (
    mealId: string,
    mealName: string,
    dailyMenuMealId: string,
    mealPlanId: string
  ) => void;
  disabled?: boolean;
};

type PlanOption = {
  id: string;
  label: string;
};

type PlanMealOption = IMealsByPlanOption & {
  planId: string;
  label: string;
};

const mapPlanMeals = (
  plans: IAdminMealsByPlan[],
  getLabel: (nameEn: string, nameAr: string) => string
): PlanMealOption[] => {
  const items: PlanMealOption[] = [];
  const seenDailyMenuMealIds = new Set<string>();

  for (const plan of plans) {
    const planMeals = [...(plan.meals ?? []), ...(plan.customMeals ?? [])];

    for (const planMeal of planMeals) {
      const meal = planMeal.meal;
      if (!planMeal.id || !meal?.id || seenDailyMenuMealIds.has(planMeal.id)) {
        continue;
      }

      seenDailyMenuMealIds.add(planMeal.id);
      items.push({
        planId: plan.id,
        dailyMenuMealId: planMeal.id,
        mealId: meal.id,
        nameEn: meal.nameEn,
        nameAr: meal.nameAr,
        label: getLabel(meal.nameEn, meal.nameAr),
      });
    }
  }

  return items;
};

const toPlanOptions = (
  plans: IAdminMealsByPlan[],
  getLabel: (nameEn: string, nameAr: string) => string
): PlanOption[] =>
  plans.map((plan) => ({
    id: plan.id,
    label: getLabel(plan.nameEn, plan.nameAr),
  }));

const ReplaceMealSelect = ({
  clientId,
  date,
  mealTypeId,
  value,
  mealPlanId = "",
  label,
  onChange,
  disabled = false,
}: Props) => {
  const { locale, messages } = useIntl();
  const [selectedPlanId, setSelectedPlanId] = useState(mealPlanId);
  const [selectedPlanLabel, setSelectedPlanLabel] = useState("");
  const [planSearchInput, setPlanSearchInput] = useState("");
  const [mealSearchInput, setMealSearchInput] = useState("");

  const canQuery = Boolean(mealTypeId && date && clientId);

  const getLabel = (nameEn: string, nameAr: string) =>
    locale === "ar-SA" ? nameAr || nameEn : nameEn || nameAr;

  const planSearchTerm = planSearchInput.trim();
  const debouncedPlanSearch = useDebounce(planSearchTerm, 400);
  const debouncedMealSearch = useDebounce(mealSearchInput.trim(), 400);

  const planSearchParam =
    debouncedPlanSearch &&
    debouncedPlanSearch.toLowerCase() !== selectedPlanLabel.toLowerCase()
      ? debouncedPlanSearch
      : undefined;

  const { data: plansResponse, isFetching: isPlansFetching } =
    useGetMealsByPlanQuery(
      {
        mealTypeId,
        date,
        clientId,
        search: planSearchParam,
      },
      { skip: !canQuery }
    );

  const { data: mealsResponse, isFetching: isMealsFetching } =
    useGetMealsByPlanQuery(
      {
        mealTypeId,
        date,
        clientId,
        mealPlanId: selectedPlanId || undefined,
        search: debouncedMealSearch || undefined,
      },
      { skip: !canQuery || !selectedPlanId }
    );

  const planOptions = useMemo(
    () => toPlanOptions(plansResponse?.data ?? [], getLabel),
    [plansResponse?.data, locale]
  );

  const mealOptions = useMemo(
    () => mapPlanMeals(mealsResponse?.data ?? [], getLabel),
    [mealsResponse?.data, locale]
  );

  const selectedPlan =
    planOptions.find((plan) => plan.id === selectedPlanId) ?? null;
  const selectedMeal =
    mealOptions.find((meal) => meal.dailyMenuMealId === value) ?? null;

  useEffect(() => {
    if (mealPlanId) {
      setSelectedPlanId(mealPlanId);
    }
  }, [mealPlanId]);

  useEffect(() => {
    if (!selectedPlanId) return;
    const plan = planOptions.find((item) => item.id === selectedPlanId);
    if (!plan) return;

    if (!selectedPlanLabel) setSelectedPlanLabel(plan.label);
    if (!planSearchInput) setPlanSearchInput(plan.label);
  }, [planOptions, selectedPlanId, selectedPlanLabel, planSearchInput]);

  useEffect(() => {
    if (selectedPlanId || planOptions.length !== 1) return;
    setSelectedPlanId(planOptions[0].id);
    setSelectedPlanLabel(planOptions[0].label);
    setPlanSearchInput(planOptions[0].label);
  }, [planOptions, selectedPlanId]);

  const categoryLabel =
    (messages["clientAccountAccess.mealPlanCategory"] as string) ||
    "Meal plan";
  const searchPlaceholder =
    (messages["common.search"] as string) || "Search...";

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ flex: 1 }}>
      <Autocomplete
        fullWidth
        size="small"
        options={planOptions}
        value={selectedPlan}
        disabled={disabled}
        loading={isPlansFetching}
        filterOptions={(options) => options}
        inputValue={planSearchInput}
        onInputChange={(_event, inputValue, reason) => {
          if (reason === "reset") {
            if (selectedPlan) setPlanSearchInput(selectedPlan.label);
            return;
          }
          setPlanSearchInput(inputValue);
        }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        onChange={(_event, option) => {
          const nextPlanId = option?.id ?? "";
          setSelectedPlanId(nextPlanId);
          setSelectedPlanLabel(option?.label ?? "");
          setPlanSearchInput(option?.label ?? "");
          setMealSearchInput("");
          onChange("", "", "", nextPlanId);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={categoryLabel}
            placeholder={searchPlaceholder}
          />
        )}
        noOptionsText={
          isPlansFetching ? "Loading categories..." : "No categories available"
        }
      />

      <Autocomplete
        fullWidth
        size="small"
        options={mealOptions}
        value={selectedMeal}
        disabled={disabled || !selectedPlanId}
        loading={isMealsFetching}
        filterOptions={(options) => options}
        inputValue={
          selectedMeal && !mealSearchInput ? selectedMeal.label : mealSearchInput
        }
        onInputChange={(_event, inputValue, reason) => {
          if (reason === "reset") {
            setMealSearchInput("");
            return;
          }
          setMealSearchInput(inputValue);
        }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, selected) =>
          option.dailyMenuMealId === selected.dailyMenuMealId
        }
        onChange={(_event, option) => {
          if (!option) {
            setMealSearchInput("");
            onChange("", "", "", selectedPlanId);
            return;
          }

          setMealSearchInput("");
          onChange(
            option.mealId,
            option.label,
            option.dailyMenuMealId,
            selectedPlanId
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={
              selectedPlanId ? searchPlaceholder : "Select a meal plan first"
            }
          />
        )}
        noOptionsText={
          isMealsFetching
            ? "Loading meals..."
            : selectedPlanId
              ? "No meals available"
              : "Select a meal plan first"
        }
      />
    </Stack>
  );
};

export default ReplaceMealSelect;
