/** @format */

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Chip, Divider, Grid, MenuItem, TextField } from "@mui/material";
import {
  FieldArray,
  FormikErrors,
  FormikHelpers,
  FormikProps,
  FormikTouched,
} from "formik";
import { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField, {
  handleKeyDown,
  handleWheel,
} from "src/@crema/components/AppFormComponents/AppTextField";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppTags from "src/Components/baseComponents/inputs/AppTags";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import AppUploadDocument from "src/Components/baseComponents/uploadFile/uploadDocument/AppUploadDocument";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllExercisesQuery } from "src/pages/workout-module/training-module/exercises/services/api";
import { exerciseType, workoutFormat } from "src/types/enums";
import { IExercisesListDto } from "src/types/modules/training/exercises";
import { ICreateWorkoutDto } from "src/types/modules/workout/workouts";

interface IThirdStepProps {
  setFieldValue: FormikHelpers<ICreateWorkoutDto>["setFieldValue"];
  errors: FormikErrors<ICreateWorkoutDto>;
  touched: FormikTouched<ICreateWorkoutDto>;
  values: ICreateWorkoutDto;
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
  refForm: React.RefObject<FormikProps<ICreateWorkoutDto>>;
}

const ThirdStep = (props: IThirdStepProps) => {
  const {
    errors,
    setFieldValue,
    touched,
    values,
    setUploadedFiles,
    uploadedFiles,
    refForm,
  } = props;

  const { messages } = useIntl();
  const {
    changePage: changePageExercises,
    data: exercisesList,
    isFetching: isFetchingExercises,
    page: pageExercises,
    setSearchValue: setSearchValueExercises,
    searchValue: searchValueExercises,
    refetch: refetchExercises,
  } = usePaginateData<IExercisesListDto>(
    useGetAllExercisesQuery,
    {
      skip: !values?.trainerId,
    },
    {
      trainerId: values?.trainerId,
    }
  );

  useEffect(() => {
    if (pageExercises && pageExercises > 1) refetchExercises();
  }, [pageExercises]);

  useEffect(() => {
    setUploadedFiles([]);
    if (refForm?.current) {
      refForm.current?.setFieldValue("profileMedia", "");
      refForm.current?.setFieldValue("sets", null);
      refForm.current?.setFieldValue("setNamesAr", []);
      refForm.current?.setFieldValue("setNamesEn", []);
      if (values?.format === workoutFormat.FollowAlong) {
        refForm.current?.setFieldValue("exerciseSets", []);
      } else {
        refForm.current?.setFieldValue("exerciseSets", [
          {
            exerciseId: "",
            exercise: null,
            durationInSec: null,
            reps: null,
            sets: null,
            weight: null,
          },
        ]);
      }
    }
  }, [values?.format]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={4}>
        <AppSelectField
          fullWidth
          size='small'
          name='format'
          defaultValue={values?.format}
          labelId='workouts.format'
          label={messages["workouts.format"] as string}
          error={Boolean(errors?.format)}>
          <MenuItem value={workoutFormat.SetReps} key={workoutFormat.SetReps}>
            <IntlMessages id='workouts.format.SetsReps' />
          </MenuItem>
          <MenuItem value={workoutFormat.FollowAlong}>
            <IntlMessages id='workouts.format.FollowAlong' />
          </MenuItem>
        </AppSelectField>
      </Grid>

      {values?.format === workoutFormat.FollowAlong && (
        <AppUploadDocument
          keyName='profileMedia'
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          uploadText='trainers.profileMedia'
          formRef={refForm}
          uploadModernXs={4}
          appGridXs={4}
          errors={
            values.format === workoutFormat.FollowAlong &&
            !uploadedFiles?.length
          }
        />
      )}

      {/* <Grid item xs={4}>
        <AppCheckbox
          keyName="isTop"
          label="workouts.isTop"
          defaultChecked={values?.isTop}
          onChange={setFieldValue}
        />
      </Grid> */}
      {/* <Grid item xs={4}>
        <AppCheckbox
          keyName="isWorkoutOfTheDay"
          defaultChecked={values?.isWorkoutOfTheDay}
          label="workouts.isWorkoutOfTheDay"
          onChange={setFieldValue}
        />
      </Grid> */}
      {values?.format === workoutFormat.SetReps && (
        <>
          <Grid item xs={12}>
            <Divider
              sx={{ color: "#a5d060", fontWeight: Fonts.SEMI_BOLD }}
              variant='fullWidth'>
              {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
              <Chip
                label={messages["sidebar.workoutsExercises"] as string}
                size='medium'
                color='primary'
              />
            </Divider>
          </Grid>
          <Grid item xs={2}>
            <TextField
              type='number'
              label={<IntlMessages id='workouts.sets' />}
              name={`sets`}
              variant='outlined'
              size='small'
              fullWidth
              onWheel={(event) => handleWheel(event)} // Prevent mouse wheel input
              onKeyDown={(event) => {
                handleKeyDown(event);
              }}
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

          <Grid item xs={12}>
            <FieldArray
              name='exerciseSets'
              render={(arrayHelpers) => (
                <Grid container xs={12} item spacing={4}>
                  {values?.exerciseSets?.map((item, index) => {
                    return (
                      <Grid item container xs={12} spacing={4}>
                        <Grid item xs={3}>
                          <AppBaseAutoComplete
                            key={values?.sets}
                            label='exercises.name'
                            isLoading={isFetchingExercises}
                            options={exercisesList?.data}
                            hasNextPage={exercisesList?.hasNextPage}
                            pageNumber={pageExercises}
                            changePage={changePageExercises}
                            defaultValue={
                              values?.exerciseSets![index]?.exercise
                            }
                            onChangeAutoComplete={(event, value) => {
                              setFieldValue(
                                `exerciseSets[${index}].exercise`,
                                value ? value : null
                              );
                              setFieldValue(
                                `exerciseSets[${index}].exerciseId`,
                                value ? value?.id : ""
                              );
                              setFieldValue(
                                `exerciseSets[${index}].reps`,
                                null
                              );
                              setFieldValue(
                                `exerciseSets[${index}].weight`,
                                null
                              );
                              setFieldValue(
                                `exerciseSets[${index}].durationInSec`,
                                null
                              );

                              changePageExercises(1);
                            }}
                            searchText={searchValueExercises}
                            onChangeTextField={(value) => {
                              setSearchValueExercises(value.target.value);
                              changePageExercises(1);
                            }}
                            error={
                              errors?.exerciseSets &&
                              ((errors?.exerciseSets as any)[index] as any)
                                ?.exerciseId
                            }
                            touched={
                              touched?.exerciseSets &&
                              ((touched?.exerciseSets as any)[index] as any)
                                ?.exerciseId
                            }
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <AppSelectField
                            fullWidth
                            size='small'
                            name={`exerciseSets[${index}].sets`}
                            labelId='workouts.set'
                            label={messages["workouts.set"] as string}
                            disabled={!values.sets}>
                            {/* Render MenuItems based on the value of sets */}
                            {values?.sets! > 0 &&
                              Array(Number(values.sets) || 0)
                                .fill(null)
                                .map((_, i) => (
                                  <MenuItem key={i + 1} value={i + 1}>
                                    <IntlMessages id='workouts.setNumber' />{" "}
                                    {i + 1}
                                  </MenuItem>
                                ))}
                          </AppSelectField>

                          {/* <AppTextField type='number' label={<IntlMessages id='workouts.set' />} name={`exerciseSets[${index}].sets`} variant='outlined' size='small' fullWidth /> */}
                        </Grid>
                        {(values?.exerciseSets![index]?.exercise?.type ===
                          exerciseType.Reps ||
                          values?.exerciseSets![index]?.exercise?.type ===
                            exerciseType.WeightAndReps) && (
                          <Grid item xs={2}>
                            <AppTextField
                              type='number'
                              label={<IntlMessages id='workouts.reps' />}
                              name={`exerciseSets[${index}].reps`}
                              variant='outlined'
                              size='small'
                              fullWidth
                            />
                          </Grid>
                        )}
                        {values?.exerciseSets![index]?.exercise?.type ===
                          exerciseType.WeightAndReps && (
                          <Grid item xs={2}>
                            <AppTextField
                              type='number'
                              label={<IntlMessages id='workouts.weight' />}
                              name={`exerciseSets[${index}].weight`}
                              variant='outlined'
                              size='small'
                              fullWidth
                            />
                          </Grid>
                        )}

                        {values?.exerciseSets![index]?.exercise?.type ===
                          exerciseType.Duration && (
                          <Grid item xs={2}>
                            <AppTextField
                              type='number'
                              label={
                                <IntlMessages id='workouts.durationInSec' />
                              }
                              name={`exerciseSets[${index}].durationInSec`}
                              variant='outlined'
                              size='small'
                              fullWidth
                            />
                          </Grid>
                        )}

                        <Grid
                          item
                          xs={1}
                          container
                          columnGap={2}
                          alignItems={"center"}>
                          <AppIconButton
                            label='workouts.item.delete'
                            handleClick={() => {
                              arrayHelpers.remove(index);
                            }}
                            disabled={values?.exerciseSets?.length === 1}
                            // Disable if there's only one item
                            childComp={
                              <DeleteForeverIcon
                                fontSize='medium'
                                sx={{ color: "#ff5252" }}
                              />
                            }
                          />
                          {index === values?.exerciseSets?.length! - 1 && (
                            <AppIconButton
                              label='workouts.item.add'
                              handleClick={() => {
                                arrayHelpers.push({
                                  exerciseId: "",
                                  durationInSec: null,
                                  reps: null,
                                  sets: null,
                                  weight: null,
                                });
                              }}
                              childComp={
                                <AddCircleIcon
                                  fontSize='medium'
                                  sx={{ color: "#a5d060" }}
                                />
                              }
                            />
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ThirdStep;
