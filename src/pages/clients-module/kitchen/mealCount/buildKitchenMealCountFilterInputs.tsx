/** @format */

import { Box, Button, OutlinedInput, Typography } from "@mui/material";
import { MessageFormatElement } from "react-intl";
import {
  KitchenMealCountAppliedFilters,
  dateInputSx,
} from "./kitchenMealCountFilterHelpers";

const clearButtonSx = {
  color: "text.secondary",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
  height: 36,
  px: 2,
  borderRadius: 2,
} as const;

type BuildKitchenMealCountFilterInputsArgs = {
  filters: KitchenMealCountAppliedFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onDateChange: (value: string) => void;
  onClear: () => void;
};

export const buildKitchenMealCountFilterInputs = ({
  filters,
  messages,
  onDateChange,
  onClear,
}: BuildKitchenMealCountFilterInputsArgs) => [
  <Box key="date">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["dailySelections.date"] as string}
    </Typography>
    <OutlinedInput
      type="date"
      size="small"
      value={filters.date}
      onChange={(e) => onDateChange(e.target.value)}
      sx={dateInputSx}
    />
  </Box>,
  <Box key="clear" sx={{ ml: "auto" }}>
    <Button onClick={onClear} sx={clearButtonSx}>
      Clear filters
    </Button>
  </Box>,
];
