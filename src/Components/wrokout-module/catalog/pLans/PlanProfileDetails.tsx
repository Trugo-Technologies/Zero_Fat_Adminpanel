/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import WorkoutEnvironBadge from "src/Components/baseComponents/badge/WorkoutEnvironBadge";
import BaseProfileDetails from "src/Components/baseComponents/profile/BaseProfileDetails";
import LevelChip from "src/pages/workout-module/workoutPLans/components/level-chip";
import { IWorkoutPlansDetailsDto } from "src/types/modules/workout/workoutPlans";
interface IPlanProfileDetailsProps {
  planItem: IWorkoutPlansDetailsDto;
}

const PlanProfileDetails = (props: IPlanProfileDetailsProps) => {
  const { planItem } = props;
  const { locale, messages } = useIntl();

  const daysOfWeek = [
    messages["common.days.Sunday"],
    messages["common.days.Monday"],
    messages["common.days.Tuesday"],
    messages["common.days.Wednesday"],
    messages["common.days.Thursday"],
    messages["common.days.Friday"],
    messages["common.days.Saturday"],
  ];

  const getDayString = (dayNumber: number) => {
    return daysOfWeek[dayNumber];
  };

  return (
    <>
      <BaseProfileDetails
        moreDetails={planItem as IWorkoutPlansDetailsDto}
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
            label='workouts.RestDays'
            value={
              planItem?.data?.restDays
                ? planItem?.data?.restDays
                    ?.map((item) => getDayString(item))
                    .join(", ")
                : "-"
            }
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
            label='categories.name'
            value={getValueBasedOnCurrentLanguage(
              planItem?.data?.equipmentCategory?.nameAr!,
              planItem?.data?.equipmentCategory?.nameEn!
            )}
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
            type='image'
            label='common.avatarImage'
            value={planItem?.data?.avatarImageUrl}
            column={4}
          />
          <AppItemView
            type='image'
            label='trainers.profileMedia'
            value={planItem?.data?.profileMediaUrl}
            column={4}
          />
          <AppItemView
            label='common.status'
            value={planItem?.data?.isActive}
            column={12}
            type='isActive'
          />

          <AppItemView
            label='workouts.overviewAr'
            value={planItem?.data?.overviewAr}
            column={6}
          />
          <AppItemView
            label='workouts.overviewEn'
            value={planItem?.data?.overviewEn}
            column={6}
          />
          <AppItemView
            label='PlanConclusionAr'
            value={planItem?.data?.planConclusionAr}
            column={6}
          />
          <AppItemView
            label='PlanConclusionEn'
            value={planItem?.data?.planConclusionEn}
            column={6}
          />
        </Grid>
      </BaseProfileDetails>
    </>
  );
};

export default PlanProfileDetails;
