/** @format */

import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  label: ReactNode;
  value: ReactNode;
};

const DataField = ({ label, value }: Props) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      py: 1.25,
    }}
  >
    <Typography
      sx={{
        color: "text.secondary",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        width: 140,
        flexShrink: 0,
        mt: 0.25,
      }}
    >
      {label}
    </Typography>
    <Box sx={{ flexGrow: 1 }}>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14,
            color: "text.primary",
          }}
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  </Box>
);

export default DataField;
