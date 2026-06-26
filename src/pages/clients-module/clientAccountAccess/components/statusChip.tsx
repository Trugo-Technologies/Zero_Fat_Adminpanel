/** @format */

import { alpha, Box } from "@mui/material";
import { DeliveryStatus } from "../types";

const statusConfig: Record<DeliveryStatus, { color: string; label: string }> = {
  Delivered: { color: "#10B981", label: "Delivered" }, // Green
  Pending: { color: "#EF4444", label: "Pending" }, // Red
  Skipped: { color: "#64748B", label: "Skipped" }, // Gray
  Moved: { color: "#3B82F6", label: "Moved" }, // Blue
};

export const DeliveryStatusChip = ({ status }: { status: DeliveryStatus }) => {
  const config = statusConfig[status];
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
      {config.label}
    </Box>
  );
};
