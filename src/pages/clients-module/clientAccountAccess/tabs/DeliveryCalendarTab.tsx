import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FilterListIcon from "@mui/icons-material/FilterList";
import { alpha, Box, IconButton, Stack, Typography, Menu, MenuItem } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, ReactNode, useState } from "react";
import DeliveryCalendar from "../components/DeliveryCalendar";
import { DeliveryDay } from "../types";

type Props = {
  month: Dayjs;
  deliveries: DeliveryDay[];
  selectedDelivery: DeliveryDay | null;
  onMonthChange: (month: Dayjs) => void;
  onDayClick: (delivery: DeliveryDay) => void;
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

const DeliveryCalendarTab = ({ month, deliveries, selectedDelivery, onMonthChange, onDayClick }: Props) => {
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const stats = useMemo(() => {
    return {
      Delivered: deliveries.filter((d) => d.status === "Delivered").length,
      Pending: deliveries.filter((d) => d.status === "Pending").length,
      Skipped: deliveries.filter((d) => d.status === "Skipped").length,
      Moved: deliveries.filter((d) => d.status === "Moved").length,
    };
  }, [deliveries]);

  const filteredDeliveries = useMemo(() => {
    if (statusFilter === "All Status") return deliveries;
    return deliveries.filter((d) => d.status === statusFilter);
  }, [deliveries, statusFilter]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#FFFFFF", borderRadius: "24px" }}>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
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
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#1A2B48" }}>Delivery Calendar</Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Track and manage daily meal delivery status
          </Typography>
        </Box>
      </Stack>

      {/* Controls */}
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
              cursor: "pointer",
              "&:hover": { bgcolor: "#F8FAFC" },
            }}
          >
            <CalendarTodayOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48", minWidth: 110, textAlign: "center" }}>
              {month.format("MMMM YYYY")}
            </Typography>
            <KeyboardArrowDownIcon fontSize="small" sx={{ color: "text.secondary" }} />
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
            {["All Status", "Delivered", "Pending", "Skipped", "Moved"].map((status) => (
              <MenuItem
                key={status}
                onClick={() => {
                  setStatusFilter(status);
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

      {/* Analytics */}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
        <MetricCard title="Delivered" value={stats.Delivered} icon={<CheckCircleOutlineIcon />} color="#10B981" />
        <MetricCard title="Pending" value={stats.Pending} icon={<AccessTimeIcon />} color="#F59E0B" />
        <MetricCard title="Skipped" value={stats.Skipped} icon={<RemoveCircleOutlineIcon />} color="#64748B" />
        <MetricCard title="Moved" value={stats.Moved} icon={<SwapHorizIcon />} color="#3B82F6" />
      </Stack>

      {/* Calendar Grid */}
      <DeliveryCalendar
        month={month}
        deliveries={filteredDeliveries}
        selectedDate={selectedDelivery?.date ?? null}
        onMonthChange={onMonthChange}
        onDayClick={onDayClick}
      />
    </Box>
  );
};

export default DeliveryCalendarTab;

