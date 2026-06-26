/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";

import { useGetPlanByIdQuery } from "src/pages/workout-module/workoutPLans/services/api";
import { IWorkoutPlansDetailsDto } from "src/types/modules/workout/workoutPlans";
import LevelChip from "src/pages/workout-module/workoutPLans/components/level-chip";
import WorkoutEnvironBadge from "src/Components/baseComponents/badge/WorkoutEnvironBadge";
interface IPlanDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const PlanDetails = (props: IPlanDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const {
    data: planItem,
    isLoading,
    error,
  } = useGetPlanByIdQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && planItem?.data?.nameEn!
            ? `- ${planItem?.data?.nameEn!}`
            : `- ${planItem?.data?.nameAr!}`
        }
        label='workoutPlan.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={planItem?.data as IWorkoutPlansDetailsDto}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={planItem?.data?.nameAr}
            column={4}
          />
          <AppItemView
            label='common.nameEn'
            value={planItem?.data?.nameEn}
            column={4}
          />

          <AppItemView
            label='workouts.level'
            value={<LevelChip title={planItem?.data?.level!} />}
            column={4}
          />

          <AppItemView
            label='workoutPlans.daysPerWeek'
            value={planItem?.data?.daysPerWeek}
            column={4}
          />
          <AppItemView
            label='workoutPlans.weeklyRepetition'
            value={planItem?.data?.weeklyRepetition}
            column={4}
          />

          <AppItemView
            label='workouts.environment'
            value={<WorkoutEnvironBadge label={planItem?.data?.environment!} />}
            column={4}
          />

          <AppItemView
            label='trainers.name'
            value={getValueBasedOnCurrentLanguage(
              planItem?.data?.trainer?.nameAr!,
              planItem?.data?.trainer?.nameEn!
            )}
            column={4}
          />
          <AppItemView
            label='planGoal.name'
            value={getValueBasedOnCurrentLanguage(
              planItem?.data?.planGoal?.nameAr!,
              planItem?.data?.planGoal?.nameEn!
            )}
            column={4}
          />
          <AppItemView
            label='common.status'
            value={planItem?.data?.isActive}
            column={4}
            type='isActive'
          />
          <AppItemView
            type='image'
            label='common.avatarImage'
            value={planItem?.data?.avatarImageUrl}
            column={6}
          />
          <AppItemView
            type='image'
            label='trainers.profileMedia'
            value={planItem?.data?.profileMediaUrl}
            column={6}
          />

          <AppItemView
            label='workouts.overviewAr'
            value={removeHTMLTags(planItem?.data?.overviewAr! ?? "")}
            column={6}
          />
          <AppItemView
            label='workouts.overviewEn'
            value={removeHTMLTags(planItem?.data?.overviewEn! ?? "")}
            column={6}
          />
          <AppItemView
            label='PlanConclusionAr'
            value={removeHTMLTags(planItem?.data?.planConclusionAr! ?? "")}
            column={6}
          />
          <AppItemView
            label='PlanConclusionEn'
            value={removeHTMLTags(planItem?.data?.planConclusionEn! ?? "")}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default PlanDetails;
