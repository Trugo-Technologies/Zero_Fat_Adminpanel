/** @format */

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React from "react";
import { MessageFormatElement } from "react-intl";
import {
  ALL_CLIENT_SUBSCRIPTION_EXPORT_TYPE,
  ALL_EXPORT_PERIODS,
  ALL_EXPORT_SUBSCRIPTION_STATUS,
  ALL_PAYMENT_STATUS,
  CLIENT_SUBSCRIPTION_EXPORT_TYPE_OPTIONS,
  ClientSubscriptionExportFilters,
  ClientSubscriptionExportPeriod,
  ClientSubscriptionExportType,
  EXPORT_PERIOD_OPTIONS,
  EXPORT_SUBSCRIPTION_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
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

const disabledFieldSx = {
  opacity: 0.55,
};

type BuildClientSubscriptionExportFilterInputsArgs = {
  filters: ClientSubscriptionExportFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onExportTypeChange: (value: ClientSubscriptionExportType) => void;
  onPaymentStatusChange: (value: string) => void;
  onSubscriptionStatusChange: (value: string) => void;
  onPeriodChange: (value: ClientSubscriptionExportPeriod) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onClear: () => void;
  trailingActions?: React.ReactNode;
};

export const buildClientSubscriptionExportFilterInputs = ({
  filters,
  messages,
  onExportTypeChange,
  onPaymentStatusChange,
  onSubscriptionStatusChange,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
  onClear,
  trailingActions,
}: BuildClientSubscriptionExportFilterInputsArgs) => {
  const filtersDisabled = !filters.exportType;

  const inputs = [
    <Box key="exportType">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["clientSubscriptions.export.type"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.exportType}
        onChange={(e) =>
          onExportTypeChange(e.target.value as ClientSubscriptionExportType)
        }
        displayEmpty
        sx={{ ...selectSx, minWidth: 200 }}
      >
        <MenuItem value={ALL_CLIENT_SUBSCRIPTION_EXPORT_TYPE} sx={{ fontSize: 13 }}>
          {messages["clientSubscriptions.export.type.placeholder"] as string}
        </MenuItem>
        {CLIENT_SUBSCRIPTION_EXPORT_TYPE_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="period" sx={filtersDisabled ? disabledFieldSx : undefined}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["clientSubscriptions.filter.recordedPeriod"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.period}
        disabled={filtersDisabled}
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
          <Box
            key="fromDate"
            sx={filtersDisabled ? disabledFieldSx : undefined}>
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
              disabled={filtersDisabled}
              value={filters.fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              sx={dateInputSx}
            />
          </Box>,
          <Box key="toDate" sx={filtersDisabled ? disabledFieldSx : undefined}>
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
              disabled={filtersDisabled}
              value={filters.toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              sx={dateInputSx}
            />
          </Box>,
        ]
      : []),
    <Box key="paymentStatus" sx={filtersDisabled ? disabledFieldSx : undefined}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.paymentStatus"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.paymentStatus}
        disabled={filtersDisabled}
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
    <Box
      key="subscriptionStatus"
      sx={filtersDisabled ? disabledFieldSx : undefined}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["clients.subscriptionStatus"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.subscriptionStatus}
        disabled={filtersDisabled}
        onChange={(e) => onSubscriptionStatusChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 170 }}
      >
        <MenuItem value={ALL_EXPORT_SUBSCRIPTION_STATUS} sx={{ fontSize: 13 }}>
          {messages["clientSubscriptions.filter.allStatuses"] as string}
        </MenuItem>
        {EXPORT_SUBSCRIPTION_STATUS_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="actions" sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
      <Button onClick={onClear} sx={clearButtonSx}>
        {messages["clientAccountAccess.clearFilters"] as string}
      </Button>
      {trailingActions}
    </Box>,
  ];

  return inputs;
};
