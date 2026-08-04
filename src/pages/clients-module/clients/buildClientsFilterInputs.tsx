/** @format */

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React from "react";
import { MessageFormatElement } from "react-intl";
import {
  ALL_DIETITIAN_GOALS,
  ALL_EXPORT_PERIODS,
  ALL_GENDERS,
  ALL_STATUS,
  ALL_SUBSCRIPTION_STATUS,
  ClientAppliedFilters,
  ClientExportPeriod,
  DIETITIAN_GOAL_OPTIONS,
  EXPORT_PERIOD_OPTIONS,
  GENDER_OPTIONS,
  LIST_SUBSCRIPTION_STATUS_OPTIONS,
  dateInputSx,
  selectSx,
} from "./clientFilterHelpers";

type BuildClientsFilterInputsArgs = {
  filters: ClientAppliedFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onGenderChange: (value: string) => void;
  onDietitianGoalChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSubscriptionStatusChange: (value: string) => void;
  onPeriodChange: (value: ClientExportPeriod) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onClear?: () => void;
  trailingActions?: React.ReactNode;
};

export const buildClientsFilterInputs = ({
  filters,
  messages,
  onGenderChange,
  onDietitianGoalChange,
  onStatusChange,
  onSubscriptionStatusChange,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
  onClear,
  trailingActions,
}: BuildClientsFilterInputsArgs) => {
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
        onChange={(e) => onPeriodChange(e.target.value as ClientExportPeriod)}
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
    ...(filters.period === "custom"
      ? [
          <Box key="fromDate">
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "text.secondary",
                mb: 1,
              }}
            >
              {messages["common.startDate"] as string}
            </Typography>
            <OutlinedInput
              type="date"
              size="small"
              value={filters.fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              sx={dateInputSx}
            />
          </Box>,
          <Box key="toDate">
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "text.secondary",
                mb: 1,
              }}
            >
              {messages["common.endDate"] as string}
            </Typography>
            <OutlinedInput
              type="date"
              size="small"
              value={filters.toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              sx={dateInputSx}
            />
          </Box>,
        ]
      : []),
    <Box key="gender">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.gender"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.gender}
        onChange={(e) => onGenderChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_GENDERS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {GENDER_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="dietitianGoal">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["clinets.dietitianGoal"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.dietitianGoal}
        onChange={(e) => onDietitianGoalChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_DIETITIAN_GOALS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DIETITIAN_GOAL_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="status">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.status"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.status}
        onChange={(e) => onStatusChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value="Active" sx={{ fontSize: 13 }}>
          {messages["columns.active"] as string}
        </MenuItem>
        <MenuItem value="Inactive" sx={{ fontSize: 13 }}>
          {messages["columns.inactive"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key="subscriptionStatus">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["clients.subscriptionStatus"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.subscriptionStatus}
        onChange={(e) => onSubscriptionStatusChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_SUBSCRIPTION_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {LIST_SUBSCRIPTION_STATUS_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
  ];

  if (onClear || trailingActions) {
    inputs.push(
      <Box key="actions" sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
        {onClear && (
          <Button
            onClick={onClear}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
              height: 36,
              px: 2,
              borderRadius: 2,
            }}
          >
            Clear filters
          </Button>
        )}
        {trailingActions}
      </Box>
    );
  }

  return inputs;
};
