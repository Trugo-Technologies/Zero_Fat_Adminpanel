/** @format */

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Grid, Box } from "@mui/material";
import { useIntl } from "react-intl";
import { ReportColors } from "src/assets/colors/colorSet";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { useGetWorkoutStatisticsQuery } from "src/pages/dashboard/services/api";
import MinPieChart from "src/Components/dashboard/minPieChart";
import StatisticsBaseTitle from "src/Components/dashboard/StatisticsBaseTitle";
import StatsCard from "src/Components/dashboard/StatsCard";
const WorkoutStatistics = () => {
  const { messages } = useIntl();
  const { data, isLoading } = useGetWorkoutStatisticsQuery({
    id: "",
  });
  const workoutStatistics = data?.data;
  return (
    <LoadingAndErrorWrapper errorMessage={""} isLoading={isLoading}>
      {workoutStatistics && (
        <Box mb={8}>
          <StatisticsBaseTitle title='sidebar.workouts' />
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <StatsCard
                data={{
                  color: ReportColors.purple,
                  icon: <FitnessCenterIcon />,
                  value: workoutStatistics.workouts,
                  name: "sidebar.workouts",
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <StatsCard
                data={{
                  color: ReportColors.lightBlue,
                  icon: "people",
                  value: workoutStatistics.trainers,
                  name: "sidebar.trains",
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <StatsCard
                data={{
                  color: ReportColors.orange,
                  icon: "pendingActions",
                  value: workoutStatistics.plans,
                  name: "sidebar.workoutPlan",
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <StatsCard
                data={{
                  color: ReportColors.green,
                  icon: "task",
                  value: workoutStatistics.exercsises,
                  name: "sidebar.exercises",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <MinPieChart
                title='workout.plansByLevel'
                data={[
                  {
                    color: ReportColors.red,
                    title: String(messages["workouts.level.Beginner"]),
                    value: workoutStatistics.plansByLevel.Beginner,
                  },
                  {
                    color: ReportColors.blue,
                    title: String(messages["workouts.level.Intermediate"]),
                    value: workoutStatistics.plansByLevel.Intermediate,
                  },
                  {
                    color: ReportColors.purple,
                    title: String(messages["workouts.level.Advanced"]),
                    value: workoutStatistics.plansByLevel.Advanced,
                  },
                ]}
              />
            </Grid>

            <Grid item xs={4}>
              <MinPieChart
                title='workout.plansByEnvironment'
                data={[
                  {
                    color: ReportColors.black,
                    title: String(messages["workouts.environment.Home"]),
                    value: workoutStatistics.plansByEnvironment.Home,
                  },
                  {
                    color: ReportColors.green,
                    title: String(messages["workouts.environment.Gym"]),
                    value: workoutStatistics.plansByEnvironment.Gym,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={4}>
              <MinPieChart
                title='workout.workoutsByFormat'
                data={[
                  {
                    color: ReportColors.brown,
                    title: String(messages["workouts.format.SetsReps"]),
                    value: workoutStatistics.workoutsByFormat.SetsReps,
                  },
                  {
                    color: ReportColors.darkBlue,
                    title: String(messages["workouts.format.FollowAlong"]),
                    value: workoutStatistics.workoutsByFormat.FollowAlong,
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

export default WorkoutStatistics;
