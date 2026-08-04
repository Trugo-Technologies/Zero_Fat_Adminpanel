/** @format */

import { Box, Grid } from "@mui/material";
import { ReportColors } from "src/assets/colors/colorSet";
import { useIntl } from "react-intl";
import { useGetKitchenMealCountSummaryQuery } from "src/pages/dashboard/services/api";
import { DashboardReportRequest } from "src/pages/dashboard/dashboardFilterHelpers";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import StatsCard from "src/Components/dashboard/StatsCard";
import StatisticsBaseTitle from "src/Components/dashboard/StatisticsBaseTitle";
import { getKitchenSummaryLabel } from "./kitchenSummaryLabelHelpers";

interface KitchenMealCountStatisticsProps {
  reportParams?: DashboardReportRequest;
}

const METADATA_KEYS = new Set(["period", "fromDate", "toDate"]);

const KitchenMealCountStatistics = ({
  reportParams = {},
}: KitchenMealCountStatisticsProps) => {
  const { messages } = useIntl();
  const { data, isLoading } = useGetKitchenMealCountSummaryQuery({
    id: "",
    ...reportParams,
  });

  const summary = data?.data;

  const renderStats = () => {
    if (!summary) return null;

    const cards = [];
    let i = 0;
    const colors = [
      ReportColors.green,
      ReportColors.blue,
      ReportColors.orange,
      ReportColors.red,
      ReportColors.teal,
      ReportColors.purple,
      ReportColors.pink,
    ];

    for (const [key, value] of Object.entries(summary)) {
      if (METADATA_KEYS.has(key) || typeof value !== "number") {
        continue;
      }

      cards.push(
        <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
          <StatsCard
            data={{
              color: colors[i % colors.length],
              icon: "restaurant",
              value,
              name: `dashboard.kitchen.${key}`,
              label: getKitchenSummaryLabel(key, messages),
            }}
          />
        </Grid>
      );
      i += 1;
    }

    return cards.length > 0 ? (
      <Grid container spacing={4}>
        {cards}
      </Grid>
    ) : (
      <Box sx={{ color: "text.secondary", fontSize: 14 }}>
        {messages["dashboard.kitchen.noData"] as string}
      </Box>
    );
  };

  return (
    <LoadingAndErrorWrapper isLoading={isLoading} errorMessage="">
      {summary && (
        <Box mb={8}>
          <StatisticsBaseTitle title="sidebar.kitchen.mealCount" />
          {renderStats()}
        </Box>
      )}
    </LoadingAndErrorWrapper>
  );
};

export default KitchenMealCountStatistics;
