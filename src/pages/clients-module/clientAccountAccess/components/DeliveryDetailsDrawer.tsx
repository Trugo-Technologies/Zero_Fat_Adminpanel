/** @format */

import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import EventIcon from "@mui/icons-material/Event";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import {
  alpha,
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { IDeliveryCalendarDayMeal } from "src/types/modules/clientsManagement/clientAccountAccess";
import { mapApiDeliveryStatusToUi } from "../deliveryCalendarStatuses";
import {
  formatDeliveryCutoffLabel,
  isDeliveryPastCutoff,
} from "../deliveryCutoff";
import { useGetDeliveryCalendarDayQuery } from "../services/api";
import { DeliveryDay, DeliveryStatus } from "../types";
import { DeliveryStatusChip } from "./statusChip";

type Props = {
  open: boolean;
  clientId?: string | null;
  delivery: DeliveryDay | null;
  bypassCutoffEnabled?: boolean;
  onClose: () => void;
  onChangeMethod: () => void;
  onCancelDelivery: () => void;
  onMoveDelivery: () => void;
  onReplaceMeals: () => void;
  onAddItems: () => void;
  onChangeMealPlan: () => void;
};

const formatPaymentMethod = (value?: string) => {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const getMealTypeIcon = (mealTypeName: string) => {
  const normalized = mealTypeName.toLowerCase();

  if (normalized.includes("breakfast")) {
    return {
      icon: <FreeBreakfastIcon fontSize="small" />,
      color: "#F59E0B",
      bg: alpha("#F59E0B", 0.1),
    };
  }

  if (normalized.includes("lunch")) {
    return {
      icon: <LunchDiningIcon fontSize="small" />,
      color: "#F59E0B",
      bg: alpha("#F59E0B", 0.1),
    };
  }

  if (normalized.includes("dinner")) {
    return {
      icon: <DarkModeOutlinedIcon fontSize="small" />,
      color: "#8B5CF6",
      bg: alpha("#8B5CF6", 0.1),
    };
  }

  if (normalized.includes("workout") || normalized.includes("post")) {
    return {
      icon: <FitnessCenterOutlinedIcon fontSize="small" />,
      color: "#3B82F6",
      bg: alpha("#3B82F6", 0.1),
    };
  }

  return {
    icon: <WbSunnyOutlinedIcon fontSize="small" />,
    color: "#10B981",
    bg: alpha("#10B981", 0.1),
  };
};

const MealCard = ({
  icon,
  iconColor,
  iconBg,
  title,
  meal,
  subtitle,
  isCancelled = false,
}: {
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  title: ReactNode;
  meal: string;
  subtitle?: string;
  isCancelled?: boolean;
}) => {
  if (!meal || meal === "-") return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1.5,
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isCancelled ? alpha("#EF4444", 0.35) : "#E2E8F0",
        bgcolor: isCancelled ? alpha("#EF4444", 0.04) : "#FFFFFF",
        opacity: isCancelled ? 0.85 : 1,
      }}
    >
      <Box sx={{ flexGrow: 1, pr: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary" }}>
            {title}
          </Typography>
          {isCancelled ? (
            <Chip
              label={<IntlMessages id="clientAccountAccess.mealCancelled" />}
              size="small"
              sx={{
                height: 20,
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                bgcolor: alpha("#EF4444", 0.1),
                color: "#EF4444",
                border: `1px solid ${alpha("#EF4444", 0.25)}`,
              }}
            />
          ) : null}
        </Stack>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
            color: isCancelled ? "text.secondary" : "#1A2B48",
            textDecoration: isCancelled ? "line-through" : "none",
          }}
        >
          {meal.replace(/,\s*$/, "")}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
    </Box>
  );
};

const ApiMealCard = ({ meal }: { meal: IDeliveryCalendarDayMeal }) => {
  const iconConfig = getMealTypeIcon(meal.mealTypeName);
  const price =
    meal.adjustedPrice != null ? meal.adjustedPrice : meal.basePrice ?? meal.lineTotal;
  const subtitleParts = [
    meal.mealSelectionType,
    `Qty ${meal.qty}`,
    `AED ${Number(price).toFixed(2)}`,
    meal.isPaid ? "Paid" : "Unpaid",
  ].filter(Boolean);

  return (
    <MealCard
      title={meal.mealTypeName}
      meal={meal.mealName}
      subtitle={subtitleParts.join(" • ")}
      icon={iconConfig.icon}
      iconColor={iconConfig.color}
      iconBg={iconConfig.bg}
      isCancelled={meal.isCancelled}
    />
  );
};

