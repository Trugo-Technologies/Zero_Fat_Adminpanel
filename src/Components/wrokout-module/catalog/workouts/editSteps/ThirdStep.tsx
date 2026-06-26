/** @format */

import { Grid, TextField } from "@mui/material";
import { FormikErrors, FormikHelpers, FormikTouched } from "formik";
import {
  handleKeyDown,
  handleWheel,
} from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppTags from "src/Components/baseComponents/inputs/AppTags";
import AppUploadDocument from "src/Components/baseComponents/uploadFile/uploadDocument/AppUploadDocument";
import { workoutFormat } from "src/types/enums";
import { ICreateWorkoutDto } from "src/types/modules/workout/workouts";

interface IThirdStepProps {
  setFieldValue: FormikHelpers<ICreateWorkoutDto>["setFieldValue"];
  errors: FormikErrors<ICreateWorkoutDto>;
  touched: FormikTouched<ICreateWorkoutDto>;
  values: ICreateWorkoutDto;
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
}

const ThirdStep = (props: IThirdStepProps) => {
  const {
    errors,
    setFieldValue,
    touched,
    values,
    setUploadedFiles,
    uploadedFiles,
  } = props;

  console.log("values", values);

  return (
    <Grid container spacing={4}>
      {values.format === workoutFormat.FollowAlong ? (
        <Grid item container xs={6}>
          <AppUploadDocument
            keyName='profileMedia'
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            uploadText='trainers.profileMedia'
            errors={!uploadedFiles?.length}
            uploadModernXs={3}
            appGridXs={6}
          />
        </Grid>
      ) : (
        <>
          <Grid item xs={2}>
            <TextField
              type='number'
              label={<IntlMessages id='workouts.sets' />}
              name={`sets`}
              variant='outlined'
              size='small'
              fullWidth
              onWheel={handleWheel} // Prevent mouse wheel input
              onKeyDown={handleKeyDown}
              value={values?.sets}
              onChange={(event) => {
                setFieldValue("setNamesAr", []);
                setFieldValue("setNamesEn", []);
                setFieldValue("exerciseSets", [
                  {
                    exerciseId: "",
                    exercise: null,
                    durationInSec: null,
                    reps: null,
                    index: null,
                    sets: null,
                    weight: null,
                  },
                ]);
                setFieldValue("sets", event?.target?.value);
              }}
              helperText={errors?.sets}
              error={!!errors?.sets}
            />
          </Grid>

          <Grid item xs={5}>
            <AppTags
              error={errors?.setNamesAr}
              touched={touched?.setNamesAr}
              label='workouts.setNamesAr'
              onChangeAutoComplete={(_, value) =>
                setFieldValue("setNamesAr", value)
              }
              value={values?.setNamesAr}
            />
          </Grid>

          <Grid item xs={5}>
            <AppTags
              error={errors?.setNamesEn}
              touched={touched?.setNamesEn}
              label='workouts.setNamesEn'
              onChangeAutoComplete={(_, value) =>
                setFieldValue("setNamesEn", value)
              }
              value={values?.setNamesEn}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ThirdStep;
