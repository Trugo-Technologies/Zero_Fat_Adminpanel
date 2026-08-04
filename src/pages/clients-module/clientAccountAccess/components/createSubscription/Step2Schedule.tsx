import { useState, useEffect, useRef, useMemo, type MouseEvent } from "react";
import { useIntl } from "react-intl";
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  alpha,
  TextField,
  InputAdornment,
  Alert,
  AlertTitle,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddClientLocation from "src/Components/clients-module/clientLocations/AddClientLocation";
import EditClientLocation from "src/Components/clients-module/clientLocations/EditClientLocation";
import { useGetAllClientLocationsQuery } from "src/pages/clients-module/clientLocations/services/api";
import { useGetClientPortalSettingsQuery } from "src/pages/clients-module/clientPortalSettings/services/api";
import { IClientLocations } from "src/types/modules/clientsManagement/clientLocations";
import { PreferredDeliveryTime } from "src/types/modules/clientsManagement/clientSubscriptions";
import { showErrorToasts } from "src/Components/toasts";
import {
  DURATION_OPTIONS,
  getDeliveryDatesFromWeekdays,
  getDurationPackageDiscount,
  getFirstAvailableDeliveryDate,
  getMaxDeliveryDatesForDuration,
  getMinDeliveryDatesForDuration,
  getWeekdayLabel,
  getWizardCalendarDayStatus,
  isCustomDuration,
  isWeekdayDisabled,
  MAX_WEEKDAY_SELECTION,
  MIN_WEEKDAY_SELECTION,
  resolveBlockedSubscriptionEndDate,
  toggleSelectedDeliveryDate,
  toggleSelectedWeekday,
  WEEKDAY_OPTIONS,
  WizardCalendarDayStatus,
} from "../../subscriptionWizardSchedule";
import { RenewalStrategyUi } from "../../mapSubscriptionWizardDraft";

const preferredDeliveryTimeOptions = [
  {
    value: PreferredDeliveryTime.EarlyMorning,
    label: "Early morning (3 am – 7 am)",
  },
  {
    value: PreferredDeliveryTime.Morning,
    label: "Morning (8 am – 12 pm)",
  },
];

const CALENDAR_STATUS_STYLES: Record<
  WizardCalendarDayStatus,
  { bgColor: string; color: string; fontWeight: number; hoverBg: string }
> = {
  Selected: {
    bgColor: "primary.main",
    color: "#fff",
    fontWeight: 700,
    hoverBg: "primary.dark",
  },
  Available: {
    bgColor: "transparent",
    color: "text.primary",
    fontWeight: 500,
    hoverBg: alpha("#10B981", 0.1),
  },
  ActiveSubs: {
    bgColor: alpha("#F59E0B", 0.15),
    color: "#D97706",
    fontWeight: 700,
    hoverBg: alpha("#F59E0B", 0.25),
  },
  UpcomingSubs: {
    bgColor: alpha("#8B5CF6", 0.15),
    color: "#7C3AED",
    fontWeight: 700,
    hoverBg: alpha("#8B5CF6", 0.25),
  },
  Unavailable: {
    bgColor: "transparent",
    color: "text.disabled",
    fontWeight: 500,
    hoverBg: "transparent",
  },
};

type Props = {
  clientId?: string | null;
  subscriptionMode: "new" | "renew";
  renewalStrategy?: RenewalStrategyUi;
  scheduledStartDate?: Dayjs | null;
  duration: string;
  setDuration: (val: string) => void;
  selectedWeekdays: number[];
  setSelectedWeekdays: (val: number[]) => void;
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs | null) => void;
  selectedDeliveryDates: string[];
  setSelectedDeliveryDates: (dates: string[]) => void;
  preferredDeliveryTime: string;
  setPreferredDeliveryTime: (val: string) => void;
  clientLocationId: string;
  setClientLocationId: (val: string) => void;
  promoCode: string;
  setPromoCode: (val: string) => void;
  manualDiscount: string;
  setManualDiscount: (val: string) => void;
  hasActiveSubscription?: boolean;
  activeSubscriptionEndDate?: string | null;
  hasUpcomingSubscription?: boolean;
  upcomingSubscriptionEndDate?: string | null;
  upcomingMealPlanName?: string | null;
  upcomingSelectedDeliveryDates?: string[];
  onBack: () => void;
  onNext: () => void | Promise<void>;
  isSaving?: boolean;
};

