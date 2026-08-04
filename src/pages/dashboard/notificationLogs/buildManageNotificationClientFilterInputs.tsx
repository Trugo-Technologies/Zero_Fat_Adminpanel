/** @format */

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { MessageFormatElement } from "react-intl";
import {
  DIETITIAN_GOAL_OPTIONS,
  GENDER_OPTIONS,
  SUBSCRIPTION_STATUS_EXPORT_OPTIONS,
} from "src/pages/clients-module/clients/clientFilterHelpers";
import {
  ALL_DIETITIAN_GOALS,
  ALL_GENDERS,
  ALL_PERIODS,
  ALL_STATUS,
  ALL_SUBSCRIPTION_STATUS,
  ManageNotificationClientFilters,
  ManageNotificationPeriod,
  PERIOD_OPTIONS,
  dateInputSx,
  selectSx,
} from "./manageNotificationClientFilterHelpers";

const clearButtonSx = {
  color: "text.secondary",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
  height: 36,
  px: 2,
  borderRadius: 2,
} as const;

type BuildManageNotificationClientFilterInputsArgs = {
  filters: ManageNotificationClientFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onStatusChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onDietitianGoalChange: (value: string) => void;
  onSubscriptionStatusChange: (value: string) => void;
  onPeriodChange: (value: ManageNotificationPeriod) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onClear: () => void;
};

export const buildManageNotificationClientFilterInputs = ({
  filters,
  messages,
  onStatusChange,
  onGenderChange,
  onDietitianGoalChange,
  onSubscriptionStatusChange,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
  onClear,
}: BuildManageNotificationClientFilterInputsArgs) => [
  <Box key="period">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["common.datePeriod"] as string}
    </Typography>
    <Select
      size="small"
      value={filters.period}
      onChange={(e) => onPeriodChange(e.target.value as ManageNotificationPeriod)}
      sx={{ ...selectSx, minWidth: 180 }}
    >
      <MenuItem value={ALL_PERIODS} sx={{ fontSize: 13 }}>
        {messages["common.all"] as string}
      </MenuItem>
      {PERIOD_OPTIONS.map(({ value, labelKey }) => (
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
      sx={{ ...selectSx, minWidth: 170 }}
    >
      <MenuItem value={ALL_SUBSCRIPTION_STATUS} sx={{ fontSize: 13 }}>
        {messages["common.all"] as string}
      </MenuItem>
      {SUBSCRIPTION_STATUS_EXPORT_OPTIONS.map(({ value, labelKey }) => (
        <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
          {messages[labelKey] as string}
        </MenuItem>
      ))}
    </Select>
  </Box>,
  <Box key="clear" sx={{ ml: "auto" }}>
    <Button onClick={onClear} sx={clearButtonSx}>
      Clear filters
    </Button>
  </Box>,
];
