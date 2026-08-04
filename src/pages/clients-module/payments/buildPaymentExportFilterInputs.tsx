/** @format */

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React from "react";
import { MessageFormatElement } from "react-intl";
import {
  ALL_IS_DISCOUNT_APPLIED,
  ALL_PAYMENT_EXPORT_PERIODS,
  ALL_PAYMENT_GATEWAYS,
  ALL_PAYMENT_METHODS,
  ALL_PAYMENT_STATUS,
  PAYMENT_EXPORT_PERIOD_OPTIONS,
  PAYMENT_GATEWAY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  PaymentExportFilters,
  PaymentExportPeriod,
  dateInputSx,
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

const numberInputSx = {
  ...dateInputSx,
  minWidth: 120,
};

type BuildPaymentExportFilterInputsArgs = {
  filters: PaymentExportFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onPaymentStatusChange: (value: string) => void;
  onPeriodChange: (value: PaymentExportPeriod) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
  onIsDiscountAppliedChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onPaymentGatewayChange: (value: string) => void;
  onClear: () => void;
  trailingActions?: React.ReactNode;
};

export const buildPaymentExportFilterInputs = ({
  filters,
  messages,
  onPaymentStatusChange,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
  onMinAmountChange,
  onMaxAmountChange,
  onIsDiscountAppliedChange,
  onPaymentMethodChange,
  onPaymentGatewayChange,
  onClear,
  trailingActions,
}: BuildPaymentExportFilterInputsArgs) => {
  const inputs = [
    <Box key="minAmount">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.export.minAmount"] as string}
      </Typography>
      <OutlinedInput
        type="number"
        size="small"
        value={filters.minAmount}
        onChange={(e) => onMinAmountChange(e.target.value)}
        sx={numberInputSx}
        inputProps={{ min: 0 }}
      />
    </Box>,
    <Box key="maxAmount">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.export.maxAmount"] as string}
      </Typography>
      <OutlinedInput
        type="number"
        size="small"
        value={filters.maxAmount}
        onChange={(e) => onMaxAmountChange(e.target.value)}
        sx={numberInputSx}
        inputProps={{ min: 0 }}
      />
    </Box>,
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
    <Box key="isDiscountApplied">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.export.isDiscountApplied"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.isDiscountApplied}
        onChange={(e) => onIsDiscountAppliedChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 160 }}
      >
        <MenuItem value={ALL_IS_DISCOUNT_APPLIED} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value="true" sx={{ fontSize: 13 }}>
          {messages["common.yes"] as string}
        </MenuItem>
        <MenuItem value="false" sx={{ fontSize: 13 }}>
          {messages["common.no"] as string}
        </MenuItem>
      </Select>
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
    <Box key="actions" sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
      <Button onClick={onClear} sx={clearButtonSx}>
        Clear filters
      </Button>
      {trailingActions}
    </Box>,
  ];

  return inputs;
};
