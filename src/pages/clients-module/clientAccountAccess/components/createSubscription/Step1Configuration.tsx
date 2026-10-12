import { useEffect, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  alpha,
  useTheme,
  Divider,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SpaIcon from "@mui/icons-material/Spa";
import TuneIcon from "@mui/icons-material/Tune";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { useGetActiveMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import { useGetAllCustomizePricingQuery } from "src/pages/nutriplan-module/mealPlanning/customizePricing/services/api";
import { useGetSubscriptionWizardAddOnOptionsQuery } from "../../services/api";
import {
  DeliveryCalendarAddOnCategory,
  ICustomMealInstance,
  IDeliveryCalendarAddOnOption,
  ISubscriptionWizardMealTypeSelection,
} from "src/types/modules/clientsManagement/clientAccountAccess";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import {
  IMealPlans,
  isCustomizeMealPlanRow,
} from "src/types/modules/nutriplan/mealPlans";
import { mapCustomizePricingApiToUi } from "src/types/modules/nutriplan/customizePricing";
import {
  areCustomMealsValid,
  createCustomMealInstance,
  findCustomizeMealPlan,
  getCustomMealsTotalCarbs,
  getCustomMealsTotalFiber,
  getCustomMealsTotalProtein,
  getCustomMealInstancePrice,
  getCustomMealsTotalPrice,
  isCustomizeMacroOutOfRange,
  CUSTOMIZE_MACRO_GRAMS_MIN,
  CUSTOMIZE_MACRO_GRAMS_MAX,
  getMealPlanAvailableMealTypes,
  getMealPlanMealTypeOptions,
  getMealPlanMealTypesCount,
  getMealPlanTotalCalories,
  getMealTypeSelectionsTotalCalories,
  getMealTypeSelectionsTotalQuantity,
  isCustomizePlan,
  isExcludedCustomizeMealType,
} from "../../mealPlanHelpers";

export type CartItem = {
  id: string;
  name: string;
  nameAr?: string;
  category?: string;
  price: number;
  quantity: number;
};

const MAX_QUANTITY_PER_DAY = 10;

const ADD_ON_CATEGORIES: DeliveryCalendarAddOnCategory[] = [
  "Meals",
  "Snacks",
  "Drinks",
  "Supplements",
];

const planIcons = [
  <LocalFireDepartmentIcon sx={{ color: "primary.main" }} />,
  <RestaurantMenuIcon sx={{ color: "primary.main" }} />,
  <SpaIcon sx={{ color: "primary.main" }} />,
];

type Props = {
  clientId?: string | null;
  subscriptionMode: "new" | "renew";
  selectedPlan: string;
  setSelectedPlan: (val: string) => void;
  mealTypeSelections: ISubscriptionWizardMealTypeSelection[];
  setMealTypeSelections: React.Dispatch<
    React.SetStateAction<ISubscriptionWizardMealTypeSelection[]>
  >;
  customMealInstances: ICustomMealInstance[];
  setCustomMealInstances: React.Dispatch<
    React.SetStateAction<ICustomMealInstance[]>
  >;
  enableAddons: boolean;
  setEnableAddons: (val: boolean) => void;
  addonTab: number;
  setAddonTab: (val: number) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onNext: () => void | Promise<void>;
  onBack?: () => void;
  isSaving?: boolean;
};

const Step1Configuration = (props: Props) => {
  const theme = useTheme();
  const hasDefaultedMealPlan = useRef(false);
  const previousPlanId = useRef<string | undefined>();

  const { data: mealPlansResponse, isLoading: isMealPlansLoading } =
    useGetActiveMealPlansQuery();

  const mealPlans = mealPlansResponse?.data ?? [];

  const isCustomize = isCustomizePlan(props.selectedPlan, mealPlans);

  const { data: pricingResponse, isFetching: isPricingLoading } =
    useGetAllCustomizePricingQuery(
      { pageNumber: 1, pageSize: 200, isActive: true },
      { skip: !isCustomize }
    );

  const pricingTiers = useMemo(
    () => (pricingResponse?.data ?? []).map(mapCustomizePricingApiToUi),
    [pricingResponse?.data]
  );

  const selectedMealPlan = useMemo(
    () => mealPlans.find((plan) => plan.id === props.selectedPlan),
    [mealPlans, props.selectedPlan]
  );

  const customizeMealTypes = useMemo(
    () =>
      getMealPlanAvailableMealTypes(selectedMealPlan).filter(
        (mealType) => !isExcludedCustomizeMealType(mealType)
      ),
    [selectedMealPlan]
  );

  const mealTypeOptions = useMemo(
    () => getMealPlanMealTypeOptions(selectedMealPlan),
    [selectedMealPlan]
  );

  const totalMealQuantity = useMemo(
    () =>
      isCustomize
        ? props.customMealInstances.length
        : getMealTypeSelectionsTotalQuantity(props.mealTypeSelections),
    [isCustomize, props.customMealInstances.length, props.mealTypeSelections]
  );

  const selectedMealsCalories = useMemo(
    () =>
      getMealTypeSelectionsTotalCalories(
        selectedMealPlan,
        props.mealTypeSelections
      ),
    [selectedMealPlan, props.mealTypeSelections]
  );

  const customTotalProtein = useMemo(
    () => getCustomMealsTotalProtein(props.customMealInstances),
    [props.customMealInstances]
  );

  const customTotalCarbs = useMemo(
    () => getCustomMealsTotalCarbs(props.customMealInstances),
    [props.customMealInstances]
  );

  const customTotalFiber = useMemo(
    () => getCustomMealsTotalFiber(props.customMealInstances),
    [props.customMealInstances]
  );

  const customPrice = useMemo(
    () =>
      getCustomMealsTotalPrice(
        props.customMealInstances,
        pricingTiers,
        props.selectedPlan
      ),
    [props.customMealInstances, pricingTiers, props.selectedPlan]
  );

  const isMealSelectionComplete = isCustomize
    ? areCustomMealsValid(props.customMealInstances)
    : totalMealQuantity > 0;

  const handleSelectPlan = (planId: string) => {
    if (planId === props.selectedPlan) return;

    props.setSelectedPlan(planId);
    props.setMealTypeSelections([]);
    props.setCustomMealInstances([]);
  };

  useEffect(() => {
    if (!mealPlans.length || hasDefaultedMealPlan.current) return;

    const hasValidSelection = mealPlans.some(
      (plan: IMealPlans) => plan.id === props.selectedPlan
    );

    if (!props.selectedPlan || !hasValidSelection) {
      // Prefer Customize when present, otherwise first plan
      const customizePlan = findCustomizeMealPlan(mealPlans);
      props.setSelectedPlan(customizePlan?.id || mealPlans[0].id);
    }

    hasDefaultedMealPlan.current = true;
  }, [mealPlans, props.selectedPlan, props.setSelectedPlan]);

  useEffect(() => {
    if (!selectedMealPlan?.id) {
      previousPlanId.current = selectedMealPlan?.id;
      return;
    }

    const planChanged = previousPlanId.current !== selectedMealPlan.id;
    previousPlanId.current = selectedMealPlan.id;

    if (!planChanged) return;

    props.setMealTypeSelections((prev) => {
      const availableIds = new Set(
        mealTypeOptions.map((option) => option.mealType.id)
      );
      return prev.filter((selection) => availableIds.has(selection.mealTypeId));
    });
  }, [selectedMealPlan?.id, mealTypeOptions, props.setMealTypeSelections]);

  const activeCategory = ADD_ON_CATEGORIES[props.addonTab];

  const { data: addOnOptionsResponse, isFetching: isAddOnsLoading } =
    useGetSubscriptionWizardAddOnOptionsQuery({ category: activeCategory });

  const addOnOptions = addOnOptionsResponse?.data ?? [];

  const updateQuantity = (item: IDeliveryCalendarAddOnOption, delta: number) => {
    props.setCart((prevCart: CartItem[]) => {
      const existing = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prevCart.filter((cartItem) => cartItem.id !== item.id);
        }
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: newQty } : cartItem
        );
      }

      if (delta > 0) {
        return [
          ...prevCart,
          {
            id: item.id,
            name: item.nameEn,
            nameAr: item.nameAr,
            category: item.category,
            price: item.unitPrice,
            quantity: delta,
          },
        ];
      }

      return prevCart;
    });
  };

  const getQuantity = (id: string) => {
    return props.cart.find((c) => c.id === id)?.quantity || 0;
  };

  const toggleMealType = (mealType: IMealTypes) => {
    props.setMealTypeSelections((prev) => {
      const isSelected = prev.some(
        (selection) => selection.mealTypeId === mealType.id
      );

      if (isSelected) {
        return prev.filter((selection) => selection.mealTypeId !== mealType.id);
      }

      return [
        ...prev,
        {
          mealTypeId: mealType.id,
          name: mealType.nameEn,
          quantityPerDay: 1,
        },
      ];
    });
  };

  const updateMealQuantity = (mealTypeId: string, delta: number) => {
    props.setMealTypeSelections((prev) =>
      prev.map((selection) => {
        if (selection.mealTypeId !== mealTypeId) return selection;

        const nextQty = Math.min(
          MAX_QUANTITY_PER_DAY,
          Math.max(1, selection.quantityPerDay + delta)
        );

        return { ...selection, quantityPerDay: nextQty };
      })
    );
  };

  const getMealQuantity = (mealTypeId: string) =>
    props.mealTypeSelections.find((selection) => selection.mealTypeId === mealTypeId)
      ?.quantityPerDay ?? 0;

  const isMealTypeSelected = (mealTypeId: string) =>
    props.mealTypeSelections.some(
      (selection) => selection.mealTypeId === mealTypeId
    );

  const addCustomMeal = (mealType: IMealTypes) => {
    props.setCustomMealInstances((prev) => [
      ...prev,
      createCustomMealInstance(mealType),
    ]);
  };

  const removeCustomMeal = (localId: string) => {
    props.setCustomMealInstances((prev) =>
      prev.filter((item) => item.localId !== localId)
    );
  };

  const updateCustomMealMacro = (
    localId: string,
    field: "proteinG" | "carbsG" | "fiberG",
    raw: string
  ) => {
    props.setCustomMealInstances((prev) =>
      prev.map((item) => {
        if (item.localId !== localId) return item;
        if (raw === "") return { ...item, [field]: "" };
        const parsed = Number(raw);
        if (Number.isNaN(parsed) || parsed < 0) return item;
        return { ...item, [field]: parsed };
      })
    );
  };

  const getCustomMealLabel = (instance: ICustomMealInstance) => {
    const sameType = props.customMealInstances.filter(
      (item) => item.mealTypeId === instance.mealTypeId
    );
    if (sameType.length <= 1) return instance.name;
    const index = sameType.findIndex((item) => item.localId === instance.localId);
    return `${instance.name} ${index + 1}`;
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Meal Plan</Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 2 }}>
        Choose the best plan for your client.
      </Typography>
      {isMealPlansLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6, mb: 5 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Box sx={{ mb: 5 }}>
          {mealPlans.length === 0 ? (
            <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 1.5 }}>
              No meal plans available.
            </Typography>
          ) : null}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              gap: 2,
              overflowX: "auto",
              pb: 0.5,
            }}
          >
            {mealPlans.map((plan: IMealPlans, index: number) => {
              const isSelected = props.selectedPlan === plan.id;
              const planIsCustomize = isCustomizeMealPlanRow(plan);
              const totalCalories = getMealPlanTotalCalories(plan);
              const caloriesLabel =
                !planIsCustomize && totalCalories > 0
                  ? `${totalCalories} kcal`
                  : null;
              const mealTypesCount = getMealPlanMealTypesCount(plan);
              const mealsLabel =
                mealTypesCount > 0 ? `${mealTypesCount} meal types` : null;
              const subtitle = planIsCustomize
                ? "Choose meals & macros"
                : [caloriesLabel, mealsLabel].filter(Boolean).join(" • ");

              return (
                <Box
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan.id)}
                  sx={{
                    flex: "1 1 0",
                    minWidth: 180,
                    p: 2.5,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: isSelected ? "primary.main" : "#E2E8F0",
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, 0.02)
                      : "#FFFFFF",
                    position: "relative",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isSelected
                      ? "0 12px 24px -4px rgba(16, 185, 129, 0.15)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                      borderColor: isSelected ? "primary.main" : "#CBD5E1",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  {isSelected && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: "primary.main",
                        fontSize: 22,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                    }}
                  >
                    {planIsCustomize ? (
                      <TuneIcon sx={{ color: "primary.main" }} />
                    ) : (
                      planIcons[index % planIcons.length]
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#0F172A",
                      mb: 0.25,
                      pr: 3,
                    }}
                  >
                    {plan.nameEn}
                  </Typography>
                  {subtitle ? (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      {subtitle}
                    </Typography>
                  ) : null}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={isCustomize ? 4 : 6}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 0.5 }}>Meals Per Day</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
              {isCustomize
                ? "Total customized meals added below"
                : "Total meals based on your selections below"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #E2E8F0",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                bgcolor: "#F8FAFC",
                minHeight: 40,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                {totalMealQuantity > 0
                  ? `${totalMealQuantity} meal${totalMealQuantity === 1 ? "" : "s"}`
                  : "—"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={isCustomize ? 4 : 6}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
              {isCustomize ? "Macros" : "Calories"}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
              {isCustomize
                ? `Protein & carbs per meal: ${CUSTOMIZE_MACRO_GRAMS_MIN}–${CUSTOMIZE_MACRO_GRAMS_MAX}g (fiber optional)`
                : "Daily calorie intake based on selected meals"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #E2E8F0",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                bgcolor: "#F8FAFC",
                minHeight: 40,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                {isCustomize
                  ? customTotalProtein > 0 ||
                    customTotalCarbs > 0 ||
                    customTotalFiber > 0
                    ? `P ${customTotalProtein}g · C ${customTotalCarbs}g · F ${customTotalFiber}g`
                    : "—"
                  : selectedMealsCalories > 0
                    ? `${selectedMealsCalories} kcal`
                    : "—"}
              </Typography>
            </Box>
          </Grid>

          {isCustomize ? (
            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                Estimated Price
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
                From Customize Pricing tiers (protein + carbs)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  minHeight: 40,
                }}
              >
                <Typography
                  sx={{ fontSize: 16, fontWeight: 800, color: "primary.main" }}
                >
                  {isPricingLoading
                    ? "…"
                    : customPrice.total > 0
                      ? `${customPrice.total.toLocaleString()} ${customPrice.currency}`
                      : "—"}
                </Typography>
              </Box>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Divider sx={{ my: 1, borderColor: "#F1F5F9" }} />
          </Grid>

          <Grid item xs={12}>
            {isCustomize ? (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                  Meals Per Day
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
                  Tap a meal type to add it. Protein and carbs are required (50–200g); fiber is optional.
                </Typography>

                {customizeMealTypes.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    No meal types available on this Customize plan.
                  </Typography>
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                    {customizeMealTypes.map((mealType: IMealTypes) => {
                      const count = props.customMealInstances.filter(
                        (item) => item.mealTypeId === mealType.id
                      ).length;
                      return (
                        <Button
                          key={mealType.id}
                          variant={count > 0 ? "contained" : "outlined"}
                          size="small"
                          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                          onClick={() => addCustomMeal(mealType)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 1.5,
                          }}
                        >
                          {mealType.nameEn}
                          {count > 0 ? ` (${count})` : ""}
                        </Button>
                      );
                    })}
                  </Stack>
                )}

                {props.customMealInstances.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    Select meals above to set protein and carbs for each (fiber optional).
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {props.customMealInstances.map((instance) => {
                      const mealPrice = getCustomMealInstancePrice(
                        instance,
                        pricingTiers,
                        props.selectedPlan
                      );
                      return (
                      <Box
                        key={instance.localId}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid #E2E8F0",
                          bgcolor: "#F8FAFC",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1.5,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}
                          >
                            {getCustomMealLabel(instance)}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {mealPrice.total > 0 ? (
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: "primary.main",
                                }}
                              >
                                {mealPrice.total.toLocaleString()}{" "}
                                {mealPrice.currency}
                              </Typography>
                            ) : null}
                            <IconButton
                              size="small"
                              onClick={() => removeCustomMeal(instance.localId)}
                              sx={{ color: "text.secondary" }}
                            >
                              <CloseIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Protein (g)"
                              size="small"
                              type="number"
                              fullWidth
                              required
                              value={instance.proteinG}
                              error={isCustomizeMacroOutOfRange(
                                instance.proteinG
                              )}
                              onChange={(e) =>
                                updateCustomMealMacro(
                                  instance.localId,
                                  "proteinG",
                                  e.target.value
                                )
                              }
                              inputProps={{
                                min: CUSTOMIZE_MACRO_GRAMS_MIN,
                                max: CUSTOMIZE_MACRO_GRAMS_MAX,
                                step: 1,
                              }}
                              helperText={
                                isCustomizeMacroOutOfRange(instance.proteinG)
                                  ? `${CUSTOMIZE_MACRO_GRAMS_MIN}–${CUSTOMIZE_MACRO_GRAMS_MAX}g required`
                                  : mealPrice.proteinPrice > 0
                                    ? `${mealPrice.proteinPrice.toLocaleString()} ${mealPrice.currency}`
                                    : " "
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Carbs (g)"
                              size="small"
                              type="number"
                              fullWidth
                              required
                              value={instance.carbsG}
                              error={isCustomizeMacroOutOfRange(
                                instance.carbsG
                              )}
                              onChange={(e) =>
                                updateCustomMealMacro(
                                  instance.localId,
                                  "carbsG",
                                  e.target.value
                                )
                              }
                              inputProps={{
                                min: CUSTOMIZE_MACRO_GRAMS_MIN,
                                max: CUSTOMIZE_MACRO_GRAMS_MAX,
                                step: 1,
                              }}
                              helperText={
                                isCustomizeMacroOutOfRange(instance.carbsG)
                                  ? `${CUSTOMIZE_MACRO_GRAMS_MIN}–${CUSTOMIZE_MACRO_GRAMS_MAX}g required`
                                  : mealPrice.carbsPrice > 0
                                    ? `${mealPrice.carbsPrice.toLocaleString()} ${mealPrice.currency}`
                                    : " "
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Fiber (g)"
                              size="small"
                              type="number"
                              fullWidth
                              value={instance.fiberG}
                              onChange={(e) =>
                                updateCustomMealMacro(
                                  instance.localId,
                                  "fiberG",
                                  e.target.value
                                )
                              }
                              inputProps={{ min: 0, step: 1 }}
                              helperText="Optional"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      );
                    })}
                  </Stack>
                )}
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Meals Included</Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
                  Select meal types and adjust quantity for each. Total meals updates automatically.
                </Typography>
                {!selectedMealPlan ? (
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    Select a meal plan first.
                  </Typography>
                ) : mealTypeOptions.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    No meal types available for this plan.
                  </Typography>
                ) : (
                  <Grid container spacing={1.5}>
                    {mealTypeOptions.map(({ mealType, averageCalories }) => {
                      const isSelected = isMealTypeSelected(mealType.id);
                      const quantity = getMealQuantity(mealType.id);

                      return (
                        <Grid item xs={12} sm={6} key={mealType.id}>
                          <Box
                            onClick={() => toggleMealType(mealType)}
                            sx={{
                              px: 2,
                              py: 1.5,
                              borderRadius: 2,
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              border: "2px solid",
                              borderColor: isSelected ? "primary.main" : "#E2E8F0",
                              bgcolor: isSelected
                                ? alpha(theme.palette.primary.main, 0.05)
                                : "#fff",
                              "&:hover": {
                                borderColor: "primary.main",
                              },
                              transition: "all 0.2s",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.25,
                              }}
                            >
                              <Box
                                sx={{
                                  color: isSelected ? "primary.main" : "text.secondary",
                                  display: "flex",
                                  alignItems: "center",
                                  width: 24,
                                  height: 24,
                                  flexShrink: 0,
                                }}
                              >
                                {mealType.iconUrl ? (
                                  <Box
                                    component="img"
                                    src={mealType.iconUrl}
                                    alt={mealType.nameEn}
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : (
                                  <RestaurantMenuIcon sx={{ fontSize: 20 }} />
                                )}
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: isSelected ? "primary.main" : "#475569",
                                  }}
                                >
                                  {mealType.nameEn}
                                </Typography>
                                {averageCalories > 0 ? (
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: "text.secondary",
                                      mt: 0.25,
                                    }}
                                  >
                                    {averageCalories * (isSelected ? quantity : 1)} kcal
                                  </Typography>
                                ) : null}
                              </Box>
                              {isSelected ? (
                                <CheckCircleIcon
                                  sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
                                />
                              ) : null}
                            </Box>

                            {isSelected ? (
                              <Box
                                onClick={(event) => event.stopPropagation()}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 1,
                                  pl: 4.5,
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}
                                >
                                  Quantity
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 1.5,
                                    bgcolor: "#fff",
                                    px: 0.5,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => updateMealQuantity(mealType.id, -1)}
                                    disabled={quantity <= 1}
                                    sx={{ p: 0.5 }}
                                  >
                                    <RemoveIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                  <Typography
                                    sx={{
                                      minWidth: 20,
                                      textAlign: "center",
                                      fontSize: 13,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {quantity}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => updateMealQuantity(mealType.id, 1)}
                                    disabled={quantity >= MAX_QUANTITY_PER_DAY}
                                    sx={{ p: 0.5 }}
                                  >
                                    <AddIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            ) : null}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#0F172A", mb: 0.5 }}>Additional Items</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 2 }}>Configure extra items to be included with this subscription.</Typography>

        <Box sx={{ p: 2.5, borderRadius: 3, border: "1px solid #E2E8F0", bgcolor: "#fff" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={props.addonTab}
                onChange={(_, val) => props.setAddonTab(val)}
                aria-label="addon tabs"
                sx={{ minHeight: 40 }}
              >
                {ADD_ON_CATEGORIES.map((tab) => (
                  <Tab
                    key={tab}
                    label={tab}
                    sx={{ fontWeight: 600, textTransform: "none", fontSize: 13, minHeight: 40, py: 1 }}
                  />
                ))}
              </Tabs>
            </Box>

            {isAddOnsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : addOnOptions.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: "text.secondary", py: 3, textAlign: "center" }}>
                No add-on items available in {activeCategory}.
              </Typography>
            ) : (
            <Grid container spacing={1.5}>
              {addOnOptions.map((item) => {
                const qty = getQuantity(item.id);
                const isSelected = qty > 0;
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: isSelected ? "primary.main" : "#E2E8F0",
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.03) : "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      minHeight: 72,
                    }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#0F172A",
                            mb: 0.25,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.nameEn}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "text.secondary",
                            mb: 0.25,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.description}
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "primary.main" }}>
                          {item.unitPrice} AED
                        </Typography>
                      </Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.25}
                        sx={{
                          flexShrink: 0,
                          bgcolor: isSelected ? "primary.main" : "#fff",
                          border: "1px solid",
                          borderColor: isSelected ? "primary.main" : "#E2E8F0",
                          borderRadius: 1.5,
                          p: 0.25,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item, -1)}
                          sx={{ color: isSelected ? "#fff" : "text.secondary", p: 0.5 }}
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#fff" : "#0F172A", minWidth: 16, textAlign: "center" }}>
                          {qty}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item, 1)}
                          sx={{ color: isSelected ? "#fff" : "text.secondary", p: 0.5 }}
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            )}

            {props.cart.length > 0 && (
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #E2E8F0" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0F172A", mb: 1.5 }}>Added Items</Typography>
                <Stack spacing={1}>
                  {props.cart.map(item => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        border: "1px solid #E2E8F0",
                        bgcolor: "#F8FAFC",
                      }}
                    >
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>
                        {item.quantity}x {item.name}
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "primary.main" }}>
                        {(item.price * item.quantity).toFixed(2)} AED
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: props.onBack ? "space-between" : "flex-end", alignItems: "center" }}>
        {props.onBack && (
          <Button variant="outlined" size="large" onClick={props.onBack} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, color: "#475569", borderColor: "#E2E8F0" }}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          size="large"
          onClick={props.onNext}
          disabled={
            props.isSaving ||
            !props.selectedPlan ||
            !isMealSelectionComplete ||
            isMealPlansLoading
          }
          sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}
        >
          {props.isSaving ? <CircularProgress size={22} color="inherit" /> : "Next →"}
        </Button>
      </Box>
    </Box>
  );
};

export default Step1Configuration;
