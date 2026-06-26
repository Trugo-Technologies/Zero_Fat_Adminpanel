import { useState } from "react";
import { Box, Typography, Stack, Button, Grid, Checkbox, FormControlLabel, alpha, Dialog, Switch, TextField, InputAdornment, Alert, AlertTitle } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const durationOptions = [
  { label: "1 Week", days: "5 days" },
  { label: "2 Weeks", days: "10 days" },
  { label: "3 Weeks", days: "15 days" },
  { label: "1 Month", days: "22 days" },
  { label: "2 Months", days: "44 days" },
];

type Props = {
  subscriptionMode: "new" | "renew";
  duration: string;
  setDuration: (val: string) => void;
  skipSaturdays: boolean;
  setSkipSaturdays: (val: boolean) => void;
  skipSundays: boolean;
  setSkipSundays: (val: boolean) => void;
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs | null) => void;
  promoCode: string;
  setPromoCode: (val: string) => void;
  manualDiscount: string;
  setManualDiscount: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const getDaysFromDuration = (duration: string) => {
  if (duration === "1 Week") return 5;
  if (duration === "2 Weeks") return 10;
  if (duration === "3 Weeks") return 15;
  if (duration === "1 Month") return 22;
  if (duration === "2 Months") return 44;
  return 0;
};

const CustomDay = (props: PickersDayProps<Dayjs> & { selectedDate?: Dayjs | null; duration: string; activeDates?: string[]; activeSubDates?: string[]; isRenewMode?: boolean }) => {
  const { day, selectedDate, duration, activeDates = [], activeSubDates = [], isRenewMode, ...other } = props;
  const dateStr = day.format("YYYY-MM-DD");
  
  const isSelected = activeDates.includes(dateStr);
  const isActiveSub = activeSubDates.includes(dateStr);
  const isStartDate = selectedDate && day.isSame(selectedDate, "day");
  const isPast = day.isBefore(dayjs(), "day");

  let bgColor = "transparent";
  let color = "text.primary";
  let fw = 500;

  if (isActiveSub) {
    bgColor = alpha("#F59E0B", 0.15);
    color = "#D97706";
    fw = 700;
  } else if (isSelected) {
    bgColor = isRenewMode ? "info.main" : "primary.main";
    color = "#fff";
    fw = 700;
  } else if (isPast) {
    color = "text.disabled";
  }

  return (
    <PickersDay
      {...other}
      day={day}
      sx={{
        bgcolor: bgColor,
        color: color,
        fontWeight: fw,
        "&:hover": { bgcolor: isSelected ? (isRenewMode ? "info.dark" : "primary.dark") : alpha(isRenewMode ? "#3B82F6" : "#10B981", 0.1) },
        "&.Mui-selected": { bgcolor: isRenewMode ? "info.main" : "primary.main", color: "#fff" }
      }}
    />
  );
};

