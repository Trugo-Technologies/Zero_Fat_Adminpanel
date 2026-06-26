/** @format */

import { Box, Grid } from "@mui/material";
import { ReportColors } from "src/assets/colors/colorSet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { useIntl } from "react-intl";
import { useGetClientStatisticsQuery } from "src/pages/dashboard/services/api";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import InfoWidget from "src/Components/dashboard/InfoWidget";
import MinPieChart from "src/Components/dashboard/minPieChart";
import StatsCard from "src/Components/dashboard/StatsCard";
import StatisticsBaseTitle from "src/Components/dashboard/StatisticsBaseTitle";
const ClientStatistics = () => {
  const { messages } = useIntl();

  const { data, isLoading } = useGetClientStatisticsQuery({
    id: "",
  });
  const clientStatistics = data?.data;
  return (
    <LoadingAndErrorWrapper isLoading={isLoading} errorMessage=''>
      {clientStatistics && (
        <Box mb={8}>
          <StatisticsBaseTitle title='sidebar.clients' />
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <StatsCard
                data={{
                  color: ReportColors.green,
                  icon: "group",
                  value: clientStatistics.clients,
                  name: "sidebar.clients",
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <StatsCard
                data={{
                  color: ReportColors.blue,
                  icon: "man",
                  value: clientStatistics.maleCount,
                  name: "common.gender.Males",
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <StatsCard
                data={{
                  color: ReportColors.pink,
                  icon: "woman",
                  value: clientStatistics.femaleCount,
                  name: "common.gender.Females",
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <StatsCard
                data={{
                  color: ReportColors.orange,
                  icon: <CurrencyExchangeIcon />,
                  value: clientStatistics.subscriptions,
                  name: "dashboard.subscriptions",
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <InfoWidget
                data={{
                  count: clientStatistics.totalPaymentsLastMonth,
                  icon: <TrendingUpIcon fontSize='large' />,
                  title: "report.totalPaymentsLastMonth",
                  color: ReportColors.teal,
                }}
              />
            </Grid>

            <Grid item xs={4.5}>
              <MinPieChart
                title='clinets.report.clientsByDietitianGoal'
                data={[
                  {
                    color: ReportColors.green,
                    title: String(messages["clients.dietitianGoal.GainWeight"]),
                    value: clientStatistics.clientsByDietitianGoal.GainWeight,
                  },
                  {
                    color: ReportColors.red,
                    title: String(messages["clients.dietitianGoal.LoseWeight"]),
                    value: clientStatistics.clientsByDietitianGoal.LoseWeight,
                  },
                  {
                    color: ReportColors.purple,
                    title: String(messages["clients.dietitianGoal.BuildMuscles"]),
                    value: clientStatistics.clientsByDietitianGoal.BuildMuscles,
                  },
                  {
                    color: ReportColors.teal,
                    title: String(messages["clients.dietitianGoal.LoseFat"]),
                    value: clientStatistics.clientsByDietitianGoal.LoseFat,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={4.5}>
              <MinPieChart
                title='clinets.report.subscriptionsByType'
                data={[
                  {
                    color: ReportColors.teal,
                    title: String(
                      messages["subscriptionPlans.subscriptionType.OneWeek"]
                    ),
                    value: clientStatistics.subscriptionsByType.OneWeek,
                  },
                  {
                    color: ReportColors.purple,
                    title: String(
                      messages["subscriptionPlans.subscriptionType.OneMonth"]
                    ),
                    value: clientStatistics.subscriptionsByType.OneMonth,
                  },
                  {
                    color: ReportColors.orange,
                    title: String(
                      messages["subscriptionPlans.subscriptionType.ThreeMonths"]
                    ),
                    value: clientStatistics.subscriptionsByType.ThreeMonths,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </LoadingAndErrorWrapper>
  );
};

export default ClientStatistics;
