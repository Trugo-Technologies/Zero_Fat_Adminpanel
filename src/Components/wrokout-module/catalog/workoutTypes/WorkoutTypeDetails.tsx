/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetWorkoutTypesQuery } from "src/pages/workout-module/workoutTypes/services/api";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";

interface IWorkoutTypeDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const WorkoutTypeDetails = (props: IWorkoutTypeDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: workoutTypeItem,
    isLoading,
    error,
  } = useGetWorkoutTypesQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && workoutTypeItem?.data?.nameEn!
            ? `- ${workoutTypeItem?.data?.nameEn!}`
            : `- ${workoutTypeItem?.data?.nameAr!}`
        }
        label='workoutTypes.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={workoutTypeItem?.data as IWorkoutBodyPart}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={workoutTypeItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={workoutTypeItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.icon'
            value={workoutTypeItem?.data?.iconUrl}
            column={6}
          />

          <AppItemView
            label='common.status'
            value={workoutTypeItem?.data?.isActive}
            column={6}
            type='isActive'
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default WorkoutTypeDetails;
