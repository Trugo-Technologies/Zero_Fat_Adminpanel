/** @format */

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React from "react";
import { MessageFormatElement } from "react-intl";
import {
  ALL_EXPORT_PERIODS,
  DashboardAppliedFilters,
  DashboardReportPeriod,
  EXPORT_PERIOD_OPTIONS,
  dateInputSx,
  selectSx,
} from "./dashboardFilterHelpers";

const clearButtonSx = {
  color: "text.secondary",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
  height: 36,
  px: 2,
  borderRadius: 2,
} as const;

type BuildDashboardFilterInputsArgs = {
  filters: DashboardAppliedFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onPeriodChange: (value: DashboardReportPeriod) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onClear?: () => void;
};

export const buildDashboardFilterInputs = ({
  filters,
  messages,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
  onClear,
}: BuildDashboardFilterInputsArgs) => {
  const inputs = [
    <Box key="period">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.datePeriod"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.period}
        onChange={(e) => onPeriodChange(e.target.value as DashboardReportPeriod)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_EXPORT_PERIODS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {EXPORT_PERIOD_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
  ];

  if (filters.period === "custom") {
    inputs.push(
      <Box key="fromDate">
        <Typography
          sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
        >
          {messages["common.startDate"] as string}
        </Typography>
        <OutlinedInput
          type="date"
          size="small"
          value={filters.fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          sx={{ ...dateInputSx, width: 160 }}
        />
      </Box>,
      <Box key="toDate">
        <Typography
          sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
        >
          {messages["common.endDate"] as string}
        </Typography>
        <OutlinedInput
          type="date"
          size="small"
          value={filters.toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          sx={{ ...dateInputSx, width: 160 }}
        />
      </Box>
    );
  }

  if (onClear) {
    inputs.push(
      <Box key="actions" sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
        <Button onClick={onClear} sx={clearButtonSx}>
          Clear filters
        </Button>
      </Box>
    );
  }

  return inputs;
};
