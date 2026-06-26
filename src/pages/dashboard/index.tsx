/** @format */

import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import ClientStatistics from "src/Components/dashboard/clientStatistics";
import NutriplanStatistics from "src/Components/dashboard/nutriplanStatistics";
import WorkoutStatistics from "src/Components/dashboard/workoutStatistics";
const DashboardPage = () => {
  return (
    <LoadingAndErrorWrapper errorMessage={""} isLoading={false}>
      <ClientStatistics />
      <WorkoutStatistics />
      <NutriplanStatistics />
    </LoadingAndErrorWrapper>
  );
};

export default DashboardPage;