const Step2Schedule = (props: Props) => {
  const [customDateModalOpen, setCustomDateModalOpen] = useState(false);
  const getActiveDates = () => {
    if (!props.selectedDate) return [];
    let days = getDaysFromDuration(props.duration);
    let current = props.selectedDate;
    const dates = [];
    while (days > 0) {
      const dayOfWeek = current.day();
      let skip = false;
      if (props.skipSundays && dayOfWeek === 0) skip = true;
      if (props.skipSaturdays && dayOfWeek === 6) skip = true;
      
      if (!skip) {
        dates.push(current.format("YYYY-MM-DD"));
        days--;
      }
      current = current.add(1, "day");
    }
    return dates;
  };

  const activeDates = getActiveDates();

  // Mock Active Subscription Dates for Renew Mode
  const activeSubEndDate = dayjs().add(5, "day");
  const getActiveSubDates = () => {
    if (props.subscriptionMode !== "renew") return [];
    let current = dayjs();
    const dates = [];
    while (current.isBefore(activeSubEndDate, "day") || current.isSame(activeSubEndDate, "day")) {
      const dayOfWeek = current.day();
      let skip = false;
      if (props.skipSundays && dayOfWeek === 0) skip = true;
      if (props.skipSaturdays && dayOfWeek === 6) skip = true;
      if (!skip) {
        dates.push(current.format("YYYY-MM-DD"));
      }
      current = current.add(1, "day");
    }
    return dates;
  };

  const activeSubDates = getActiveSubDates();

  const shouldDisableDate = (date: Dayjs) => {
    const day = date.day();
    if (props.skipSundays && day === 0) return true;
    if (props.skipSaturdays && day === 6) return true;
    if (date.isBefore(dayjs(), "day")) return true;
    // Prevent overlapping with active subscription
    if (props.subscriptionMode === "renew" && activeSubDates.includes(date.format("YYYY-MM-DD"))) return true;
    return false;
  };

  const handleExtendActivePlan = () => {
    props.setSelectedDate(activeSubEndDate.add(1, "day"));
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#0F172A", mb: 0.5 }}>Delivery Schedule</Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          {props.subscriptionMode === "renew" 
            ? "Schedule future deliveries without overlapping the current active plan." 
            : "Choose delivery dates and duration for this subscription."}
        </Typography>
      </Box>

      {props.subscriptionMode === "renew" && (
        <Alert 
          severity="warning" 
          icon={<EventAvailableIcon fontSize="inherit" />}
          action={
            <Button color="warning" size="small" variant="contained" disableElevation onClick={handleExtendActivePlan}>
              Start After Expiry
            </Button>
          }
          sx={{ mb: 4, borderRadius: 3, alignItems: "center", border: "1px solid", borderColor: "warning.main", bgcolor: alpha("#F59E0B", 0.05) }}
        >
          <AlertTitle sx={{ fontWeight: 700, mb: 0 }}>Active Subscription Detected</AlertTitle>
          This client has an active plan ending on <strong>{activeSubEndDate.format("MMM D, YYYY")}</strong>. You can extend their active plan or pick a future custom date.
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 4 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 3 }}>Duration & Settings</Typography>

            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 2 }}>Select Duration</Typography>
            <Grid container spacing={1.5} sx={{ mb: 4 }}>
              {durationOptions.map((opt) => {
                const isSelected = props.duration === opt.label;
                return (
                  <Grid item xs key={opt.label}>
                    <Box
                      onClick={() => props.setDuration(opt.label)}
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
                      <Typography sx={{ fontSize: 12, color: isSelected ? "primary.main" : "text.secondary", opacity: isSelected ? 0.8 : 1, textAlign: "center" }}>
                        {opt.days}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 2 }}>Weekend Settings</Typography>
            <Stack direction="row" spacing={4}>
              <FormControlLabel
                control={<Checkbox checked={props.skipSaturdays} onChange={(e) => props.setSkipSaturdays(e.target.checked)} sx={{ color: "primary.main", "&.Mui-checked": { color: "primary.main" } }} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>Skip Saturdays</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={<Checkbox checked={props.skipSundays} onChange={(e) => props.setSkipSundays(e.target.checked)} sx={{ color: "primary.main", "&.Mui-checked": { color: "primary.main" } }} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>Skip Sundays</Typography>
                  </Box>
                }
              />
            </Stack>
          </Box>

          <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 3 }}>Delivery Calendar</Typography>
            
            <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={4}>
              <Box sx={{ width: "100%", maxWidth: 360, display: "flex", justifyContent: "center" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={props.selectedDate}
                    onChange={(newValue) => props.setSelectedDate(newValue)}
                    shouldDisableDate={shouldDisableDate}
                    slots={{ day: CustomDay as any }}
                    slotProps={{
                      day: { 
                        selectedDate: props.selectedDate, 
                        duration: props.duration, 
                        activeDates,
                        activeSubDates,
                        isRenewMode: props.subscriptionMode === "renew"
                      } as any
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
                  {props.subscriptionMode === "new" && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "primary.main" }} />
                      <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>Selected</Typography>
                    </Box>
                  )}
                  {props.subscriptionMode === "renew" && (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#3B82F6" }} />
                        <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>Renewal Selected</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#F59E0B" }} />
                        <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>Active Subs</Typography>
                      </Box>
                    </>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#E2E8F0" }} />
                    <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>Unavailable</Typography>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ position: "sticky", top: 24 }}>
            <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 4 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 1 }}>Additional Settings</Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 4 }}>Configure delivery location and extra modules.</Typography>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Delivery Address</Typography>
                {/* <Typography sx={{ fontSize: 13, color: "primary.main", fontWeight: 600, cursor: "pointer" }}>+ Add New</Typography> */}
              </Box>
              <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>Select where the meals should be delivered.</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                   <Box sx={{ p: 2, borderRadius: 3, border: "2px solid", borderColor: "primary.main", bgcolor: alpha("#10B981", 0.05), cursor: "pointer", display: "flex", flexDirection: "column", gap: 1 }}>
                     <HomeOutlinedIcon sx={{ color: "primary.main" }} />
                     <Box>
                       <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Home</Typography>
                       <Typography sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>123 Palm Jumeirah...</Typography>
                     </Box>
                   </Box>
                </Grid>
                <Grid item xs={6}>
                   <Box sx={{ p: 2, borderRadius: 3, border: "2px solid", borderColor: "#E2E8F0", bgcolor: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", gap: 1 }}>
                     <BusinessOutlinedIcon sx={{ color: "#64748B" }} />
                     <Box>
                       <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Office</Typography>
                       <Typography sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Downtown Dubai, B...</Typography>
                     </Box>
                   </Box>
                </Grid>
              </Grid>
            </Box>

            </Box>

            <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mt: 4 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 3 }}>Discounts</Typography>
            
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
        <Button variant="contained" size="large" onClick={props.onNext} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}>
          Next
        </Button>
      </Box>

      {/* Custom Dates Dialog Mockup */}
      <Dialog open={customDateModalOpen} onClose={() => setCustomDateModalOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A", mb: 1 }}>Custom Date Range</Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 4 }}>Select specific delivery dates tailored for this client.</Typography>
          
          <Box sx={{ p: 4, borderRadius: 3, border: "1px dashed #CBD5E1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mb: 4, bgcolor: "#F8FAFC" }}>
            <EventAvailableIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1, opacity: 0.5 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>Advanced Multi-Date Picker</Typography>
            <Typography sx={{ fontSize: 13, color: "text.disabled" }}>Coming Soon</Typography>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setCustomDateModalOpen(false)} sx={{ color: "#64748B", fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={() => setCustomDateModalOpen(false)} sx={{ borderRadius: 2, fontWeight: 600, boxShadow: "none" }}>Apply Custom Dates</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Step2Schedule;