const ActionButton = ({
  icon,
  color,
  label,
  onClick,
  isRed = false,
  disabled = false,
}: {
  icon: ReactNode;
  color: string;
  label: string;
  onClick: () => void;
  isRed?: boolean;
  disabled?: boolean;
}) => (
  <Button
    fullWidth
    disabled={disabled}
    onClick={onClick}
    sx={{
      justifyContent: "flex-start",
      px: 2,
      py: 1.5,
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      bgcolor: "#FFFFFF",
      color: isRed ? "#EF4444" : "#1A2B48",
      textTransform: "none",
      fontWeight: 600,
      fontSize: 13,
      "&:hover": { bgcolor: alpha(color, 0.04), borderColor: color },
      "& .MuiButton-startIcon": {
        color: color,
        mr: 1.5,
      },
    }}
    startIcon={icon}
  >
    {label}
  </Button>
);

const getScheduleSubtitle = (
  status: DeliveryStatus,
  scheduleLabel?: string,
  replacementDate?: string | null,
  movedToDate?: string
) => {
  if (status === "Moved") {
    const targetDate = replacementDate || movedToDate;
    return targetDate
      ? `Moved to ${dayjs(targetDate).format("MMM D, YYYY")}`
      : scheduleLabel || "Moved";
  }

  if (scheduleLabel) return scheduleLabel;

  if (status === "Delivered") return "Delivered on time";

  return "Scheduled";
};

