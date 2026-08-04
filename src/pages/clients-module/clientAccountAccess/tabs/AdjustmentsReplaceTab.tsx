/** @format */

import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import CutoffTimeSettingsCard from "../components/CutoffTimeSettingsCard";
import { DeliveryStatusChip } from "../components/statusChip";
import {
  DeliveryCutoffSettings,
  formatDeliveryCutoffLabel,
  isDeliveryPastCutoff,
} from "../deliveryCutoff";
import { DeliveryDay } from "../types";
import PaymentIcon from "@mui/icons-material/Payment";
import BlockIcon from "@mui/icons-material/Block";
import EventIcon from "@mui/icons-material/Event";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

type Props = {
  selectedDelivery: DeliveryDay | null;
  selectedDate: Dayjs | null;
  onSelectedDateChange: (date: Dayjs | null) => void;
  deliveries: DeliveryDay[];
  cutoffSettings?: DeliveryCutoffSettings | null;
  isCutoffLoading?: boolean;
  /** Only admins can toggle cutoff validation bypass. */
  canBypassCutoff?: boolean;
  bypassCutoffEnabled?: boolean;
  onBypassCutoffEnabledChange?: (enabled: boolean) => void;
  onOpenChangeMethod: () => void;
  onOpenCancelDelivery: () => void;
  onOpenMoveDelivery: () => void;
  onOpenAdditionalItems: () => void;
  onOpenChangeMealPlan: () => void;
  onOpenReplaceMeals: () => void;
};

const AdjustmentsReplaceTab = ({
  selectedDelivery,
  selectedDate,
  onSelectedDateChange,
  deliveries,
  cutoffSettings,
  isCutoffLoading = false,
  canBypassCutoff = false,
  bypassCutoffEnabled = false,
  onBypassCutoffEnabledChange,
  onOpenChangeMethod,
  onOpenCancelDelivery,
  onOpenMoveDelivery,
  onOpenAdditionalItems,
  onOpenChangeMealPlan,
  onOpenReplaceMeals,
}: Props) => {
  const { messages } = useIntl();
  const cutoffBypassed = canBypassCutoff && bypassCutoffEnabled;

  const deliveryForDate =
    selectedDelivery ??
    (selectedDate
      ? deliveries.find((d) => d.date === selectedDate.format("YYYY-MM-DD")) ??
        null
      : null);

  const deliveryDate =
    deliveryForDate?.date ?? selectedDate?.format("YYYY-MM-DD") ?? null;
  const isPastDeliveryDate = Boolean(
    deliveryDate && dayjs(deliveryDate).isBefore(dayjs().startOf("day"))
  );
  const isPastCutoff = isDeliveryPastCutoff(deliveryDate, cutoffSettings);
  const actionsDisabled =
    !deliveryForDate ||
    isPastDeliveryDate ||
    (isPastCutoff && !cutoffBypassed) ||
    deliveryForDate.status === "Delivered";

  const actionsDisabledMessage = isPastDeliveryDate
    ? "Actions cannot be performed on past deliveries."
    : deliveryForDate?.status === "Delivered"
      ? "Actions cannot be performed on delivered deliveries."
      : isPastCutoff
        ? cutoffBypassed
          ? null
          : (messages["clientAccountAccess.cutoffLocked"] as string)
        : null;

  const actionCards = [
    {
      icon: <PaymentIcon color="primary" fontSize="small" />,
      title: "clientAccountAccess.changeDeliveryMethod",
      hint: "Change the delivery method for the selected day.",
      action: "clientAccountAccess.changeDeliveryMethod",
      onClick: onOpenChangeMethod,
    },
    {
      icon: <BlockIcon color="error" fontSize="small" />,
      title: "clientAccountAccess.cancelDelivery",
      hint: "Cancel the delivery for the selected day or upcoming days.",
      action: "clientAccountAccess.cancelDelivery",
      onClick: onOpenCancelDelivery,
      isRed: true,
    },
    {
      icon: <EventIcon color="primary" fontSize="small" />,
      title: "clientAccountAccess.moveDelivery",
      hint: "Move the delivery to a new date.",
      action: "clientAccountAccess.moveDelivery",
      onClick: onOpenMoveDelivery,
    },
    {
      icon: <AddShoppingCartIcon color="primary" fontSize="small" />,
      title: "clientAccountAccess.additionalItems",
      hint: "clientAccountAccess.additionalItemsHint",
      action: "clientAccountAccess.addAdditionalItems",
      onClick: onOpenAdditionalItems,
    },
    {
      icon: <RestaurantMenuIcon color="primary" fontSize="small" />,
      title: "clientAccountAccess.changeMealPlan",
      hint: "clientAccountAccess.changeMealPlanHint",
      action: "clientAccountAccess.changeMealPlan",
      onClick: onOpenChangeMealPlan,
    },
    {
      icon: <SwapHorizIcon color="primary" fontSize="small" />,
      title: "clientAccountAccess.replaceMeals",
      hint: "clientAccountAccess.replaceMealsHint",
      action: "clientAccountAccess.replaceMeals",
      onClick: onOpenReplaceMeals,
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 16, fontWeight: Fonts.SEMI_BOLD, mb: 2 }}>
              <IntlMessages id="clientAccountAccess.targetDay" />
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
              <DatePicker
                label={messages["clientAccountAccess.selectDeliveryDate"] as string}
                value={selectedDate}
                onChange={onSelectedDateChange}
                slotProps={{ textField: { size: "small", sx: { minWidth: 220 } } }}
              />
              {deliveryForDate && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <DeliveryStatusChip status={deliveryForDate.status} />
                  <Typography variant="body2" color="text.secondary">
                    {deliveryForDate.deliveryMethod}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <CutoffTimeSettingsCard
          settings={cutoffSettings}
          isLoading={isCutoffLoading}
          canBypassCutoff={canBypassCutoff}
          bypassCutoffEnabled={bypassCutoffEnabled}
          onBypassCutoffEnabledChange={onBypassCutoffEnabledChange}
        />
      </Grid>

      {actionsDisabledMessage && deliveryForDate ? (
        <Grid item xs={12}>
          <Alert severity="warning">
            {actionsDisabledMessage}
            {isPastCutoff && cutoffSettings ? (
              <>
                {" "}
                ({formatDeliveryCutoffLabel(cutoffSettings)})
              </>
            ) : null}
          </Alert>
        </Grid>
      ) : null}

      {actionCards.map((card) => (
        <Grid item xs={12} md={4} key={card.title}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                {card.icon}
                <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                  <IntlMessages id={card.title} />
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                <IntlMessages id={card.hint} />
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="small"
                disabled={actionsDisabled}
                onClick={card.onClick}
                color={(card as { isRed?: boolean }).isRed ? "error" : "primary"}
              >
                <IntlMessages id={card.action} />
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdjustmentsReplaceTab;
