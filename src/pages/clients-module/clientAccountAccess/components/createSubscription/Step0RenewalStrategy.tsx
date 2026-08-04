import { Box, Typography, Button, Grid, alpha, CircularProgress } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { RenewalStrategyUi } from "../../mapSubscriptionWizardDraft";

type Props = {
  hasActiveSubscription?: boolean;
  activeMealPlanName?: string | null;
  activeSubscriptionEndDate?: string | null;
  renewalStrategy: RenewalStrategyUi;
  setRenewalStrategy: (val: RenewalStrategyUi) => void;
  scheduledStartDate: Dayjs | null;
  setScheduledStartDate: (date: Dayjs | null) => void;
  onNext: () => void | Promise<void>;
  isSaving?: boolean;
  onRenewalStrategyChange?: (strategy: RenewalStrategyUi) => void;
};

const Step0RenewalStrategy = ({
  hasActiveSubscription = false,
  activeMealPlanName,
  activeSubscriptionEndDate,
  renewalStrategy,
  setRenewalStrategy,
  scheduledStartDate,
  setScheduledStartDate,
  onNext,
  isSaving = false,
  onRenewalStrategyChange,
}: Props) => {
  const formattedEndDate = activeSubscriptionEndDate
    ? dayjs(activeSubscriptionEndDate).format("MMMM D, YYYY")
    : null;

  const showActivePlanBanner = hasActiveSubscription;

  const activePlanMessage = (() => {
    if (activeMealPlanName && formattedEndDate) {
      return (
        <>
          The client is currently on <strong>{activeMealPlanName}</strong>. Their
          final delivery is scheduled for <strong>{formattedEndDate}</strong>.
        </>
      );
    }

    if (activeMealPlanName) {
      return (
        <>
          The client is currently on <strong>{activeMealPlanName}</strong>.
        </>
      );
    }

    if (formattedEndDate) {
      return (
        <>
          The client&apos;s current plan ends on <strong>{formattedEndDate}</strong>.
        </>
      );
    }

    if (hasActiveSubscription) {
      return <>This client has an active subscription.</>;
    }

    return null;
  })();

  const handleExtendSelect = () => {
    setRenewalStrategy("extend");
    setScheduledStartDate(null);
    onRenewalStrategyChange?.("extend");
  };

  const handleFutureSelect = () => {
    setRenewalStrategy("future");
    onRenewalStrategyChange?.("future");
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
        Renewal Strategy
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 4 }}>
        {showActivePlanBanner
          ? "This client currently has an active plan. How would you like to handle the renewal?"
          : "Choose how you would like to schedule this renewal."}
      </Typography>

      {showActivePlanBanner && activePlanMessage && (
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: alpha("#F59E0B", 0.05),
          border: "1px solid",
          borderColor: alpha("#F59E0B", 0.3),
          mb: 5,
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <InfoOutlinedIcon sx={{ color: "#D97706", mt: 0.5 }} />
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#92400E", mb: 0.5 }}>
            Active Plan Detected
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#B45309" }}>
            {activePlanMessage}
          </Typography>
        </Box>
      </Box>
      )}

      <Grid container spacing={3} sx={{ mb: renewalStrategy === "future" ? 3 : 6 }}>
        <Grid item xs={12} md={6}>
          <Box
            onClick={handleExtendSelect}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "2px solid",
              borderColor: renewalStrategy === "extend" ? "primary.main" : "#E2E8F0",
              bgcolor: renewalStrategy === "extend" ? alpha("#10B981", 0.02) : "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
              height: "100%",
              "&:hover": {
                borderColor: renewalStrategy === "extend" ? "primary.main" : "#CBD5E1",
              },
            }}
          >
            <Box sx={{ color: renewalStrategy === "extend" ? "primary.main" : "#64748B", mb: 2 }}>
              <EventRepeatIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 1 }}>
              Extend Current Plan
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              The new subscription will automatically begin on the very next
              available delivery day after their current plan expires.{" "}
              <strong>Guarantees no overlap.</strong>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            onClick={handleFutureSelect}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "2px solid",
              borderColor: renewalStrategy === "future" ? "primary.main" : "#E2E8F0",
              bgcolor: renewalStrategy === "future" ? alpha("#10B981", 0.02) : "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
              height: "100%",
              "&:hover": {
                borderColor: renewalStrategy === "future" ? "primary.main" : "#CBD5E1",
              },
            }}
          >
            <Box sx={{ color: renewalStrategy === "future" ? "primary.main" : "#64748B", mb: 2 }}>
              <EventAvailableIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 1 }}>
              Schedule Future Date
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              Manually pick a start date in the future. The system will still
              physically block you from selecting dates that overlap with their
              active or upcoming plan.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {renewalStrategy === "future" && (
        <Box
          sx={{
            mb: 6,
            p: 3,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            bgcolor: "#fff",
            maxWidth: 360,
          }}
        >
          <Typography
            sx={{ fontSize: 14, fontWeight: 700, color: "text.secondary", mb: 2 }}
          >
            Select start date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={scheduledStartDate}
              onChange={(date) => setScheduledStartDate(date)}
              minDate={dayjs().add(1, "day")}
              disablePast
            />
          </LocalizationProvider>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          onClick={onNext}
          disabled={isSaving || (renewalStrategy === "future" && !scheduledStartDate)}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 15,
            boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
          }}
        >
          {isSaving ? <CircularProgress size={22} color="inherit" /> : "Next: Configuration"}
        </Button>
      </Box>
    </Box>
  );
};

export default Step0RenewalStrategy;
