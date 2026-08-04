/** @format */

import { alpha, Box } from "@mui/material";
import { DeliveryStatus } from "../types";

const statusConfig: Record<DeliveryStatus, { color: string; label: string }> = {
  Delivered: { color: "#10B981", label: "Delivered" },
  Pending: { color: "#F59E0B", label: "Scheduled" },
  Skipped: { color: "#64748B", label: "Skipped" },
  Moved: { color: "#3B82F6", label: "Moved" },
  Unavailable: { color: "#94A3B8", label: "Unavailable" },
  Cancelled: { color: "#EF4444", label: "Cancelled" },
};

/** Legend entries shown below the calendar grid — labels match API `scheduleLabel` values. */
export const DELIVERY_CALENDAR_LEGEND: { status: DeliveryStatus; label: string }[] = [
  { status: "Delivered", label: "Delivered" },
  { status: "Pending", label: "Scheduled" },
  { status: "Skipped", label: "Skipped" },
  { status: "Moved", label: "Moved" },
  { status: "Unavailable", label: "Unavailable" },
  { status: "Cancelled", label: "Cancelled" },
];

export const DeliveryStatusChip = ({
  status,
  label,
}: {
  status: DeliveryStatus;
  /** When provided (e.g. API `scheduleLabel`), shown instead of the default status text. */
  label?: string | null;
}) => {
  const config = statusConfig[status];
  const displayLabel = label?.trim() || config.label;
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.25,
        py: 0.5,
        borderRadius: "20px",
        bgcolor: alpha(config.color, 0.1),
        color: config.color,
        fontSize: 11,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        border: `1px solid ${alpha(config.color, 0.2)}`,
        whiteSpace: "nowrap",
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "currentColor", mr: 0.75, boxShadow: `0 0 8px currentColor` }} />
      {displayLabel}
    </Box>
  );
};
