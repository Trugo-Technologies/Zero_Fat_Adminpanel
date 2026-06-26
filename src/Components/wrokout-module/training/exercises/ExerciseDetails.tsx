/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import ExerciseTypeBadge from "src/Components/baseComponents/badge/ExerciseTypeBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { baseImageUrl } from "src/env/base-url";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";
import { useGetExerciseQuery } from "src/pages/workout-module/training-module/exercises/services/api";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";

interface IExerciseDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const ExerciseDetails = (props: IExerciseDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const {
    data: exerciseItem,
    isLoading,
    error,
  } = useGetExerciseQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && exerciseItem?.data?.nameEn!
            ? `- ${exerciseItem?.data?.nameEn!}`
            : `- ${exerciseItem?.data?.nameAr!}`
        }
        label='exercises.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={exerciseItem?.data as IWorkoutBodyPart}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={exerciseItem?.data?.nameAr}
            column={3}
          />
          <AppItemView
            label='common.nameEn'
            value={exerciseItem?.data?.nameEn}
            column={3}
          />

          <AppItemView
            label='trainers.name'
            value={getValueBasedOnCurrentLanguage(
              exerciseItem?.data?.trainer?.nameAr!,
              exerciseItem?.data?.trainer?.nameEn!
            )}
            column={3}
          />
          <AppItemView
            label='exercises.type'
            value={<ExerciseTypeBadge label={exerciseItem?.data?.type!} />}
            column={3}
          />

          <AppItemView
            type='image'
            label='common.avatarImage'
            value={exerciseItem?.data?.avatarImageUrl}
            column={3}
          />
          <AppItemView
            type='image'
            label='common.gif'
            value={exerciseItem?.data?.gifUrl}
            column={3}
          />
          {/* <AppItemView
            type="image"
            label="common.media"
            value={exerciseItem?.data?.mediaUrl}
            column={3}
          /> */}

          <AppItemView
            label='common.status'
            value={exerciseItem?.data?.isActive}
            column={3}
            type='isActive'
          />
          <AppItemView
            label='exercises.bodyParts'
            value={getValueBasedOnCurrentLanguage(
              exerciseItem?.data?.bodyParts
                ?.map((item) => item?.nameAr)
                .join(", ") || "",
              exerciseItem?.data?.bodyParts
                ?.map((item) => item?.nameEn)
                .join(", ") || ""
            )}
            column={6}
          />

          <AppItemView
            label='common.media'
            value={
              exerciseItem?.data?.mediaUrl ? (
                <a
                  target='_blank'
                  href={`${baseImageUrl}/${exerciseItem?.data?.mediaUrl}`}>
                  {messages["clickHere"] as string}
                </a>
              ) : (
                "-"
              )
            }
            column={6}
          />

          <AppItemView
            label='exercises.instructionsAr'
            value={removeHTMLTags(exerciseItem?.data?.instructionsAr! ?? "")}
            column={6}
          />
          <AppItemView
            label='exercises.instructionsEn'
            value={removeHTMLTags(exerciseItem?.data?.instructionsEn! ?? "")}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default ExerciseDetails;
