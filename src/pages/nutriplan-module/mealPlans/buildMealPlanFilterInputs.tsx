/** @format */

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React from "react";
import { MessageFormatElement } from "react-intl";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import {
  ALL_DATE_PERIODS,
  ALL_DIETITIAN_GOALS,
  ALL_MEAL_PLANS,
  ALL_STATUS,
  DATE_PERIOD_OPTIONS,
  DatePeriod,
  DIETITIAN_GOAL_OPTIONS,
  MealPlanExportFilters,
  MealPlanListFilters,
  dateInputSx,
  selectSx,
} from "./mealPlanFilterHelpers";

const clearButtonSx = {
  color: "text.secondary",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
  height: 36,
  px: 2,
  borderRadius: 2,
} as const;

type BuildMealPlanListFilterInputsArgs = {
  filters: MealPlanListFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  onStatusChange: (value: string) => void;
  onClear: () => void;
};

export const buildMealPlanListFilterInputs = ({
  filters,
  messages,
  onStatusChange,
  onClear,
}: BuildMealPlanListFilterInputsArgs) => [
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
  <Box key="clear" sx={{ ml: "auto" }}>
    <Button onClick={onClear} sx={clearButtonSx}>
      Clear filters
    </Button>
  </Box>,
];

type BuildMealPlanExportFilterInputsArgs = {
  filters: MealPlanExportFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  mealPlans: IMealPlans[];
  onDatePeriodChange: (value: DatePeriod) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onMealPlanChange: (value: string) => void;
  onDietitianGoalChange: (value: string) => void;
  onClear: () => void;
  trailingActions?: React.ReactNode;
};

export const buildMealPlanExportFilterInputs = ({
  filters,
  messages,
  mealPlans,
  onDatePeriodChange,
  onStartDateChange,
  onEndDateChange,
  onMealPlanChange,
  onDietitianGoalChange,
  onClear,
  trailingActions,
}: BuildMealPlanExportFilterInputsArgs) => {
  const inputs = [
    <Box key="datePeriod">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.datePeriod"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.datePeriod}
        onChange={(e) => onDatePeriodChange(e.target.value as DatePeriod)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_DATE_PERIODS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DATE_PERIOD_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    ...(filters.datePeriod === "custom"
      ? [
          <Box key="startDate">
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
              value={filters.startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              sx={dateInputSx}
            />
          </Box>,
          <Box key="endDate">
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
              value={filters.endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              sx={dateInputSx}
            />
          </Box>,
        ]
      : []),
    <Box key="mealPlan">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["mealPlans.name"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.mealPlanId}
        onChange={(e) => onMealPlanChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 220 }}
      >
        <MenuItem value={ALL_MEAL_PLANS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {mealPlans.map((plan) => (
          <MenuItem key={plan.id} value={plan.id} sx={{ fontSize: 13 }}>
            {getValueBasedOnCurrentLanguage(plan.nameAr, plan.nameEn)}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="defaultDietitianGoal">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["mealPlans.defaultDietitianGoal"] as string}
      </Typography>
      <Select
        size="small"
        value={filters.defaultDietitianGoal}
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
  ];

  inputs.push(
    <Box key="actions" sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
      <Button onClick={onClear} sx={clearButtonSx}>
        Clear filters
      </Button>
      {trailingActions}
    </Box>
  );

  return inputs;
};
