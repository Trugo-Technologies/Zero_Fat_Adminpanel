/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import PlanSchedulesPages from "src/pages/workout-module/planSchedules";
import { IWorkoutPlans } from "src/types/modules/workout/workoutPlans";

interface IPlanSchedulesDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  selectedRow: IWorkoutPlans;
}

const PlanSchedulesDetails = (props: IPlanSchedulesDetailsProps) => {
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
        label='sidebar.planSchedules'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={false}
        errorMessage={"error"}
        tabs={[]}
        withoutSecoundTab={false}
        maxWidth='lg'
        columns={12}>
        <Grid container spacing={5} item xs={12} mt={2}>
          <PlanSchedulesPages
            planId={selectedRow?.id}
            daysPerWeek={selectedRow?.daysPerWeek}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default PlanSchedulesDetails;