type CustomDayProps = PickersDayProps<Dayjs> & {
  selectedDates?: string[];
  activeSubDates?: string[];
  upcomingSubDates?: string[];
  isRenewMode?: boolean;
  onToggleDate?: (day: Dayjs) => void;
};

const CustomDay = (props: CustomDayProps) => {
  const {
    day,
    selectedDates = [],
    activeSubDates = [],
    upcomingSubDates = [],
    isRenewMode,
    onToggleDate,
    ...other
  } = props;

  const status = getWizardCalendarDayStatus({
    day,
    selectedDates,
    activeSubDates,
    upcomingSubDates,
  });
  const styles = CALENDAR_STATUS_STYLES[status];
  const isSelected = status === "Selected";
  const isBlockedStatus =
    status === "ActiveSubs" || status === "UpcomingSubs";
  const isDisabled =
    Boolean(other.disabled) ||
    status === "Unavailable" ||
    isBlockedStatus;

  const selectedStyles = isRenewMode
    ? {
        bgColor: "info.main",
        color: "#fff",
        fontWeight: 700,
        hoverBg: "info.dark",
      }
    : styles;

  const applied = isSelected ? selectedStyles : styles;

  return (
    <PickersDay
      {...other}
      day={day}
      disabled={isDisabled}
      selected={isSelected}
      onClick={(event) => {
        if (!isDisabled && onToggleDate) {
          event.preventDefault();
          event.stopPropagation();
          onToggleDate(day);
          return;
        }
        other.onClick?.(event);
      }}
      sx={{
        bgcolor: applied.bgColor,
        color: applied.color,
        fontWeight: applied.fontWeight,
        "&:hover": { bgcolor: applied.hoverBg },
        "&.Mui-selected": {
          bgcolor: isRenewMode ? "info.main" : "primary.main",
          color: "#fff",
        },
        "&.Mui-disabled": {
          opacity: isBlockedStatus ? 1 : 0.45,
        },
      }}
    />
  );
};

