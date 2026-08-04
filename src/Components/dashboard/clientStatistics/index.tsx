/** @format */

import { Box, Grid } from "@mui/material";
import { ReportColors } from "src/assets/colors/colorSet";
import { useIntl } from "react-intl";
import { useGetClientsReportSummaryQuery } from "src/pages/dashboard/services/api";
import { DashboardReportRequest } from "src/pages/dashboard/dashboardFilterHelpers";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import MinPieChart from "src/Components/dashboard/minPieChart";
import StatsCard from "src/Components/dashboard/StatsCard";
import StatisticsBaseTitle from "src/Components/dashboard/StatisticsBaseTitle";
import ClientPaymentSummary from "./ClientPaymentSummary";

interface ClientStatisticsProps {
  reportParams?: DashboardReportRequest;
  titleAction?: React.ReactNode;
  filtersPanel?: React.ReactNode;
}

const ClientStatistics = ({
  reportParams = {},
  titleAction,
  filtersPanel,
}: ClientStatisticsProps) => {
  const { messages } = useIntl();

  const { data, isLoading } = useGetClientsReportSummaryQuery({
    id: "",
    ...reportParams,
  });
  const summary = data?.data;

  return (
    <LoadingAndErrorWrapper isLoading={isLoading} errorMessage="">
      {summary && (
        <Box mb={8}>
          <StatisticsBaseTitle title="sidebar.clients" endAdornment={titleAction} />
          {filtersPanel}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatsCard
                data={{
                  color: ReportColors.green,
                  icon: "group",
                  value: summary.totalClients,
                  name: "dashboard.totalClients",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatsCard
                data={{
                  color: ReportColors.teal,
                  icon: "verified_user",
                  value: summary.activeClients,
                  name: "dashboard.activeClients",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatsCard
                data={{
                  color: ReportColors.orange,
                  icon: "person_off",
                  value: summary.inactiveClients,
                  name: "dashboard.inactiveClients",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatsCard
                data={{
                  color: ReportColors.red,
                  icon: "delete",
                  value: summary.deletedAccounts,
                  name: "dashboard.deletedAccounts",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatsCard
                data={{
                  color: ReportColors.blue,
                  icon: "man",
                  value: summary.byGender?.Male ?? 0,
                  name: "common.gender.Males",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatsCard
                data={{
                  color: ReportColors.pink,
                  icon: "woman",
                  value: summary.byGender?.Female ?? 0,
                  name: "common.gender.Females",
                }}
              />
            </Grid>

            <Grid item xs={12} md={5}>
              <ClientPaymentSummary byPaymentMethod={summary.byPaymentMethod} />
            </Grid>
            <Grid item xs={12} md={7}>
              <MinPieChart
                title="clinets.report.clientsByDietitianGoal"
                data={[
                  {
                    color: ReportColors.green,
                    title: String(messages["clients.dietitianGoal.GainWeight"]),
                    value: summary.byDietitianGoal?.GainWeight ?? 0,
                  },
                  {
                    color: ReportColors.red,
                    title: String(messages["clients.dietitianGoal.LoseWeight"]),
                    value: summary.byDietitianGoal?.LoseWeight ?? 0,
                  },
                  {
                    color: ReportColors.purple,
                    title: String(
                      messages["clients.dietitianGoal.BuildMuscles"]
                    ),
                    value: summary.byDietitianGoal?.BuildMuscles ?? 0,
                  },
                  {
                    color: ReportColors.teal,
                    title: String(messages["clients.dietitianGoal.LoseFat"]),
                    value: summary.byDietitianGoal?.LoseFat ?? 0,
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
