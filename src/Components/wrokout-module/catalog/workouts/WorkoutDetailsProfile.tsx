/** @format */

import { Chip, Divider, Grid } from "@mui/material";
import { useIntl } from "react-intl";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";
import WorkoutLevelBadge from "src/Components/baseComponents/badge/WorkoutLevelBadge";
import WorkoutFormatBadge from "src/Components/baseComponents/badge/WorkoutFormatBadge";
import BaseProfileDetails from "src/Components/baseComponents/profile/BaseProfileDetails";
import { Fonts } from "src/@crema/constants/AppEnums";
import { IWorkout } from "src/types/modules/workout/workouts";
import { baseImageUrl } from "src/env/base-url";
interface IWorkoutDetailsProfileProps {
  workoutItem: IWorkout;
}

const WorkoutDetailsProfile = (props: IWorkoutDetailsProfileProps) => {
  const { workoutItem } = props;
  const { locale, messages } = useIntl();

  return (
    <>
      <BaseProfileDetails moreDetails={workoutItem as IWorkout} columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={workoutItem?.nameAr}
            column={3}
          />
          <AppItemView
            label='common.nameEn'
            value={workoutItem?.nameEn}
            column={3}
          />

          <AppItemView
            label='workouts.level'
            value={<WorkoutLevelBadge label={workoutItem?.level!} />}
            column={3}
          />
          <AppItemView
            label='workouts.durationInMins'
            value={workoutItem?.durationInMins}
            column={3}
          />

          <AppItemView
            label='workouts.caloriesBurned'
            value={workoutItem?.caloriesBurned}
            column={3}
          />
          <AppItemView
            type='image'
            label='common.avatarImage'
            value={workoutItem?.avatarImageUrl}
            column={3}
          />
          {/* <AppItemView
            type="image"
            label="trainers.profileMedia"
            value={workoutItem?.profileMediaUrl}
            column={3}
          /> */}

          <AppItemView
            label='trainers.profileMedia'
            value={
              workoutItem?.profileMediaUrl ? (
                <a
                  target='_blank'
                  href={`${baseImageUrl}/${workoutItem?.profileMediaUrl}`}>
                  {messages["clickHere"] as string}
                </a>
              ) : (
                "-"
              )
            }
            column={3}
          />

          <AppItemView
            label='common.status'
            value={workoutItem?.isActive}
            column={3}
            type='isActive'
          />
          {/* <AppItemView
                  label='exercises.bodyParts'
                  value={getValueBasedOnCurrentLanguage(
                    workoutItem?.bodyParts?.map((item) => item?.nameAr).join(', ') || '',
                    workoutItem?.bodyParts?.map((item) => item?.nameEn).join(', ') || ''
                  )}
                  column={12}
                /> */}

          <AppItemView
            label='workouts.overviewAr'
            value={removeHTMLTags(workoutItem?.overviewAr! ?? "")}
            column={6}
          />
          <AppItemView
            label='workouts.overviewEn'
            value={removeHTMLTags(workoutItem?.overviewEn! ?? "")}
            column={6}
          />
        </Grid>
        <Grid item xs={12} mt={6} mb={6}>
          <Divider
            sx={{ color: "#a5d060", fontWeight: Fonts.SEMI_BOLD }}
            variant='fullWidth'>
            {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
            <Chip
              label={messages["trainers.additionalInfo"] as string}
              size='medium'
              color='primary'
            />
          </Divider>
        </Grid>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='trainers.name'
            value={getValueBasedOnCurrentLanguage(
              workoutItem?.trainer?.nameAr!,
              workoutItem?.trainer?.nameEn!
            )}
            column={4}
          />
          <AppItemView
            label='workoutTypes.name'
            value={getValueBasedOnCurrentLanguage(
              workoutItem?.workoutType?.nameAr!,
              workoutItem?.workoutType?.nameEn!
            )}
            column={4}
          />

          <AppItemView
            label='sidebar.equipments'
            value={getValueBasedOnCurrentLanguage(
              workoutItem?.equipments?.map((item) => item?.nameAr).join(", ") ||
                "",
              workoutItem?.equipments?.map((item) => item?.nameEn).join(", ") ||
                ""
            )}
            column={6}
          />
          <AppItemView
            label='sidebar.workoutBodyParts'
            value={getValueBasedOnCurrentLanguage(
              workoutItem?.bodyParts?.map((item) => item?.nameAr).join(", ") ||
                "",
              workoutItem?.bodyParts?.map((item) => item?.nameEn).join(", ") ||
                ""
            )}
            column={6}
          />
        </Grid>
        <Grid item xs={12} mt={6} mb={6}>
          <Divider
            sx={{ color: "#a5d060", fontWeight: Fonts.SEMI_BOLD }}
            variant='fullWidth'>
            {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
            <Chip
              label={messages["workout.trainingInfo"] as string}
              size='medium'
              color='primary'
            />
          </Divider>
        </Grid>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='workouts.format'
            value={<WorkoutFormatBadge label={workoutItem?.format!} />}
            column={4}
          />
          <AppItemView
            label='workouts.setNamesAr'
            value={workoutItem?.setNamesAr
              ?.map((item: string) => item)
              .join(", ")}
            column={4}
          />
          <AppItemView
            label='workouts.setNamesEn'
            value={workoutItem?.setNamesEn
              ?.map((item: string) => item)
              .join(", ")}
            column={4}
          />
        </Grid>
      </BaseProfileDetails>
    </>
  );
};

export default WorkoutDetailsProfile;
