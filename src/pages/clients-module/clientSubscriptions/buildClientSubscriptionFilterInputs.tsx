/** @format */

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React from "react";
import { MessageFormatElement } from "react-intl";
import {
  ALL_EXPORT_PERIODS,
  ALL_PAYMENT_STATUS,
  ALL_SUBSCRIPTION_STATUS,
  ALL_SUBSCRIPTION_TYPES,
  ClientSubscriptionAppliedFilters,
  ClientSubscriptionExportPeriod,
  EXPORT_PERIOD_OPTIONS,
  LIST_SUBSCRIPTION_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  SUBSCRIPTION_TYPE_OPTIONS,
  dateInputSx,
  selectSx,
} from "./clientSubscriptionFilterHelpers";

const clearButtonSx = {
  color: "text.secondary",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
  height: 36,
  px: 2,
  borderRadius: 2,
} as const;

type BuildClientSubscriptionFilterInputsArgs = {
  filters: ClientSubscriptionAppliedFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onPeriodChange: (value: ClientSubscriptionExportPeriod) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onStartDateFromChange: (value: string) => void;
  onStartDateToChange: (value: string) => void;
  onEndDateFromChange: (value: string) => void;
  onEndDateToChange: (value: string) => void;
  onSubscriptionTypeChange: (value: string) => void;
  onSubscriptionStatusChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
  onClear: () => void;
};

export const buildClientSubscriptionFilterInputs = ({
  filters,
  messages,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
  onStartDateFromChange,
  onStartDateToChange,
  onEndDateFromChange,
  onEndDateToChange,
  onSubscriptionTypeChange,
  onSubscriptionStatusChange,
  onPaymentStatusChange,
  onClear,
}: BuildClientSubscriptionFilterInputsArgs) => [
  <Box key="period">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["clientSubscriptions.filter.recordedPeriod"] as string}
    </Typography>
    <Select
      size="small"
      value={filters.period}
      onChange={(e) =>
        onPeriodChange(e.target.value as ClientSubscriptionExportPeriod)
      }
      sx={{ ...selectSx, minWidth: 180 }}
    >
      <MenuItem value={ALL_EXPORT_PERIODS} sx={{ fontSize: 13 }}>
        {messages["clientSubscriptions.filter.allTime"] as string}
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
            {messages["clientSubscriptions.filter.recordedFrom"] as string}
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
            {messages["clientSubscriptions.filter.recordedTo"] as string}
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
  <Box key="startDateFrom">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["clientSubscriptions.filter.startDateFrom"] as string}
    </Typography>
    <OutlinedInput
      type="date"
      size="small"
      value={filters.startDateFrom}
      onChange={(e) => onStartDateFromChange(e.target.value)}
      sx={dateInputSx}
    />
  </Box>,
  <Box key="startDateTo">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["clientSubscriptions.filter.startDateTo"] as string}
    </Typography>
    <OutlinedInput
      type="date"
      size="small"
      value={filters.startDateTo}
      onChange={(e) => onStartDateToChange(e.target.value)}
      sx={dateInputSx}
    />
  </Box>,
  <Box key="endDateFrom">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["clientSubscriptions.filter.endDateFrom"] as string}
    </Typography>
    <OutlinedInput
      type="date"
      size="small"
      value={filters.endDateFrom}
      onChange={(e) => onEndDateFromChange(e.target.value)}
      sx={dateInputSx}
    />
  </Box>,
  <Box key="endDateTo">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["clientSubscriptions.filter.endDateTo"] as string}
    </Typography>
    <OutlinedInput
      type="date"
      size="small"
      value={filters.endDateTo}
      onChange={(e) => onEndDateToChange(e.target.value)}
      sx={dateInputSx}
    />
  </Box>,
  <Box key="subscriptionType">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["subscriptionPlans.subscriptionType"] as string}
    </Typography>
    <Select
      size="small"
      value={filters.subscriptionType}
      onChange={(e) => onSubscriptionTypeChange(e.target.value)}
      sx={{ ...selectSx, minWidth: 170 }}
    >
      <MenuItem value={ALL_SUBSCRIPTION_TYPES} sx={{ fontSize: 13 }}>
        {messages["clientSubscriptions.filter.allTypes"] as string}
      </MenuItem>
      {SUBSCRIPTION_TYPE_OPTIONS.map(({ value, labelKey }) => (
        <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
          {messages[labelKey] as string}
        </MenuItem>
      ))}
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
        {messages["clientSubscriptions.filter.allStatuses"] as string}
      </MenuItem>
      {LIST_SUBSCRIPTION_STATUS_OPTIONS.map(({ value, labelKey }) => (
        <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
          {messages[labelKey] as string}
        </MenuItem>
      ))}
    </Select>
  </Box>,
  <Box key="paymentStatus">
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
    >
      {messages["payments.paymentStatus"] as string}
    </Typography>
    <Select
      size="small"
      value={filters.paymentStatus}
      onChange={(e) => onPaymentStatusChange(e.target.value)}
      sx={{ ...selectSx, minWidth: 170 }}
    >
      <MenuItem value={ALL_PAYMENT_STATUS} sx={{ fontSize: 13 }}>
        {messages["clientSubscriptions.filter.allPaymentStatuses"] as string}
      </MenuItem>
      {PAYMENT_STATUS_OPTIONS.map(({ value, labelKey }) => (
        <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
          {messages[labelKey] as string}
        </MenuItem>
      ))}
    </Select>
  </Box>,
  <Box key="clear" sx={{ ml: "auto" }}>
    <Button onClick={onClear} sx={clearButtonSx}>
      {messages["clientAccountAccess.clearFilters"] as string}
    </Button>
  </Box>,
];