const Step2Schedule = (props: Props) => {
  const { messages } = useIntl();
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<IClientLocations | null>(null);

  const isCustomMode = isCustomDuration(props.duration);

  const { data: clientPortalSettingsResponse } = useGetClientPortalSettingsQuery({});
  const portalSettings = clientPortalSettingsResponse?.data;
  const selectedPackageDiscount = getDurationPackageDiscount(
    props.duration,
    portalSettings
  );

  const {
    data: clientLocationsResponse,
    isFetching: isLocationsLoading,
  } = useGetAllClientLocationsQuery(
    { pageNumber: 1, pageSize: 100, clientId: props.clientId },
    { skip: !props.clientId }
  );

  const clientLocations = clientLocationsResponse?.data ?? [];

  useEffect(() => {
    if (!clientLocations.length || props.clientLocationId) return;

    props.setClientLocationId(clientLocations[0].id);
  }, [clientLocations, props.clientLocationId, props.setClientLocationId]);

  useEffect(() => {
    const isValid = preferredDeliveryTimeOptions.some(
      (option) => option.value === props.preferredDeliveryTime
    );

    if (!isValid) {
      props.setPreferredDeliveryTime(PreferredDeliveryTime.EarlyMorning);
    }
  }, [props.preferredDeliveryTime, props.setPreferredDeliveryTime]);

  const handleEditLocation = (
    event: MouseEvent,
    location: IClientLocations
  ) => {
    event.stopPropagation();
    setSelectedLocation(location);
    setShowEditLocationModal(true);
  };

  const activeDates = props.selectedDeliveryDates;

  const activeSubEndDate = props.activeSubscriptionEndDate
    ? dayjs(props.activeSubscriptionEndDate)
    : null;
  const hasActivePlan =
    Boolean(props.hasActiveSubscription) && Boolean(activeSubEndDate);

  const upcomingSubEndDate = props.upcomingSubscriptionEndDate
    ? dayjs(props.upcomingSubscriptionEndDate)
    : null;
  const hasUpcomingPlan = Boolean(props.hasUpcomingSubscription);

  const activeSubDates = useMemo(() => {
    if (props.subscriptionMode !== "renew" || !hasActivePlan || !activeSubEndDate) {
      return [];
    }
    let current = dayjs();
    const dates: string[] = [];
    while (
      current.isBefore(activeSubEndDate, "day") ||
      current.isSame(activeSubEndDate, "day")
    ) {
      if (!isWeekdayDisabled(current.day())) {
        dates.push(current.format("YYYY-MM-DD"));
      }
      current = current.add(1, "day");
    }
    return dates;
  }, [
    props.subscriptionMode,
    hasActivePlan,
    activeSubEndDate,
  ]);

  const upcomingSubDates = useMemo(() => {
    if (props.subscriptionMode !== "renew" || !hasUpcomingPlan) {
      return [];
    }
    return (props.upcomingSelectedDeliveryDates ?? []).filter(Boolean);
  }, [
    props.subscriptionMode,
    hasUpcomingPlan,
    props.upcomingSelectedDeliveryDates,
  ]);

  const blockedSubDates = useMemo(
    () => [...new Set([...activeSubDates, ...upcomingSubDates])],
    [activeSubDates, upcomingSubDates]
  );

  const blockedSubscriptionEndDate = useMemo(
    () =>
      resolveBlockedSubscriptionEndDate({
        activeSubscriptionEndDate: props.activeSubscriptionEndDate,
        hasActiveSubscription: props.hasActiveSubscription,
        upcomingSubscriptionEndDate: props.upcomingSubscriptionEndDate,
        hasUpcomingSubscription: props.hasUpcomingSubscription,
        upcomingSelectedDeliveryDates: props.upcomingSelectedDeliveryDates,
      }),
    [
      props.activeSubscriptionEndDate,
      props.hasActiveSubscription,
      props.upcomingSubscriptionEndDate,
      props.hasUpcomingSubscription,
      props.upcomingSelectedDeliveryDates,
    ]
  );

  const firstAvailableDateParams = {
    selectedWeekdays: props.selectedWeekdays,
    activeSubscriptionEndDate: props.activeSubscriptionEndDate,
    hasActiveSubscription: props.hasActiveSubscription,
    upcomingSubscriptionEndDate: props.upcomingSubscriptionEndDate,
    hasUpcomingSubscription: props.hasUpcomingSubscription,
    upcomingSelectedDeliveryDates: props.upcomingSelectedDeliveryDates,
    blockedDates: blockedSubDates,
  };

  const isExtendRenewMode =
    props.subscriptionMode === "renew" && props.renewalStrategy === "extend";
  const isFutureRenewMode =
    props.subscriptionMode === "renew" && props.renewalStrategy === "future";

  const resolveScheduleAnchorDate = () => {
    if (isFutureRenewMode && props.scheduledStartDate) {
      return props.scheduledStartDate;
    }

    return getFirstAvailableDeliveryDate(firstAvailableDateParams);
  };

  const regenerateDeliveryDates = (startDate?: Dayjs | null) => {
    const start = startDate ?? resolveScheduleAnchorDate();
    const generated = getDeliveryDatesFromWeekdays(
      start,
      props.duration,
      props.selectedWeekdays,
      blockedSubDates
    );

    props.setSelectedDate(start);
    props.setSelectedDeliveryDates(generated);
  };

  const handleDurationChange = (label: string) => {
    props.setDuration(label);

    if (isCustomDuration(label)) {
      return;
    }

    const start = resolveScheduleAnchorDate();
    const generated = getDeliveryDatesFromWeekdays(
      start,
      label,
      props.selectedWeekdays,
      blockedSubDates
    );

    props.setSelectedDate(start);
    props.setSelectedDeliveryDates(generated);
  };

  const handleWeekdayToggle = (weekday: number) => {
    const nextWeekdays = toggleSelectedWeekday(
      props.selectedWeekdays,
      weekday,
      { enforceLimits: !isCustomMode }
    );
    if (nextWeekdays.length === props.selectedWeekdays.length) return;

    props.setSelectedWeekdays(nextWeekdays);

    if (isCustomMode) {
      const nextDates = props.selectedDeliveryDates.filter((dateStr) =>
        nextWeekdays.includes(dayjs(dateStr).day())
      );
      props.setSelectedDeliveryDates(nextDates);
      props.setSelectedDate(nextDates.length > 0 ? dayjs(nextDates[0]) : null);
      return;
    }

    const start = getFirstAvailableDeliveryDate({
      ...firstAvailableDateParams,
      selectedWeekdays: nextWeekdays,
    });
    const generated = getDeliveryDatesFromWeekdays(
      start,
      props.duration,
      nextWeekdays,
      blockedSubDates
    );

    props.setSelectedDate(start);
    props.setSelectedDeliveryDates(generated);
  };

  useEffect(() => {
    const next = props.selectedDeliveryDates.filter((dateStr) => {
      const day = dayjs(dateStr);
      if (day.isBefore(dayjs(), "day")) return false;
      if (isWeekdayDisabled(day.day())) return false;
      if (blockedSubDates.includes(dateStr)) return false;
      return true;
    });

    if (next.length === props.selectedDeliveryDates.length) return;

    props.setSelectedDeliveryDates(next);
    props.setSelectedDate(next.length > 0 ? dayjs(next[0]) : null);
  }, [
    props.activeSubscriptionEndDate,
    props.hasActiveSubscription,
    props.hasUpcomingSubscription,
    props.upcomingSubscriptionEndDate,
    props.upcomingSelectedDeliveryDates,
    props.subscriptionMode,
    props.selectedDeliveryDates,
    props.setSelectedDeliveryDates,
    props.setSelectedDate,
    blockedSubDates,
  ]);

  const didInitialSeedRef = useRef(false);

  useEffect(() => {
    if (isCustomMode) return;
    if (didInitialSeedRef.current) return;

    if (props.selectedDeliveryDates.length > 0) {
      didInitialSeedRef.current = true;
      return;
    }

    const start = resolveScheduleAnchorDate();
    const generated = getDeliveryDatesFromWeekdays(
      start,
      props.duration,
      props.selectedWeekdays,
      blockedSubDates
    );

    didInitialSeedRef.current = true;
    if (generated.length === 0) return;

    props.setSelectedDate(start);
    props.setSelectedDeliveryDates(generated);
  }, [
    isCustomMode,
    props.duration,
    props.selectedDeliveryDates.length,
    props.selectedWeekdays,
    props.activeSubscriptionEndDate,
    props.hasActiveSubscription,
    props.hasUpcomingSubscription,
    props.upcomingSubscriptionEndDate,
    props.upcomingSelectedDeliveryDates,
    props.setSelectedDate,
    props.setSelectedDeliveryDates,
    blockedSubDates,
  ]);

  useEffect(() => {
    if (!isExtendRenewMode || isCustomMode) return;

    const firstAvailable = getFirstAvailableDeliveryDate(firstAvailableDateParams);

    if (!props.selectedDate?.isSame(firstAvailable, "day")) {
      regenerateDeliveryDates(firstAvailable);
    }
  }, [
    isExtendRenewMode,
    isCustomMode,
    props.selectedWeekdays,
    props.activeSubscriptionEndDate,
    props.hasActiveSubscription,
    props.hasUpcomingSubscription,
    props.upcomingSubscriptionEndDate,
    props.upcomingSelectedDeliveryDates,
    blockedSubDates,
  ]);

  useEffect(() => {
    if (!isFutureRenewMode || !props.scheduledStartDate || isCustomMode) return;

    if (!props.selectedDate?.isSame(props.scheduledStartDate, "day")) {
      regenerateDeliveryDates(props.scheduledStartDate);
    }
  }, [isFutureRenewMode, isCustomMode, props.scheduledStartDate]);

  const shouldDisableDate = (date: Dayjs) => {
    const status = getWizardCalendarDayStatus({
      day: date,
      selectedDates: activeDates,
      activeSubDates,
      upcomingSubDates,
    });

    return (
      status === "Unavailable" ||
      status === "ActiveSubs" ||
      status === "UpcomingSubs"
    );
  };

  const handleToggleDeliveryDate = (day: Dayjs) => {
    const dateStr = day.format("YYYY-MM-DD");
    const isAlreadySelected = props.selectedDeliveryDates.includes(dateStr);

    if (blockedSubDates.includes(dateStr)) {
      showErrorToasts(
        "This date is part of an active or upcoming subscription and cannot be selected."
      );
      return;
    }

    if (!isAlreadySelected && props.selectedWeekdays.length === 0) {
      showErrorToasts("Please select at least one delivery day first.");
      return;
    }

    if (
      !isAlreadySelected &&
      !props.selectedWeekdays.includes(day.day())
    ) {
      showErrorToasts(
        `${getWeekdayLabel(day.day())} is not included in your selected delivery days.`
      );
      return;
    }

    if (!isAlreadySelected && !isCustomMode) {
      const maxDates = getMaxDeliveryDatesForDuration(props.duration);
      if (props.selectedDeliveryDates.length >= maxDates) {
        showErrorToasts(
          `You can select up to ${maxDates} delivery date${maxDates === 1 ? "" : "s"} for ${props.duration} on your selected delivery days.`
        );
        return;
      }
    }

    if (shouldDisableDate(day)) return;

    if (isAlreadySelected && !isCustomMode) {
      const minDates = getMinDeliveryDatesForDuration(props.duration);
      if (props.selectedDeliveryDates.length <= minDates) {
        showErrorToasts(
          `Please select at least ${minDates} delivery date${minDates === 1 ? "" : "s"} for ${props.duration}.`
        );
        return;
      }
    }

    const next = toggleSelectedDeliveryDate(props.selectedDeliveryDates, dateStr);
    props.setSelectedDeliveryDates(next);
    props.setSelectedDate(next.length > 0 ? dayjs(next[0]) : null);
  };

  const handleCalendarChange = (newValue: Dayjs | null) => {
    if (newValue) {
      handleToggleDeliveryDate(newValue);
    }
  };

  const handleExtendActivePlan = () => {
    const endDate = blockedSubscriptionEndDate ?? activeSubEndDate;
    if (!endDate) return;

    const start = getFirstAvailableDeliveryDate(firstAvailableDateParams);
    if (!isCustomMode) {
      regenerateDeliveryDates(start);
      return;
    }

    props.setSelectedDate(start);
  };

  const hasValidWeekdaySelection =
    isCustomMode ||
    (props.selectedWeekdays.length >= MIN_WEEKDAY_SELECTION &&
      props.selectedWeekdays.length <= MAX_WEEKDAY_SELECTION);

  const maxDeliveryDates = isCustomMode
    ? null
    : getMaxDeliveryDatesForDuration(props.duration);

  const minDeliveryDates = isCustomMode
    ? null
    : getMinDeliveryDatesForDuration(props.duration);

  const hasValidDateCount =
    isCustomMode ||
    (minDeliveryDates != null &&
      maxDeliveryDates != null &&
      props.selectedDeliveryDates.length >= minDeliveryDates &&
      props.selectedDeliveryDates.length <= maxDeliveryDates);

  const canProceed = isCustomMode
    ? props.selectedDeliveryDates.length > 0
    : props.selectedDeliveryDates.length > 0 &&
      hasValidWeekdaySelection &&
      hasValidDateCount;

  return (
    <Box>
      <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#0F172A", mb: 0.5 }}>Delivery Schedule</Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          {props.subscriptionMode === "renew"
            ? hasActivePlan || hasUpcomingPlan
              ? "Schedule future deliveries without overlapping active or upcoming subscription dates."
              : "Choose delivery dates and duration for this renewal."
            : "Choose delivery dates and duration for this subscription."}
        </Typography>
      </Box>

      {props.subscriptionMode === "renew" && hasActivePlan && activeSubEndDate && (
        <Alert
          severity="warning"
          icon={<EventAvailableIcon fontSize="inherit" />}
          action={
            <Button color="warning" size="small" variant="contained" disableElevation onClick={handleExtendActivePlan}>
              Start After Expiry
            </Button>
          }
          sx={{ mb: 2, borderRadius: 3, alignItems: "center", border: "1px solid", borderColor: "warning.main", bgcolor: alpha("#F59E0B", 0.05) }}
        >
          <AlertTitle sx={{ fontWeight: 700, mb: 0 }}>Active Subscription Detected</AlertTitle>
          This client has an active plan ending on <strong>{activeSubEndDate.format("MMM D, YYYY")}</strong>. You can extend after expiry or pick a future custom date.
        </Alert>
      )}

      {props.subscriptionMode === "renew" && hasUpcomingPlan && upcomingSubDates.length > 0 && (
        <Alert
          severity="info"
          icon={<EventAvailableIcon fontSize="inherit" />}
          sx={{
            mb: 4,
            borderRadius: 3,
            alignItems: "center",
            border: "1px solid",
            borderColor: alpha("#8B5CF6", 0.4),
            bgcolor: alpha("#8B5CF6", 0.05),
            "& .MuiAlert-icon": { color: "#7C3AED" },
          }}
        >
          <AlertTitle sx={{ fontWeight: 700, mb: 0, color: "#5B21B6" }}>
            Upcoming Subscription Detected
          </AlertTitle>
          <Typography sx={{ fontSize: 14, color: "#6D28D9" }}>
            {props.upcomingMealPlanName ? (
              <>
                Upcoming plan <strong>{props.upcomingMealPlanName}</strong>
                {upcomingSubEndDate ? (
                  <>
                    {" "}
                    ends on <strong>{upcomingSubEndDate.format("MMM D, YYYY")}</strong>
                  </>
                ) : null}
                . Those delivery dates cannot be selected.
              </>
            ) : (
              <>
                This client has an upcoming subscription
                {upcomingSubEndDate ? (
                  <>
                    {" "}
                    ending on <strong>{upcomingSubEndDate.format("MMM D, YYYY")}</strong>
                  </>
                ) : null}
                . Those delivery dates cannot be selected.
              </>
            )}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 4 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 3 }}>Duration & Settings</Typography>

            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 2 }}>Select Duration</Typography>
            <Grid container spacing={1.5} sx={{ mb: 4 }}>
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = props.duration === opt.label;
                const packageDiscount = getDurationPackageDiscount(
                  opt.label,
                  portalSettings
                );

                return (
                  <Grid item xs={6} sm={3} key={opt.label}>
                    <Box
                      onClick={() => handleDurationChange(opt.label)}
                      sx={{
                        py: 1.5,
                        px: 1,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor: isSelected ? "primary.main" : "#E2E8F0",
                        bgcolor: isSelected ? alpha("#10B981", 0.03) : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        height: "100%",
                        "&:hover": { borderColor: isSelected ? "primary.main" : "#CBD5E1" }
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: isSelected ? "primary.main" : "#0F172A", textAlign: "center" }}>
                        {opt.label}
                      </Typography>
                      {packageDiscount != null && packageDiscount > 0 ? (
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: isSelected ? "primary.main" : "#059669",
                            mt: 0.5,
                            textAlign: "center",
                          }}
                        >
                          {packageDiscount}% discount
                        </Typography>
                      ) : null}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 1 }}>
              Delivery Days
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "text.secondary", mb: 2 }}>
              {isCustomMode
                ? "Select which weekdays are available for delivery. Saturday is not available."
                : `Select ${MIN_WEEKDAY_SELECTION} to ${MAX_WEEKDAY_SELECTION} weekdays. Saturday is not available.`}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
              {WEEKDAY_OPTIONS.map((weekday) => {
                const disabled = isWeekdayDisabled(weekday.value);
                const isSelected = props.selectedWeekdays.includes(weekday.value);

                return (
                  <Button
                    key={weekday.value}
                    size="small"
                    disabled={disabled}
                    variant={isSelected ? "contained" : "outlined"}
                    onClick={() => handleWeekdayToggle(weekday.value)}
                    sx={{
                      minWidth: 52,
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: "none",
                      borderColor: "#E2E8F0",
                      color: isSelected ? "#fff" : "#0F172A",
                      bgcolor: isSelected ? "primary.main" : "#fff",
                      "&:hover": {
                        borderColor: disabled ? "#E2E8F0" : "primary.main",
                        bgcolor: disabled
                          ? undefined
                          : isSelected
                            ? "primary.dark"
                            : alpha("#10B981", 0.06),
                      },
                      "&.Mui-disabled": {
                        opacity: 0.45,
                        color: "text.disabled",
                      },
                    }}
                  >
                    {weekday.label}
                  </Button>
                );
              })}
            </Stack>
            {!isCustomMode && !hasValidWeekdaySelection ? (
              <Typography sx={{ fontSize: 12, color: "error.main" }}>
                Please select between {MIN_WEEKDAY_SELECTION} and {MAX_WEEKDAY_SELECTION} delivery days.
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: 12,
                  color:
                    !hasValidDateCount && props.selectedDeliveryDates.length > 0
                      ? "error.main"
                      : "text.secondary",
                }}
              >
                {props.selectedDeliveryDates.length} delivery date
                {props.selectedDeliveryDates.length === 1 ? "" : "s"} selected
                {minDeliveryDates != null && maxDeliveryDates != null
                  ? ` (${minDeliveryDates}–${maxDeliveryDates} required — can span multiple weeks)`
                  : ""}
                .
              </Typography>
            )}
          </Box>

          <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 1 }}>
              Delivery Calendar
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 3 }}>
              {isCustomMode
                ? "Pick any dates on your selected delivery days. There is no limit on how many you can choose."
                : "Dates auto-fill for the current period. You can add more on your selected days from later weeks, up to the package limit."}
            </Typography>
            
            <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={4}>
              <Box sx={{ width: "100%", maxWidth: 360, display: "flex", justifyContent: "center" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={null}
                    onChange={handleCalendarChange}
                    shouldDisableDate={shouldDisableDate}
                    slots={{ day: CustomDay as any }}
                    slotProps={{
                      day: {
                        selectedDates: activeDates,
                        activeSubDates,
                        upcomingSubDates,
                        isRenewMode: props.subscriptionMode === "renew",
                        onToggleDate: handleToggleDeliveryDate,
                      } as any,
                    }}
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      margin: 0,
                    }}
                  />
                </LocalizationProvider>
              </Box>
              
              <Stack 
                spacing={3} 
                justifyContent="center"
                sx={{ 
                  minWidth: 180, 
                  pl: { md: 4 }, 
                  borderLeft: { md: "1px solid #F1F5F9" }, 
                  pt: { xs: 4, md: 0 }, 
                  borderTop: { xs: "1px solid #F1F5F9", md: "none" },
                  height: "100%"
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: props.subscriptionMode === "renew" ? "#3B82F6" : "primary.main" }} />
                    <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>
                      Selected
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 2, border: "1px solid #CBD5E1", bgcolor: "#fff" }} />
                    <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>Available</Typography>
                  </Box>
                  {props.subscriptionMode === "renew" && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#F59E0B" }} />
                      <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>Active plan</Typography>
                    </Box>
                  )}
                  {props.subscriptionMode === "renew" && hasUpcomingPlan && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#8B5CF6" }} />
                      <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>Upcoming plan</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#E2E8F0" }} />
                    <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>Unavailable</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1 }}>
                    {props.selectedDeliveryDates.length} date
                    {props.selectedDeliveryDates.length === 1 ? "" : "s"} selected
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ position: "sticky", top: 24 }}>
            <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 4 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 4 }}>Additional Settings</Typography>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, gap: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Delivery Address</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={!props.clientId}
                  onClick={() => setShowAddLocationModal(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: "#E2E8F0",
                    color: "#0F172A",
                    "&:hover": { borderColor: "primary.main", bgcolor: alpha("#10B981", 0.04) },
                  }}
                >
                  {messages["clientLocations.add"] as string}
                </Button>
              </Box>
              <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
                Select or update where the meals should be delivered.
              </Typography>
              {isLocationsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : clientLocations.length === 0 ? (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px dashed #CBD5E1",
                    bgcolor: "#F8FAFC",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1.5 }}>
                    No delivery locations found for this client.
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={!props.clientId}
                    onClick={() => setShowAddLocationModal(true)}
                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                  >
                    {messages["clientLocations.add"] as string}
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {clientLocations.map((location) => {
                    const isSelected = props.clientLocationId === location.id;
                    const isHome = location.type === "Home";
                    const addressPreview =
                      location.fullAddressEn ||
                      [location.area, location.street, location.building]
                        .filter(Boolean)
                        .join(", ");

                    return (
                      <Grid item xs={12} sm={6} key={location.id}>
                        <Box
                          onClick={() => props.setClientLocationId(location.id)}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            border: "2px solid",
                            borderColor: isSelected ? "primary.main" : "#E2E8F0",
                            bgcolor: isSelected ? alpha("#10B981", 0.05) : "#fff",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            position: "relative",
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            {isHome ? (
                              <HomeOutlinedIcon sx={{ color: isSelected ? "primary.main" : "#64748B" }} />
                            ) : (
                              <BusinessOutlinedIcon sx={{ color: isSelected ? "primary.main" : "#64748B" }} />
                            )}
                            <Tooltip title={messages["clientLocations.edit"] as string}>
                              <IconButton
                                size="small"
                                onClick={(event) => handleEditLocation(event, location)}
                                sx={{
                                  color: "#64748B",
                                  bgcolor: "#F8FAFC",
                                  "&:hover": { bgcolor: "#EEF2F7", color: "primary.main" },
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                              {location.type}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "text.secondary",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {addressPreview}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A", mb: 1 }}>
                Preferred Delivery Time
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={props.preferredDeliveryTime}
                  displayEmpty
                  onChange={(e) => props.setPreferredDeliveryTime(e.target.value)}
                >
                  {preferredDeliveryTimeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            </Box>

            <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mt: 4 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 3 }}>Discounts</Typography>

            {selectedPackageDiscount != null && selectedPackageDiscount > 0 ? (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha("#10B981", 0.06),
                  border: "1px solid",
                  borderColor: alpha("#10B981", 0.2),
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0F172A", mb: 0.5 }}>
                  Package Discount
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  {props.duration === "1 Month"
                    ? (messages["clientPortalSettings.monthlyPackageSubsciptionDiscount"] as string)
                    : props.duration === "3 Months"
                      ? (messages["clientPortalSettings.threeMonthlyPackageSubsciptionDiscount"] as string)
                      : "Package discount"}
                  : <strong>{selectedPackageDiscount}%</strong>
                </Typography>
              </Box>
            ) : null}
            
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Promo Code</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Enter code" 
                value={props.promoCode}
                onChange={(e) => props.setPromoCode(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LocalOfferIcon sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment>,
                }}
              />
              <Button variant="contained" disableElevation sx={{ borderRadius: 2, px: 3 }}>Apply</Button>
            </Stack>

            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Manual Discount</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="0.00" 
              value={props.manualDiscount}
              onChange={(e) => props.setManualDiscount(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">AED</InputAdornment>,
              }}
            />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" size="large" onClick={props.onBack} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, color: "#475569", borderColor: "#E2E8F0" }}>
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={props.onNext}
          disabled={
            props.isSaving ||
            !props.clientLocationId ||
            !props.preferredDeliveryTime ||
            !canProceed
          }
          sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}
        >
          {props.isSaving ? <CircularProgress size={22} color="inherit" /> : "Next"}
        </Button>
      </Box>

      {props.clientId ? (
        <>
          <AddClientLocation
            showAddModal={showAddLocationModal}
            setShowAddModal={setShowAddLocationModal}
            label={messages["clientLocations.add"] as string}
            clientId={props.clientId}
          />
          {selectedLocation ? (
            <EditClientLocation
              showEditModal={showEditLocationModal}
              setShowEditModal={(open) => {
                const next =
                  typeof open === "function"
                    ? open(showEditLocationModal)
                    : open;
                setShowEditLocationModal(next);
                if (!next) setSelectedLocation(null);
              }}
              label={messages["clientLocations.edit"] as string}
              clientId={props.clientId}
              selectedRow={{
                id: selectedLocation.id,
                nameAr: selectedLocation.fullAddressAr || selectedLocation.type,
                nameEn: selectedLocation.fullAddressEn || selectedLocation.type,
              }}
            />
          ) : null}
        </>
      ) : null}
    </Box>
  );
};

export default Step2Schedule;
