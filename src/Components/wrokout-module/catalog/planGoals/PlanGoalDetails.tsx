/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetPlanGoalQuery } from "src/pages/workout-module/planGoals/services/api";
import { IPlanGoal } from "src/types/modules/workout/planGoals";

interface IPlanGoalDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const PlanGoalDetails = (props: IPlanGoalDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: planGoalItem,
    isLoading,
    error,
  } = useGetPlanGoalQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && planGoalItem?.data?.nameEn!
            ? `- ${planGoalItem?.data?.nameEn!}`
            : `- ${planGoalItem?.data?.nameAr!}`
        }
        label='planGoals.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={planGoalItem?.data as IPlanGoal}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={planGoalItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={planGoalItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.image'
            value={planGoalItem?.data?.imageUrl}
            column={6}
          />

          <AppItemView
            label='common.status'
            value={planGoalItem?.data?.isActive}
            column={6}
            type='isActive'
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default PlanGoalDetails;
