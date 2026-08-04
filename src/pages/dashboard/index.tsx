/** @format */

import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Collapse, Zoom } from "@mui/material";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { getFilterToolbarButtonSx } from "src/Components/baseComponents/filters/filterToolbarButtonSx";
import ClientStatistics from "src/Components/dashboard/clientStatistics";
import KitchenMealCountStatistics from "src/Components/dashboard/kitchenMealCountStatistics";
import MealRatingStatistics from "src/Components/dashboard/mealRatingStatistics";
import NutriplanStatistics from "src/Components/dashboard/nutriplanStatistics";
import SubscriptionStatistics from "src/Components/dashboard/subscriptionStatistics";
import WorkoutStatistics from "src/Components/dashboard/workoutStatistics";
import { buildDashboardFilterInputs } from "./buildDashboardFilterInputs";
import {
  DashboardAppliedFilters,
  DashboardReportPeriod,
  buildDashboardReportQueryParams,
  createDefaultDashboardFilters,
} from "./dashboardFilterHelpers";

const DashboardPage = () => {
  const { messages } = useIntl();
  const [appliedFilters, setAppliedFilters] = useState<DashboardAppliedFilters>(
    createDefaultDashboardFilters
  );
  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);

  const reportParams = useMemo(
    () => buildDashboardReportQueryParams(appliedFilters),
    [appliedFilters]
  );

  const handlePeriodChange = (value: DashboardReportPeriod) => {
    setAppliedFilters((current) => ({
      ...current,
      period: value,
      fromDate: value === "custom" ? current.fromDate : "",
      toDate: value === "custom" ? current.toDate : "",
    }));
  };

  const handleFromDateChange = (value: string) => {
    setAppliedFilters((current) => ({ ...current, fromDate: value }));
  };

  const handleToDateChange = (value: string) => {
    setAppliedFilters((current) => ({ ...current, toDate: value }));
  };

  const handleClear = () => {
    setAppliedFilters(createDefaultDashboardFilters());
  };

  const advanceFiltersInputs = buildDashboardFilterInputs({
    filters: appliedFilters,
    messages,
    onPeriodChange: handlePeriodChange,
    onFromDateChange: handleFromDateChange,
    onToDateChange: handleToDateChange,
    onClear: handleClear,
  });

  const filterButton = (
    <Zoom in style={{ transitionDelay: "300ms" }}>
      <Button
        variant="outlined"
        onClick={() => setIsOpenAdvanceFilters((open) => !open)}
        startIcon={<FilterListIcon />}
        sx={getFilterToolbarButtonSx(isOpenAdvanceFilters)}
      >
        <IntlMessages id="common.filter" defaultMessage="Filters" />
      </Button>
    </Zoom>
  );

  const filtersPanel = (
    <Collapse in={isOpenAdvanceFilters} timeout="auto" unmountOnExit>
      <Box
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: 3,
          p: 3,
          mb: 4,
          bgcolor: "#fff",
          display: "flex",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {advanceFiltersInputs.map((input, index) => (
          <Box key={index}>{input}</Box>
        ))}
      </Box>
    </Collapse>
  );

  return (
    <Box>
      <ClientStatistics
        reportParams={reportParams}
        titleAction={filterButton}
        filtersPanel={filtersPanel}
      />
      <KitchenMealCountStatistics reportParams={reportParams} />
      <SubscriptionStatistics reportParams={reportParams} />
      <MealRatingStatistics />
      <WorkoutStatistics />
      <NutriplanStatistics />
    </Box>
  );
};

export default DashboardPage;