const DeliveryDetailsDrawer = ({
  open,
  clientId,
  delivery,
  bypassCutoffEnabled = false,
  onClose,
  onChangeMethod,
  onCancelDelivery,
  onMoveDelivery,
  onReplaceMeals,
  onAddItems,
  onChangeMealPlan,
}: Props) => {
  const { messages } = useIntl();
  const theme = useTheme();

  const { data: dayDetailResponse, isLoading, isFetching } =
    useGetDeliveryCalendarDayQuery(
      { clientId: clientId || "", date: delivery?.date || "" },
      { skip: !open || !clientId || !delivery?.date }
    );

  const dayDetail = dayDetailResponse?.data;
  const useApiDetail = Boolean(clientId && dayDetail);

  const displayStatus: DeliveryStatus = useApiDetail
    ? mapApiDeliveryStatusToUi(dayDetail!.status)
    : delivery?.status ?? "Pending";

  const displayDate = dayDetail?.date ?? delivery?.date;
  const isPast = Boolean(
    displayDate && dayjs(displayDate).isBefore(dayjs().startOf("day"))
  );
  const isPastCutoff = isDeliveryPastCutoff(
    displayDate,
    dayDetail?.cutoffSettings
  );
  const actionsDisabled =
    isPast ||
    displayStatus === "Delivered" ||
    (isPastCutoff && !bypassCutoffEnabled);
  const actionsDisabledMessage = isPast
    ? "Actions cannot be performed on past deliveries."
    : displayStatus === "Delivered"
      ? "Actions cannot be performed on delivered deliveries."
      : isPastCutoff
        ? bypassCutoffEnabled
          ? ""
          : (messages["clientAccountAccess.cutoffLocked"] as string)
        : "";

  const mealPlanLabel = useApiDetail
    ? dayDetail!.averageCalories
      ? `${dayDetail!.activeMealPlanName} — ${dayDetail!.averageCalories} kcal`
      : dayDetail!.activeMealPlanName
    : delivery?.mealPlan ?? "—";

  const paymentMethod = useApiDetail
    ? formatPaymentMethod(dayDetail!.deliveryPaymentMethod)
    : delivery?.deliveryMethod ?? "—";

  const mealsCount = useApiDetail
    ? dayDetail!.meals.length
    : delivery?.mealCount ?? 0;

  const cutoffLabel = useApiDetail
    ? formatDeliveryCutoffLabel(dayDetail!.cutoffSettings)
    : "—";

  const isDetailLoading = Boolean(clientId && delivery?.date && (isLoading || isFetching));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          bgcolor: "#FFFFFF",
          color: "#1A2B48",
          p: 0,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(26, 43, 72, 0.4)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Box sx={{ p: 3, pb: 0, display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {delivery && (
        <>
          <Box sx={{ p: 4, pt: 1, flex: 1, overflowY: "auto" }}>
            <Box
              sx={{
                p: 3,
                borderRadius: "20px",
                border: "1px solid #E2E8F0",
                bgcolor: "#F8FAFC",
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 32, color: "primary.main" }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 1.5 }}>
                  {dayjs(displayDate).format("dddd, MMM D, YYYY")}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <DeliveryStatusChip status={displayStatus} />
                </Box>
                <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>
                  {getScheduleSubtitle(
                    displayStatus,
                    dayDetail?.scheduleLabel,
                    dayDetail?.replacementDate,
                    delivery.movedToDate
                  )}
                </Typography>
              </Box>
            </Box>

            {isDetailLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 2 }}>
                  <IntlMessages id="clientAccountAccess.deliveryDetails" />
                </Typography>
                <Stack spacing={2} sx={{ mb: 5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <LocalShippingOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>
                        <IntlMessages id="clientAccountAccess.deliveryMethod" />
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      {paymentMethod}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <ReceiptOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>
                        <IntlMessages id="clientAccountAccess.mealPlan" />
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: "right" }}>
                      {mealPlanLabel}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 2 }}>
                  Meals ({mealsCount})
                </Typography>
                <Stack spacing={2} sx={{ mb: 5 }}>
                  {useApiDetail ? (
                    dayDetail!.meals.length > 0 ? (
                      dayDetail!.meals.map((meal) => (
                        <ApiMealCard key={meal.id} meal={meal} />
                      ))
                    ) : (
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        No meals scheduled for this day.
                      </Typography>
                    )
                  ) : (
                    <>
                      <MealCard
                        title={<IntlMessages id="clientAccountAccess.breakfast" />}
                        meal={delivery.breakfast ?? ""}
                        icon={<WbSunnyOutlinedIcon fontSize="small" />}
                        iconColor="#F59E0B"
                        iconBg={alpha("#F59E0B", 0.1)}
                      />
                      <MealCard
                        title={<IntlMessages id="clientAccountAccess.lunch" />}
                        meal={delivery.lunch ?? ""}
                        icon={<WbSunnyOutlinedIcon fontSize="small" />}
                        iconColor="#F59E0B"
                        iconBg={alpha("#F59E0B", 0.1)}
                      />
                      <MealCard
                        title={<IntlMessages id="clientAccountAccess.dinner" />}
                        meal={delivery.dinner ?? ""}
                        icon={<DarkModeOutlinedIcon fontSize="small" />}
                        iconColor="#8B5CF6"
                        iconBg={alpha("#8B5CF6", 0.1)}
                      />
                      <MealCard
                        title={<IntlMessages id="clientAccountAccess.postWorkout" />}
                        meal={delivery.postWorkout ?? ""}
                        icon={<FitnessCenterOutlinedIcon fontSize="small" />}
                        iconColor="#3B82F6"
                        iconBg={alpha("#3B82F6", 0.1)}
                      />
                    </>
                  )}
                </Stack>

                <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 2 }}>
                  <IntlMessages id="clientAccountAccess.actions" />
                </Typography>

                {actionsDisabled ? (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      bgcolor: alpha("#EF4444", 0.05),
                      border: "1px solid",
                      borderColor: alpha("#EF4444", 0.1),
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <BlockIcon sx={{ color: "#EF4444", fontSize: 20 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#EF4444" }}>
                      {actionsDisabledMessage}
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <ActionButton
                        icon={<PaymentIcon />}
                        color={theme.palette.primary.main}
                        label="Payment Method"
                        onClick={onChangeMethod}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ActionButton
                        icon={<BlockIcon />}
                        color="#EF4444"
                        label={messages["clientAccountAccess.cancelDelivery"] as string}
                        onClick={onCancelDelivery}
                        isRed
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ActionButton
                        icon={<EventIcon />}
                        color={theme.palette.primary.main}
                        label={messages["clientAccountAccess.moveDelivery"] as string}
                        onClick={onMoveDelivery}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ActionButton
                        icon={<SwapHorizIcon />}
                        color={theme.palette.primary.main}
                        label={messages["clientAccountAccess.replaceMeals"] as string}
                        onClick={onReplaceMeals}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ActionButton
                        icon={<ShoppingBagOutlinedIcon />}
                        color={theme.palette.primary.main}
                        label={messages["clientAccountAccess.addAdditionalItems"] as string}
                        onClick={onAddItems}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ActionButton
                        icon={<RestaurantOutlinedIcon />}
                        color={theme.palette.primary.main}
                        label={messages["clientAccountAccess.changeMealPlan"] as string}
                        onClick={onChangeMealPlan}
                      />
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </Box>

          <Box sx={{ p: 3, borderTop: "1px solid #E2E8F0", bgcolor: "#FFFFFF" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: "12px",
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
              <Typography sx={{ color: "text.secondary", fontSize: 13, mr: 0.5 }}>
                Cut-off time for changes:
              </Typography>
              <Typography sx={{ color: "primary.main", fontSize: 13, fontWeight: 700 }}>
                {cutoffLabel}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default DeliveryDetailsDrawer;
