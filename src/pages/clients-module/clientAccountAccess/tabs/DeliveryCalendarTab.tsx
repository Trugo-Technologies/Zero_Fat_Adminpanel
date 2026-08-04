import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FilterListIcon from "@mui/icons-material/FilterList";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import { alpha, Box, Button, CircularProgress, FormControlLabel, IconButton, Stack, Switch, Typography, Menu, MenuItem } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { ReactNode, useMemo, useState } from "react";
import { IDeliveryCalendarPauseStatus, IDeliveryCalendarSummary } from "src/types/modules/clientsManagement/clientAccountAccess";
import DeliveryCalendar from "../components/DeliveryCalendar";
import { DELIVERY_CALENDAR_STATUS_FILTERS, DeliveryCalendarStatusFilter } from "../deliveryCalendarStatuses";
import { mapDeliveryCalendarSummaryToStats } from "../mapDeliveryCalendar";
import { DeliveryDay } from "../types";

type Props = {
  month: Dayjs;
  deliveries: DeliveryDay[];
  summary?: IDeliveryCalendarSummary;
  selectedDelivery: DeliveryDay | null;
  statusFilter: DeliveryCalendarStatusFilter;
  onStatusFilterChange: (status: DeliveryCalendarStatusFilter) => void;
  onMonthChange: (month: Dayjs) => void;
  onDayClick: (delivery: DeliveryDay) => void;
  isLoading?: boolean;
  useClientSideStatusFilter?: boolean;
  canBypassCutoff?: boolean;
  bypassCutoffEnabled?: boolean;
  onBypassCutoffEnabledChange?: (enabled: boolean) => void;
  pauseStatus?: IDeliveryCalendarPauseStatus | null;
  onResumeClick?: () => void;
};

const MetricCard = ({ title, value, icon, color }: { title: string; value: number; icon: ReactNode; color: string }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: "16px",
      border: "1px solid #E2E8F0",
      display: "flex",
      alignItems: "center",
      gap: 2,
      flex: 1,
      minWidth: 150,
      bgcolor: "#FFFFFF",
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        bgcolor: alpha(color, 0.1),
        color: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: color, lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary" }}>
        {title}
      </Typography>
    </Box>
  </Box>
);

