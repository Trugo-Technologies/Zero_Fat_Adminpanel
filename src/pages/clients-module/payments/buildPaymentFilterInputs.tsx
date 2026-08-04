/** @format */

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React from "react";
import { MessageFormatElement } from "react-intl";
import {
  ALL_PAYMENT_EXPORT_PERIODS,
  ALL_PAYMENT_GATEWAYS,
  ALL_PAYMENT_METHODS,
  ALL_PAYMENT_STATUS,
  PAYMENT_EXPORT_PERIOD_OPTIONS,
  PAYMENT_GATEWAY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  PaymentAppliedFilters,
  PaymentExportPeriod,
  dateInputSx,
  numberInputSx,
  selectSx,
} from "./paymentFilterHelpers";

const clearButtonSx = {
  color: "text.secondary",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
  height: 36,
  px: 2,
  borderRadius: 2,
} as const;

type BuildPaymentFilterInputsArgs = {
  filters: PaymentAppliedFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onPaymentGatewayChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
  onPeriodChange: (value: PaymentExportPeriod) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onAmountMinChange: (value: string) => void;
  onAmountMaxChange: (value: string) => void;
  onClear?: () => void;
  trailingActions?: React.ReactNode;
};

export const buildPaymentFilterInputs = ({
  filters,
  messages,
  onPaymentGatewayChange,
  onPaymentMethodChange,
  onPaymentStatusChange,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
  onAmountMinChange,
  onAmountMaxChange,
  onClear,
  trailingActions,
}: BuildPaymentFilterInputsArgs) => {
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
        onChange={(e) => onPeriodChange(e.target.value as PaymentExportPeriod)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_PAYMENT_EXPORT_PERIODS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {PAYMENT_EXPORT_PERIOD_OPTIONS.map(({ value, labelKey }) => (
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
    <Box key="amountMin">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.export.minAmount"] as string}
      </Typography>
      <OutlinedInput
        type="number"
        size="small"
        value={filters.amountMin}
        onChange={(e) => onAmountMinChange(e.target.value)}
        sx={numberInputSx}
      />
    </Box>,
    <Box key="amountMax">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.export.maxAmount"] as string}
      </Typography>
      <OutlinedInput
        type="number"
        size="small"
        value={filters.amountMax}
        onChange={(e) => onAmountMaxChange(e.target.value)}
        sx={numberInputSx}
      />
    </Box>,
    <Box key="paymentGateway">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.paymentGateway"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.paymentGateway}
        onChange={(e) => onPaymentGatewayChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_PAYMENT_GATEWAYS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {PAYMENT_GATEWAY_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="paymentMethod">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.paymentMethod"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.paymentMethod}
        onChange={(e) => onPaymentMethodChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_PAYMENT_METHODS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {PAYMENT_METHOD_OPTIONS.map(({ value, labelKey }) => (
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
          {messages["common.all"] as string}
        </MenuItem>
        {PAYMENT_STATUS_OPTIONS.map(({ value, labelKey }) => (
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
          <Button onClick={onClear} sx={clearButtonSx}>
            Clear filters
          </Button>
        )}
        {trailingActions}
      </Box>
    );
  }

  return inputs;
};
