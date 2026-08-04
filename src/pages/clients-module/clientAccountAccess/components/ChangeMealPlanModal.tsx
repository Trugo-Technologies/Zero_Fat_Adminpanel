/** @format */

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useGetActiveMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import { IChangeDeliveryCalendarMealSlot } from "src/types/modules/clientsManagement/clientAccountAccess";
import { usePreviewChangeDeliveryCalendarMealPlanMutation } from "../services/api";
import { getMealPlanMealTypeOptions } from "../mealPlanHelpers";
import DeliveryPaymentFields from "./DeliveryPaymentFields";
import { DeliveryCalendarPaymentProvider } from "src/types/modules/clientsManagement/clientAccountAccess";
import DeliveryActionPreviewPanel from "./DeliveryActionPreviewPanel";
import { useDeliveryActionPreview } from "../useDeliveryActionPreview";

const MAX_QUANTITY_PER_DAY = 10;

type Props = {
  open: boolean;
  clientId?: string | null;
  date?: string | null;
  onClose: () => void;
  /** When enabled, preview + mutation should bypass cutoff validation (admin only). */
  bypassCutoffEnabled?: boolean;
  onApply: (payload: {
    mealPlanId: string;
    planVariant: string;
    calorieTarget: number;
    mealsPerDay: number;
    mealSlots: IChangeDeliveryCalendarMealSlot[];
    applyStartingFromThisDay: boolean;
    waivePayment: boolean;
    paymentProvider?: DeliveryCalendarPaymentProvider;
  }) => void | Promise<void>;
  isSaving?: boolean;
  errorMessage?: string | null;
};

const fieldLabelSx = {
  fontSize: 12,
  fontWeight: 700,
  color: "text.secondary",
  mb: 1,
  display: "block",
};

const selectSx = {
  borderRadius: 2,
  bgcolor: "#F8FAFC",
  "& fieldset": { borderColor: "#E2E8F0" },
};

