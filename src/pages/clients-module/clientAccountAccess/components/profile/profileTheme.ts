/** @format */

import { alpha, Theme } from "@mui/material/styles";

export const PROFILE_RADIUS = 16;

export const profileCard = (theme: Theme) => ({
  borderRadius: `${PROFILE_RADIUS}px`,
  border: "none",
  boxShadow: "none",
  bgcolor: "transparent",
  height: "100%",
  position: "relative",
});

export const fieldLabel = {
  fontSize: 12,
  fontWeight: 500,
  color: "text.secondary",
  mb: 0.5,
};

export const fieldValue = {
  fontSize: 14,
  fontWeight: 600,
  color: "text.primary",
  lineHeight: 1.5,
};

export const cardTitle = {
  fontSize: 14,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "text.secondary",
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 2,
};
