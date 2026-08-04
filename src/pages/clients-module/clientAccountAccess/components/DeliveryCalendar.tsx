/** @format */

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import { alpha, Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { DeliveryDay } from "../types";
import { DeliveryStatusChip, DELIVERY_CALENDAR_LEGEND } from "./statusChip";

type Props = {
  month: Dayjs;
  deliveries: DeliveryDay[];
  selectedDate: string | null;
  onMonthChange: (month: Dayjs) => void;
  onDayClick: (delivery: DeliveryDay) => void;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DeliveryCalendar = ({ month, deliveries, selectedDate, onMonthChange, onDayClick }: Props) => {
  const deliveryMap = useMemo(() => {
    const map = new Map<string, DeliveryDay>();
    deliveries.forEach((d) => map.set(d.date, d));
    return map;
  }, [deliveries]);

  const calendarCells = useMemo(() => {
    const startOfMonth = month.startOf("month");
    const endOfMonth = month.endOf("month");
    const startPad = startOfMonth.day();
    const totalDays = endOfMonth.date();
    const cells: Array<{ date: Dayjs | null; delivery?: DeliveryDay }> = [];

    for (let i = 0; i < startPad; i++) cells.push({ date: null });
    for (let day = 1; day <= totalDays; day++) {
      const date = startOfMonth.date(day);
      cells.push({ date, delivery: deliveryMap.get(date.format("YYYY-MM-DD")) });
    }
    return cells;
  }, [month, deliveryMap]);

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "24px",
        p: { xs: 2, md: 4 },
        boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
        border: "1px solid #F1F5F9",
      }}
    >

      {/* Grid Header */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1.5, mb: 1.5 }}>
        {WEEKDAYS.map((day) => (
          <Typography
            key={day}
            sx={{
              fontSize: 12,
              fontWeight: 700,
              textAlign: "center",
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {day.substring(0, 3)}
          </Typography>
        ))}
      </Box>

      {/* Grid Cells */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1.5 }}>
        {calendarCells.map((cell, index) => {
          if (!cell.date) return <Box key={`empty-${index}`} sx={{ minHeight: 120 }} />;

          const dateKey = cell.date.format("YYYY-MM-DD");
          const isSelected = selectedDate === dateKey;
          const isToday = cell.date.isSame(dayjs(), "day");
          const hasDelivery = Boolean(cell.delivery);
          const isInteractive =
            hasDelivery && cell.delivery!.status !== "Unavailable";

          let mealsCount = cell.delivery?.mealCount ?? 0;
          if (!mealsCount && cell.delivery) {
            if (cell.delivery.breakfast && cell.delivery.breakfast !== "-")
              mealsCount++;
            if (cell.delivery.lunch && cell.delivery.lunch !== "-") mealsCount++;
            if (cell.delivery.dinner && cell.delivery.dinner !== "-")
              mealsCount++;
            if (cell.delivery.postWorkout && cell.delivery.postWorkout !== "-")
              mealsCount++;
          }

          return (
            <Box
              key={dateKey}
              onClick={() => isInteractive && onDayClick(cell.delivery!)}
              sx={{
                minHeight: 120,
                p: 1.5,
                borderRadius: "16px",
                border: "1px solid",
                borderColor: isToday
                  ? "#10B981"
                  : isSelected
                    ? "#1A2B48"
                    : "#E2E8F0",
                bgcolor: isToday ? alpha("#10B981", 0.04) : "#FFFFFF",
                cursor: isInteractive ? "pointer" : "default",
                transition: "all 0.2s ease",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                "&:hover": isInteractive
                  ? {
                      borderColor: "#10B981",
                      boxShadow: `0 8px 24px ${alpha("#10B981", 0.08)}`,
                      transform: "translateY(-2px)",
                    }
                  : {},
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isToday ? "#10B981" : "#1A2B48",
                  mb: 1,
                }}
              >
                {cell.date.date()}
              </Typography>

              {cell.delivery && (
                <Box sx={{ display: "flex", justifyContent: "center", my: "auto" }}>
                  <DeliveryStatusChip
                    status={cell.delivery.status}
                    label={cell.delivery.scheduleLabel}
                  />
                </Box>
              )}

              {mealsCount > 0 && (
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: "auto" }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      bgcolor: "text.secondary",
                    }}
                  />
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>
                    {mealsCount} Meals
                  </Typography>
                </Stack>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Footer Legend */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
        sx={{ mt: 4, px: 1 }}
      >
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {DELIVERY_CALENDAR_LEGEND.map(({ status, label }) => (
            <DeliveryStatusChip key={status} status={status} label={label} />
          ))}
        </Stack>
        <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>
          All times are based on delivery schedule
        </Typography>
      </Stack>
    </Box>
  );
};

export default DeliveryCalendar;
