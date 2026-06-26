/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";
import { useGetWorkoutQuery } from "src/pages/workout-module/workouts/services/api";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import WorkoutLevelBadge from "src/Components/baseComponents/badge/WorkoutLevelBadge";
import WorkoutFormatBadge from "src/Components/baseComponents/badge/WorkoutFormatBadge";
import { baseImageUrl } from "src/env/base-url";
interface IWorkoutDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const WorkoutDetails = (props: IWorkoutDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const {
    data: workoutItem,
    isLoading,
    error,
  } = useGetWorkoutQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && workoutItem?.data?.nameEn!
            ? `- ${workoutItem?.data?.nameEn!}`
            : `- ${workoutItem?.data?.nameAr!}`
        }
        label='workouts.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={workoutItem?.data as IWorkoutBodyPart}
        maxWidth='md'
        columns={12}
        tabs={[
          {
            id: "1",
            label: "details",
            component: (
              <Grid container spacing={5} item xs={12}>
                <AppItemView
                  label='common.nameAr'
                  value={workoutItem?.data?.nameAr}
                  column={3}
                />
                <AppItemView
                  label='common.nameEn'
                  value={workoutItem?.data?.nameEn}
                  column={3}
                />

                <AppItemView
                  label='workouts.level'
                  value={
                    <WorkoutLevelBadge label={workoutItem?.data?.level!} />
                  }
                  column={3}
                />
                {/* <AppItemView
                  label="workouts.environment"
                  value={
                    <WorkoutEnvironBadge
                      label={workoutItem?.data?.environment!}
                    />
                  }
                  column={3}
                /> */}
                <AppItemView
                  label='workouts.durationInMins'
                  value={workoutItem?.data?.durationInMins}
                  column={3}
                />

                {/* <AppItemView label='trainers.name' value={getValueBasedOnCurrentLanguage(workoutItem?.data?.trainer?.nameAr!, workoutItem?.data?.trainer?.nameEn!)} column={3} /> */}
                <AppItemView
                  type='image'
                  label='common.avatarImage'
                  value={workoutItem?.data?.avatarImageUrl}
                  column={3}
                />
                {/* <AppItemView
                  type="image"
                  label="trainers.profileMedia"
                  value={workoutItem?.data?.profileMediaUrl}
                  column={3}
                /> */}

                <AppItemView
                  label='trainers.profileMedia'
                  value={
                    workoutItem?.data?.profileMediaUrl ? (
                      <a
                        target='_blank'
                        href={`${baseImageUrl}/${workoutItem?.data?.profileMediaUrl}`}>
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
                  value={workoutItem?.data?.isActive}
                  column={3}
                  type='isActive'
                />
                {/* <AppItemView
                  label='exercises.bodyParts'
                  value={getValueBasedOnCurrentLanguage(
                    workoutItem?.data?.bodyParts?.map((item) => item?.nameAr).join(', ') || '',
                    workoutItem?.data?.bodyParts?.map((item) => item?.nameEn).join(', ') || ''
                  )}
                  column={12}
                /> */}

                <AppItemView
                  label='workouts.overviewAr'
                  value={removeHTMLTags(workoutItem?.data?.overviewAr! ?? "")}
                  column={6}
                />
                <AppItemView
                  label='workouts.overviewEn'
                  value={removeHTMLTags(workoutItem?.data?.overviewEn! ?? "")}
                  column={6}
                />

                {/* <Grid container xs={12} justifyContent='center' mt={6}>
                  {workoutItem?.data?.facebookUrl && (
                    <IconButton
                      onClick={() => {
                        window.open(workoutItem.data.facebookUrl, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <FacebookIcon fontSize='large' />
                    </IconButton>
                  )}
                  {workoutItem?.data?.instagramUrl && (
                    <IconButton
                      onClick={() => {
                        window.open(workoutItem.data.instagramUrl, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <InstagramIcon fontSize='large' />
                    </IconButton>
                  )}

                  {workoutItem?.data?.youtubeUrl && (
                    <IconButton
                      onClick={() => {
                        window.open(workoutItem.data.youtubeUrl, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <YouTubeIcon fontSize='large' />
                    </IconButton>
                  )}

                  {workoutItem?.data?.websiteUrl && (
                    <IconButton
                      onClick={() => {
                        window.open(workoutItem.data.websiteUrl, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <LanguageIcon fontSize='large' />
                    </IconButton>
                  )}

                  {workoutItem?.data?.pinterestUrl && (
                    <IconButton
                      onClick={() => {
                        window.open(workoutItem.data.pinterestUrl, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <PinterestIcon fontSize='large' />
                    </IconButton>
                  )}
                </Grid> */}
              </Grid>
            ),
          },

          {
            id: "2",
            label: "trainers.additionalInfo",
            component: (
              <Grid container spacing={5} item xs={12}>
                <AppItemView
                  label='trainers.name'
                  value={getValueBasedOnCurrentLanguage(
                    workoutItem?.data?.trainer?.nameAr!,
                    workoutItem?.data?.trainer?.nameEn!
                  )}
                  column={4}
                />
                <AppItemView
                  label='workoutTypes.name'
                  value={getValueBasedOnCurrentLanguage(
                    workoutItem?.data?.workoutType?.nameAr!,
                    workoutItem?.data?.workoutType?.nameEn!
                  )}
                  column={4}
                />

                {/* <AppItemView label='categories.name' value={getValueBasedOnCurrentLanguage(workoutItem?.data?.equipmentCategory?.nameAr!, workoutItem?.data?.equipmentCategory?.nameEn!)} column={4} /> */}
                <AppItemView
                  label='sidebar.equipments'
                  value={getValueBasedOnCurrentLanguage(
                    workoutItem?.data?.equipments
                      ?.map((item) => item?.nameAr)
                      .join(", ") || "",
                    workoutItem?.data?.equipments
                      ?.map((item) => item?.nameEn)
                      .join(", ") || ""
                  )}
                  column={6}
                />
                <AppItemView
                  label='sidebar.workoutBodyParts'
                  value={getValueBasedOnCurrentLanguage(
                    workoutItem?.data?.bodyParts
                      ?.map((item) => item?.nameAr)
                      .join(", ") || "",
                    workoutItem?.data?.bodyParts
                      ?.map((item) => item?.nameEn)
                      .join(", ") || ""
                  )}
                  column={6}
                />
              </Grid>
            ),
          },

          {
            id: "3",
            label: "workout.trainingInfo",
            component: (
              <Grid container spacing={5} item xs={12}>
                <AppItemView
                  label='workouts.format'
                  value={
                    <WorkoutFormatBadge label={workoutItem?.data?.format!} />
                  }
                  column={4}
                />
                {/* <AppItemView label='workouts.isTop' value={workoutItem?.data?.isTop} type='isExist' column={4} />
                <AppItemView label='workouts.isWorkoutOfTheDay' value={workoutItem?.data?.isWorkoutOfTheDay} type='isExist' column={4} /> */}
              </Grid>
            ),
          },
          {
            id: "4",
            label: "additionalInfo",
            component: <AppMoreDetails moreDetails={workoutItem?.data!} />,
          },
        ]}
        children={<></>}
      />
    </>
  );
};

export default WorkoutDetails;