const ChangeMealPlanModal = ({
  open,
  clientId,
  date,
  onClose,
  bypassCutoffEnabled = false,
  onApply,
  isSaving = false,
  errorMessage = null,
}: Props) => {
  const theme = useTheme();
  const { messages, locale } = useIntl();
  const [mealPlanId, setMealPlanId] = useState("");
  const [selectedMealTypeIds, setSelectedMealTypeIds] = useState<string[]>([]);
  const [mealSlotQuantities, setMealSlotQuantities] = useState<
    Record<string, number>
  >({});
  const [applyStartingFromThisDay, setApplyStartingFromThisDay] = useState(true);
  const [paymentProvider, setPaymentProvider] =
    useState<DeliveryCalendarPaymentProvider>("Stripe");
  const [waivePayment, setWaivePayment] = useState(false);
  const [previewChangeMealPlan] = usePreviewChangeDeliveryCalendarMealPlanMutation();

  const { data: mealPlansResponse, isLoading: isMealPlansLoading } =
    useGetActiveMealPlansQuery(undefined, { skip: !open });

  const mealPlans = mealPlansResponse?.data ?? [];
  const selectedMealPlan = useMemo(
    () => mealPlans.find((plan) => plan.id === mealPlanId),
    [mealPlans, mealPlanId]
  );
  const mealTypeOptions = useMemo(
    () => getMealPlanMealTypeOptions(selectedMealPlan),
    [selectedMealPlan]
  );

  const getLabel = (nameEn: string, nameAr: string) =>
    locale === "ar-SA" ? nameAr || nameEn : nameEn || nameAr;

  useEffect(() => {
    if (!open) {
      setMealPlanId("");
      setSelectedMealTypeIds([]);
      setMealSlotQuantities({});
      setApplyStartingFromThisDay(true);
      setPaymentProvider("Stripe");
      setWaivePayment(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !mealPlanId || !mealTypeOptions.length) return;

    setSelectedMealTypeIds((prev) => {
      const availableIds = new Set(mealTypeOptions.map((item) => item.mealType.id));
      return prev.filter((id) => availableIds.has(id));
    });
    setMealSlotQuantities((prev) => {
      const availableIds = new Set(mealTypeOptions.map((item) => item.mealType.id));
      const next: Record<string, number> = {};
      Object.entries(prev).forEach(([id, qty]) => {
        if (availableIds.has(id)) next[id] = qty;
      });
      return next;
    });
  }, [open, mealPlanId, mealTypeOptions]);

  const mealSlots = useMemo<IChangeDeliveryCalendarMealSlot[]>(
    () =>
      mealTypeOptions.map(({ mealType }) => {
        const enabled = selectedMealTypeIds.includes(mealType.id);
        return {
          mealTypeId: mealType.id,
          enabled,
          quantityPerDay: enabled ? mealSlotQuantities[mealType.id] ?? 1 : 0,
        };
      }),
    [mealTypeOptions, selectedMealTypeIds, mealSlotQuantities]
  );

  const totalMealQuantity = useMemo(
    () =>
      mealSlots
        .filter((slot) => slot.enabled)
        .reduce((sum, slot) => sum + slot.quantityPerDay, 0),
    [mealSlots]
  );

  const calorieTarget = useMemo(
    () =>
      mealTypeOptions.reduce((sum, { mealType, averageCalories }) => {
        if (!selectedMealTypeIds.includes(mealType.id)) return sum;
        const quantity = mealSlotQuantities[mealType.id] ?? 1;
        return sum + averageCalories * quantity;
      }, 0),
    [mealTypeOptions, selectedMealTypeIds, mealSlotQuantities]
  );

  const isMealSelectionComplete = totalMealQuantity > 0;

  const previewPayload = useMemo(() => {
    if (!clientId || !date || !mealPlanId || !isMealSelectionComplete) return null;

    return {
      clientId,
      date,
      mealPlanId,
      mealSlots: mealSlots.filter((slot) => slot.enabled),
      applyStartingFromThisDay,
      ...(bypassCutoffEnabled ? { bypassCutoff: true } : {}),
    };
  }, [
    clientId,
    date,
    mealPlanId,
    mealSlots,
    applyStartingFromThisDay,
    isMealSelectionComplete,
    bypassCutoffEnabled,
  ]);

  const { preview, previewError, isPreviewLoading } = useDeliveryActionPreview({
    enabled: open,
    clientId,
    data: previewPayload,
    previewMutation: previewChangeMealPlan,
  });

  useEffect(() => {
    if (!preview) return;
    const requiresPayment =
      preview.requiresPayment ?? preview.paymentRequired ?? false;
    setWaivePayment(!requiresPayment);
  }, [preview]);

  const toggleMealType = (mealType: IMealTypes) => {
    setSelectedMealTypeIds((prev) => {
      const isSelected = prev.includes(mealType.id);

      if (isSelected) {
        setMealSlotQuantities((quantities) => {
          const next = { ...quantities };
          delete next[mealType.id];
          return next;
        });
        return prev.filter((id) => id !== mealType.id);
      }

      setMealSlotQuantities((quantities) => ({
        ...quantities,
        [mealType.id]: 1,
      }));
      return [...prev, mealType.id];
    });
  };

  const updateMealSlotQuantity = (mealTypeId: string, delta: number) => {
    setMealSlotQuantities((prev) => {
      const current = prev[mealTypeId] ?? 1;
      const next = Math.min(
        MAX_QUANTITY_PER_DAY,
        Math.max(1, current + delta)
      );
      return { ...prev, [mealTypeId]: next };
    });
  };

  const handleApply = async () => {
    if (!mealPlanId || !isMealSelectionComplete) return;

    await onApply({
      mealPlanId,
      planVariant: String(totalMealQuantity),
      calorieTarget,
      mealsPerDay: totalMealQuantity,
      mealSlots: mealSlots.filter((slot) => slot.enabled),
      applyStartingFromThisDay,
      waivePayment,
      ...(waivePayment ? {} : { paymentProvider }),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, fontSize: 22, pb: 1 }}>
        {messages["clientAccountAccess.changeMealPlan"] as string}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12}>
            <Typography sx={fieldLabelSx}>Meal Plan</Typography>
            <FormControl fullWidth size="small" disabled={isMealPlansLoading}>
              <Select
                value={mealPlanId}
                displayEmpty
                onChange={(e) => {
                  setMealPlanId(e.target.value);
                  setSelectedMealTypeIds([]);
                  setMealSlotQuantities({});
                }}
                sx={selectSx}
              >
                <MenuItem value="" disabled>
                  Select meal plan
                </MenuItem>
                {mealPlans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.nameEn}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={fieldLabelSx}>
              {messages["clientAccountAccess.summary.mealsPerDay"] as string}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #E2E8F0",
                borderRadius: 2,
                px: 2,
                height: 40,
                bgcolor: "#F8FAFC",
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                {totalMealQuantity > 0
                  ? `${totalMealQuantity} meal${totalMealQuantity === 1 ? "" : "s"}`
                  : "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={fieldLabelSx}>
              {messages["clientAccountAccess.calories"] as string}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #E2E8F0",
                borderRadius: 2,
                px: 2,
                height: 40,
                bgcolor: "#F8FAFC",
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                {calorieTarget > 0 ? `${calorieTarget} kcal` : "—"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 2,
              mb: 1.5,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              Meal Slots
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {selectedMealTypeIds.length} slot
              {selectedMealTypeIds.length === 1 ? "" : "s"} · {totalMealQuantity} meal
              {totalMealQuantity === 1 ? "" : "s"} total
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1.5 }}>
            Select meal types and adjust quantity for each. Total meals updates automatically.
          </Typography>

          {!mealPlanId ? (
            <Typography variant="body2" color="text.secondary">
              Select a meal plan first.
            </Typography>
          ) : mealTypeOptions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No meal types available for this plan.
            </Typography>
          ) : (
            <Grid container spacing={1.5}>
              {mealTypeOptions.map(({ mealType, averageCalories }) => {
                const isSelected = selectedMealTypeIds.includes(mealType.id);
                const quantity = mealSlotQuantities[mealType.id] ?? 1;

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
                        minHeight: 56,
                        "&:hover": {
                          borderColor: "primary.main",
                        },
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
                              sx={{ width: 24, height: 24, objectFit: "contain" }}
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
                            {getLabel(mealType.nameEn, mealType.nameAr)}
                          </Typography>
                          {averageCalories > 0 ? (
                            <Typography
                              sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}
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
                            {messages["clientAccountAccess.quantity"] as string}
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
                              onClick={() =>
                                updateMealSlotQuantity(mealType.id, -1)
                              }
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
                              onClick={() =>
                                updateMealSlotQuantity(mealType.id, 1)
                              }
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
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            {messages["clientAccountAccess.applyOptions"] as string}
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={applyStartingFromThisDay ? "fromThisDay" : "thisDay"}
              onChange={(e) =>
                setApplyStartingFromThisDay(e.target.value === "fromThisDay")
              }
            >
              <FormControlLabel
                value="thisDay"
                control={<Radio size="small" />}
                label={messages["clientAccountAccess.apply.thisDay"] as string}
                sx={{ mb: 0.5 }}
              />
              <FormControlLabel
                value="fromThisDay"
                control={<Radio size="small" />}
                label={messages["clientAccountAccess.apply.fromThisDay"] as string}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {mealPlanId && isMealSelectionComplete ? (
          <Box sx={{ mt: 2 }}>
            <DeliveryActionPreviewPanel
              preview={preview}
              isLoading={isPreviewLoading}
              errorMessage={previewError}
            />
          </Box>
        ) : null}

        <DeliveryPaymentFields
          paymentProvider={paymentProvider}
          onPaymentProviderChange={setPaymentProvider}
          waivePayment={waivePayment}
          onWaivePaymentChange={setWaivePayment}
          disabled={isSaving || isPreviewLoading}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSaving} sx={{ borderRadius: 2 }}>
          {messages["common.cancel"] as string}
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={
            !mealPlanId ||
            !isMealSelectionComplete ||
            isSaving ||
            isPreviewLoading ||
            !preview ||
            Boolean(previewError)
          }
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          {isSaving ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            (messages["common.apply"] as string)
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeMealPlanModal;
