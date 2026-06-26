/** @format */

import { alpha, Box, Typography, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import { PROFILE_RADIUS } from "./profileTheme";

type Props = {
  label: string;
  value: string | number;
  suffix?: string;
  icon: ReactNode;
  accent: string;
};

const KpiStatCard = ({ label, value, suffix, icon, accent }: Props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: `${PROFILE_RADIUS}px`,
        border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        bgcolor: theme.palette.background.paper,
        boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.02)}`,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: `0 12px 32px ${alpha(accent, 0.15)}`,
          transform: "translateY(-4px)",
          borderColor: alpha(accent, 0.3),
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover::after": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${alpha(accent, 0.2)}, ${alpha(accent, 0.05)})`,
          color: accent,
          mb: 2,
          boxShadow: `inset 0 0 0 1px ${alpha(accent, 0.1)}`,
          "& svg": {
            fontSize: 24,
          },
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "text.primary",
          display: "flex",
          alignItems: "baseline",
        }}
      >
        {value}
        {suffix && (
          <Typography
            component="span"
            sx={{ fontSize: 15, fontWeight: 700, color: "text.secondary", ml: 0.5 }}
          >
            {suffix}
          </Typography>
        )}
      </Typography>
    </Box>
  );
};

export default KpiStatCard;
