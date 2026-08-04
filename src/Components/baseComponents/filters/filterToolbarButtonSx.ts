/** @format */

import { SxProps, Theme } from "@mui/material";

export const getFilterToolbarButtonSx = (isActive: boolean): SxProps<Theme> => ({
  height: 40,
  px: 3,
  mr: 1,
  borderRadius: 8,
  borderColor: isActive ? "#a5d060" : "#E2E8F0",
  color: "#0F172A",
  textTransform: "none",
  fontWeight: 700,
  bgcolor: isActive ? "#EEF7E3" : "transparent",
  "&:hover": {
    bgcolor: isActive ? "#E3F2D3" : "#F8FAFC",
  },
});
