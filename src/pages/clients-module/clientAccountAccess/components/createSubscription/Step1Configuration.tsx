import { useEffect, useMemo, useRef } from "react";
import { Box, Typography, Grid, Stack, Button, alpha, useTheme, Divider, Tabs, Tab, IconButton, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SpaIcon from "@mui/icons-material/Spa";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useGetActiveMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import { useGetSubscriptionWizardAddOnOptionsQuery } from "../../services/api";
import {
  DeliveryCalendarAddOnCategory,
  IDeliveryCalendarAddOnOption,
  ISubscriptionWizardMealTypeSelection,
} from "src/types/modules/clientsManagement/clientAccountAccess";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import {
  getMealPlanMealTypeOptions,
  getMealPlanMealTypesCount,
  getMealPlanTotalCalories,
  getMealTypeSelectionsTotalCalories,
  getMealTypeSelectionsTotalQuantity,
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

  const selectedMealPlan = useMemo(
    () => mealPlans.find((plan) => plan.id === props.selectedPlan),
    [mealPlans, props.selectedPlan]
  );

  const mealTypeOptions = useMemo(
    () => getMealPlanMealTypeOptions(selectedMealPlan),
    [selectedMealPlan]
  );

  const totalMealQuantity = useMemo(
    () => getMealTypeSelectionsTotalQuantity(props.mealTypeSelections),
    [props.mealTypeSelections]
  );

  const selectedMealsCalories = useMemo(
    () =>
      getMealTypeSelectionsTotalCalories(
        selectedMealPlan,
        props.mealTypeSelections
      ),
    [selectedMealPlan, props.mealTypeSelections]
  );

  const isMealSelectionComplete = totalMealQuantity > 0;

  useEffect(() => {
    if (!mealPlans.length || hasDefaultedMealPlan.current) return;

    const hasValidSelection = mealPlans.some(
      (plan: IMealPlans) => plan.id === props.selectedPlan
    );

    if (!props.selectedPlan || !hasValidSelection) {
      props.setSelectedPlan(mealPlans[0].id);
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

  return (
    <Box>
      <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Meal Plan</Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 2 }}>
        Choose the best plan for your client.
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {isMealPlansLoading ? (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={32} />
            </Box>
          </Grid>
        ) : mealPlans.length === 0 ? (
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              No meal plans available.
            </Typography>
          </Grid>
        ) : (
          mealPlans.map((plan: IMealPlans, index: number) => {
          const isSelected = props.selectedPlan === plan.id;
          const totalCalories = getMealPlanTotalCalories(plan);
          const caloriesLabel =
            totalCalories > 0 ? `${totalCalories} kcal` : null;
          const mealTypesCount = getMealPlanMealTypesCount(plan);
          const mealsLabel =
            mealTypesCount > 0
              ? `${mealTypesCount} meal types`
              : null;
          const subtitle = [caloriesLabel, mealsLabel].filter(Boolean).join(" • ");

          return (
            <Grid item xs={12} md={4} key={plan.id}>
              <Box
                onClick={() => props.setSelectedPlan(plan.id)}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "#E2E8F0",
                  bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.02) : "#FFFFFF",
                  position: "relative",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isSelected ? "0 12px 24px -4px rgba(16, 185, 129, 0.15)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    borderColor: isSelected ? "primary.main" : "#CBD5E1",
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.1)"
                  }
                }}
              >
                {isSelected && (
                  <CheckCircleIcon sx={{ position: "absolute", top: 16, right: 16, color: "primary.main", fontSize: 24 }} />
                )}
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  {planIcons[index % planIcons.length]}
                </Box>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
                  {plan.nameEn}
                </Typography>
                {subtitle ? (
                  <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>
                    {subtitle}
                  </Typography>
                ) : null}
              </Box>
            </Grid>
          );
        })
        )}
      </Grid>

      <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 0.5 }}>Meals Per Day</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
              Total meals based on your selections below
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
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Calories</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
              Daily calorie intake based on selected meals
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
                {selectedMealsCalories > 0 ? `${selectedMealsCalories} kcal` : "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1, borderColor: "#F1F5F9" }} />
          </Grid>

          <Grid item xs={12}>
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