const DeliveryCalendarTab = ({
  month,
  deliveries,
  summary,
  selectedDelivery,
  statusFilter,
  onStatusFilterChange,
  onMonthChange,
  onDayClick,
  isLoading = false,
  useClientSideStatusFilter = false,
  canBypassCutoff = false,
  bypassCutoffEnabled = false,
  onBypassCutoffEnabledChange,
  pauseStatus = null,
  onResumeClick,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const stats = useMemo(() => {
    if (summary) {
      return mapDeliveryCalendarSummaryToStats(summary);
    }

    return {
      Delivered: deliveries.filter((d) => d.status === "Delivered").length,
      Pending: deliveries.filter((d) => d.status === "Pending").length,
      Skipped: deliveries.filter((d) => d.status === "Skipped").length,
      Moved: deliveries.filter((d) => d.status === "Moved").length,
      Cancelled: deliveries.filter((d) => d.status === "Cancelled").length,
    };
  }, [deliveries, summary]);

  const filteredDeliveries = useMemo(() => {
    if (!useClientSideStatusFilter || statusFilter === "All Status") {
      return deliveries;
    }

    return deliveries.filter((d) => d.status === statusFilter);
  }, [deliveries, statusFilter, useClientSideStatusFilter]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#FFFFFF", borderRadius: "24px" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              bgcolor: alpha("#10B981", 0.1),
              color: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarTodayOutlinedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#1A2B48" }}>
              Delivery Calendar
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Track and manage daily meal delivery status
            </Typography>
          </Box>
        </Stack>
        {canBypassCutoff ? (
          <FormControlLabel
            sx={{ m: 0, flexShrink: 0, pt: 0.5 }}
            control={
              <Switch
                checked={bypassCutoffEnabled}
                onChange={(e) => onBypassCutoffEnabledChange?.(e.target.checked)}
                color="warning"
              />
            }
            label={
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1A2B48" }}>
                Disable Validation
              </Typography>
            }
          />
        ) : null}
      </Stack>

      {pauseStatus?.isPaused ? (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: "16px",
            border: `1px solid ${alpha("#F59E0B", 0.35)}`,
            bgcolor: alpha("#F59E0B", 0.08),
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PauseCircleOutlineIcon sx={{ color: "#F59E0B" }} />
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1A2B48" }}>
                Deliveries are paused
                {pauseStatus.pauseDate
                  ? ` since ${dayjs(pauseStatus.pauseDate).format("MMM D, YYYY")}`
                  : ""}
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                {pauseStatus.pausedDayCount > 0
                  ? `${pauseStatus.pausedDayCount} paused ${
                      pauseStatus.pausedDayCount === 1 ? "day" : "days"
                    }. `
                  : ""}
                {pauseStatus.maxAllowedResumeDate
                  ? `Resume allowed until ${dayjs(pauseStatus.maxAllowedResumeDate).format("MMM D, YYYY")}.`
                  : ""}
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            onClick={onResumeClick}
            sx={{
              bgcolor: "#F59E0B",
              color: "#FFFFFF",
              fontWeight: 700,
              borderRadius: "10px",
              px: 3,
              flexShrink: 0,
              "&:hover": { bgcolor: "#D97706" },
            }}
          >
            Resume Delivery
          </Button>
        </Stack>
      ) : null}

      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            sx={{ border: "1px solid #E2E8F0", borderRadius: "8px", color: "text.primary" }}
            onClick={() => onMonthChange(month.subtract(1, "month"))}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Box
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              px: 2,
              py: 1.1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarTodayOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48", minWidth: 110, textAlign: "center" }}>
              {month.format("MMMM YYYY")}
            </Typography>
          </Box>
          <IconButton
            sx={{ border: "1px solid #E2E8F0", borderRadius: "8px", color: "text.primary" }}
            onClick={() => onMonthChange(month.add(1, "month"))}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: 13,
              color: "text.secondary",
              cursor: "pointer",
              "&:hover": { bgcolor: "#F8FAFC" },
            }}
            onClick={() => onMonthChange(dayjs())}
          >
            Today
          </Box>
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "#F8FAFC" },
            }}
          >
            <FilterListIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48" }}>{statusFilter}</Typography>
            <KeyboardArrowDownIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { mt: 1, borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } }}
          >
            {DELIVERY_CALENDAR_STATUS_FILTERS.map((status) => (
              <MenuItem
                key={status}
                onClick={() => {
                  onStatusFilterChange(status);
                  setAnchorEl(null);
                }}
                sx={{ fontSize: 14, fontWeight: 500, minWidth: 150 }}
              >
                {status}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
        <MetricCard title="Delivered" value={stats.Delivered} icon={<CheckCircleOutlineIcon />} color="#10B981" />
        <MetricCard title="Scheduled" value={stats.Pending} icon={<AccessTimeIcon />} color="#F59E0B" />
        <MetricCard title="Skipped" value={stats.Skipped} icon={<RemoveCircleOutlineIcon />} color="#64748B" />
        <MetricCard title="Moved" value={stats.Moved} icon={<SwapHorizIcon />} color="#3B82F6" />
        <MetricCard title="Cancelled" value={stats.Cancelled} icon={<CancelOutlinedIcon />} color="#EF4444" />
      </Stack>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DeliveryCalendar
          month={month}
          deliveries={filteredDeliveries}
          selectedDate={selectedDelivery?.date ?? null}
          onMonthChange={onMonthChange}
          onDayClick={onDayClick}
        />
      )}
    </Box>
  );
};

export default DeliveryCalendarTab;
