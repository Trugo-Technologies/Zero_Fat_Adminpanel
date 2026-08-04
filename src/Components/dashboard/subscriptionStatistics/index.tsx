/** @format */

import { useMemo } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ReportColors } from "src/assets/colors/colorSet";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import MinPieChart from "src/Components/dashboard/minPieChart";
import StatisticsBaseTitle from "src/Components/dashboard/StatisticsBaseTitle";
import StatsCard from "src/Components/dashboard/StatsCard";
import { useGetClientsReportSummaryQuery } from "src/pages/dashboard/services/api";
import { DashboardReportRequest } from "src/pages/dashboard/dashboardFilterHelpers";

const statusItems = [
  { key: "Active", labelKey: "dashboard.activeSubscriptions", color: ReportColors.green },
  { key: "Pending", labelKey: "dashboard.pendingSubscriptions", color: ReportColors.orange },
  { key: "Expired", labelKey: "dashboard.expiredSubscriptions", color: ReportColors.red },
] as const;

const mealPlanChartColors = [
  ReportColors.red,
  ReportColors.teal,
  ReportColors.purple,
  ReportColors.orange,
  ReportColors.green,
  ReportColors.blue,
  ReportColors.pink,
];

const SubscriptionStatistics = ({
  reportParams = {},
}: {
  reportParams?: DashboardReportRequest;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { messages } = useIntl();
  const primaryGreen = theme.palette.primary.main;

  const { data, isLoading } = useGetClientsReportSummaryQuery({
    id: "",
    ...reportParams,
  });
  const summary = data?.data;

  const byStatus = summary?.bySubscriptionStatus ?? {};
  const mealPlanChart = useMemo(
    () =>
      Object.entries(summary?.byMealPlan ?? {}).map(([title, value], index) => ({
        color: mealPlanChartColors[index % mealPlanChartColors.length],
        title,
        value,
      })),
    [summary?.byMealPlan]
  );

  return (
    <LoadingAndErrorWrapper isLoading={isLoading} errorMessage="">
      {summary && (
        <Box mb={8}>
          <StatisticsBaseTitle
            title="sidebar.clientSubscriptions"
            endAdornment={
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() =>
                  navigate("/clientsManagement/clientSubscriptions")
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: primaryGreen,
                }}
              >
                View all subscriptions
              </Button>
            }
          />

          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                data={{
                  color: ReportColors.orange,
                  icon: "subscriptions",
                  value: summary.totalSubscriptions,
                  name: "dashboard.subscriptions",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                data={{
                  color: ReportColors.green,
                  icon: "verified",
                  value: summary.activeSubscriptions,
                  name: "dashboard.activeSubscriptions",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                data={{
                  color: ReportColors.teal,
                  icon: "autorenew",
                  value: summary.renewSubscriptions,
                  name: "dashboard.renewSubscriptions",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                data={{
                  color: ReportColors.purple,
                  icon: "payments",
                  value: Number(
                    summary.totalSubscriptionRevenue ?? 0
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }),
                  name: "dashboard.totalSubscriptionRevenue",
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #E2E8F0",
                  bgcolor: "#fff",
                  height: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    mb: 2,
                  }}
                >
                  By status
                </Typography>
                <Grid container spacing={2}>
                  {statusItems.map((item) => (
                    <Grid item xs={6} key={item.key}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid #E2E8F0",
                          bgcolor: alpha(item.color, 0.06),
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: "#0F172A",
                          }}
                        >
                          {byStatus[item.key] ?? 0}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
                        >
                          {String(messages[item.labelKey] ?? item.key)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <MinPieChart
                title="clinets.report.subscriptionsByMealPlan"
                data={mealPlanChart}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </LoadingAndErrorWrapper>
  );
};

export default SubscriptionStatistics;
