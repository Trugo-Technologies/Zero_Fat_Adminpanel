/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import WorkoutExercisesPages from "src/pages/workout-module/workoutExercises";
import { IWorkout } from "src/types/modules/workout/workouts";

interface IWorkoutExercisesDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  selectedRow: IWorkout;
}

const WorkoutExercisesDetails = (props: IWorkoutExercisesDetailsProps) => {
  const { showDetails, setShowDetails, selectedRow } = props;
  const { locale } = useIntl();

  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && selectedRow?.nameEn!
            ? `- ${selectedRow?.nameEn!}`
            : `- ${selectedRow?.nameAr!}`
        }
        label='sidebar.exercises'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={false}
        errorMessage={"error"}
        tabs={[]}
        withoutSecoundTab={false}
        maxWidth='lg'
        columns={12}>
        <Grid container spacing={5} item xs={12} mt={2}>
          <WorkoutExercisesPages
            workoutId={selectedRow?.id}
            sets={selectedRow?.setNamesAr?.length}
            trainerId={selectedRow?.trainer?.id}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default WorkoutExercisesDetails;
