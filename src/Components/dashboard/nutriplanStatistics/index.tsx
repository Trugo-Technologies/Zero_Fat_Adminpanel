/** @format */

import PieChartIcon from "@mui/icons-material/PieChart";
import { Box, Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { ReportColors } from "src/assets/colors/colorSet";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { useGetNutriplanStatisticsQuery } from "src/pages/dashboard/services/api";
import MinBarChart from "src/Components/dashboard/minBarChart";
import StatisticsBaseTitle from "src/Components/dashboard/StatisticsBaseTitle";
import StatsCard from "src/Components/dashboard/StatsCard";

const NutriplanStatistics = () => {
  const { messages } = useIntl();
  const { data, isLoading } = useGetNutriplanStatisticsQuery({
    id: "",
  });
  const nutriplanStatistics = data?.data;
  return (
    <LoadingAndErrorWrapper errorMessage={""} isLoading={isLoading}>
      {nutriplanStatistics && (
        <Box mb={8}>
          <StatisticsBaseTitle title='nutriplan.title' />
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <MinBarChart
                title='nutriplan.mealByCuisineType'
                data={[
                  {
                    color: ReportColors.black,
                    name: String(messages["recipes.cuisine.Italian"]),
                    value: nutriplanStatistics.mealByCuisineType.Italian,
                  },
                  {
                    color: ReportColors.red,
                    name: String(messages["recipes.cuisine.Chinese"]),
                    value: nutriplanStatistics.mealByCuisineType.Chinese,
                  },

                  {
                    color: ReportColors.green,
                    name: String(messages["recipes.cuisine.Indian"]),
                    value: nutriplanStatistics.mealByCuisineType.Indian,
                  },

                  {
                    color: ReportColors.blue,
                    name: String(messages["recipes.cuisine.Mediterranean"]),
                    value: nutriplanStatistics.mealByCuisineType.Mediterranean,
                  },
                  {
                    color: ReportColors.teal,
                    name: String(messages["recipes.cuisine.MiddleEastern"]),
                    value: nutriplanStatistics.mealByCuisineType.MiddleEastern,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <StatsCard
                    data={{
                      color: ReportColors.darkBlue,
                      icon: "dining",
                      value: nutriplanStatistics.meals,
                      name: "sidebar.meals",
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatsCard
                    data={{
                      color: ReportColors.red,
                      icon: <PieChartIcon />,
                      value: nutriplanStatistics.mealPlans,
                      name: "sidebar.mealPlans",
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatsCard
                    data={{
                      color: ReportColors.teal,
                      icon: "egg",
                      value: nutriplanStatistics.ingredients,
                      name: "sidebar.ingredients",
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <StatsCard
                    data={{
                      color: ReportColors.lightBlue,
                      icon: "fastfood",
                      value: nutriplanStatistics.menus,
                      name: "sidebar.menus",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </LoadingAndErrorWrapper>
  );
};

export default NutriplanStatistics;
