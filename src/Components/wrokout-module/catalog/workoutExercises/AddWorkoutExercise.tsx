/** @format */

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Grid, MenuItem } from "@mui/material";
import { FieldArray, Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllExercisesQuery } from "src/pages/workout-module/training-module/exercises/services/api";
import { useAddWorkoutExerciseMutation } from "src/pages/workout-module/workoutExercises/services/api";
import { exerciseType } from "src/types/enums";
import { IExercisesListDto } from "src/types/modules/training/exercises";
import { ICreateWorkoutExerciseDto } from "src/types/modules/workout/workoutExercises";
import * as yup from "yup";
interface IAddWorkoutExerciseProps {
  label: string;
  workoutId: string;
  trainerId: string;

  sets: number;
}

const AddWorkoutExercise: React.FC<IAddWorkoutExerciseProps> = (props) => {
  const { label, workoutId, trainerId, sets } = props;

  const [addWorkoutExerciseMethod, { isLoading: addLoading, isSuccess }] =
    useAddWorkoutExerciseMutation();

  const {
    changePage: changePageExercises,
    data: exercisesList,
    isError: isErrorExercises,
    isFetching: isFetchingExercises,
    limit: limitExercises,
    page: pageExercises,
    changeLimit: changeLimitExercises,
    setSearchValue: setSearchValueExercises,
    searchValue: searchValueExercises,
    totalRecords: totalRecordsExercises,
    handleDelete: handleDeleteExercises,
    refetch: refetchExercises,
    parameter,
    setParameter,
  } = usePaginateData<IExercisesListDto>(
    useGetAllExercisesQuery,
    {
      skip: !trainerId,
    },
    { trainerId: trainerId }
  );

  const { messages } = useIntl();

  const validationSchema = yup.object({
    workoutId: yup.string().required(String(messages["validation.required"])),
    // sets: yup
    //   .number()
    //   .nullable()
    //   .required(String(messages["validation.required"]))
    //   .positive(String(messages["validation.positive"])), // Ensures the number is positive

    items: yup.array().of(
      yup.object().shape({
        exerciseId: yup
          .string()
          .required(String(messages["validation.required"])),
        // reps: yup.number().nullable().required(String(messages['validation.required'])),
        sets: yup
          .number()
          .nullable()
          .required(String(messages["validation.required"])),
        // durationInSec: yup.number().nullable().required(String(messages['validation.required'])),
        // weight: yup.number().nullable().required(String(messages['validation.required'])),
      })
    ),
  });
  const refForm = React.useRef<FormikProps<ICreateWorkoutExerciseDto>>(null);

  useEffect(() => {
    setParameter({ ...parameter, trainerId: trainerId });
    // if (trainerId) {
    //   refetchExercises();
    // }
  }, [trainerId]);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <>
      <LoadingAndErrorWrapper isLoading={addLoading ?? false} errorMessage={""}>
        <Formik
          validateOnChange={true}
          initialValues={{
            workoutId: workoutId || "",
            sets: null,
            items: [
              {
                exerciseId: "",
                exercise: null,
                durationInSec: null,
                reps: null,
                sets: null,
                weight: null,
              },
            ],
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting, resetForm }) => {
            addWorkoutExerciseMethod(data);
          }}>
          {({ setFieldValue, values, errors, touched }) => {
            return (
              <Form>
                <Grid container spacing={4} xs={12}>
                  {/* <Grid item xs={3}>
                    <TextField
                      type="number"
                      label={<IntlMessages id="workouts.sets" />}
                      name={`sets`}
                      variant="outlined"
                      size="small"
                      fullWidth
                      defaultValue={values?.sets}
                      value={values?.sets}
                      onWheel={(event) => handleWheel(event)} // Prevent mouse wheel input
                      onKeyDown={(event) => {
                        handleKeyDown(event);
                      }}
                      // onMouseDown={(event) => handleMouseDown(event)} // Prevent mouse input

                      onChange={(event) => {
                        setFieldValue("items", [
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
                  </Grid> */}
                  <Grid item xs={12}>
                    <FieldArray
                      name='items'
                      render={(arrayHelpers) => (
                        <Grid container xs={12} item spacing={4}>
                          {values?.items?.map((item, index) => {
                            return (
                              <Grid item container xs={12} spacing={4}>
                                <Grid item xs={4}>
                                  <AppBaseAutoComplete
                                    label='exercises.name'
                                    isLoading={isFetchingExercises}
                                    options={exercisesList?.data}
                                    hasNextPage={exercisesList?.hasNextPage}
                                    pageNumber={pageExercises}
                                    changePage={changePageExercises}
                                    onChangeAutoComplete={(event, value) => {
                                      setFieldValue(
                                        `items[${index}].exercise`,
                                        value ? value : null
                                      );

                                      setFieldValue(
                                        `items[${index}].exerciseId`,
                                        value ? value?.id : ""
                                      );
                                      changePageExercises(1);
                                    }}
                                    searchText={searchValueExercises}
                                    onChangeTextField={(value) => {
                                      setSearchValueExercises(
                                        value.target.value
                                      );
                                      changePageExercises(1);
                                    }}
                                    error={
                                      errors?.items &&
                                      ((errors?.items as any)[index] as any)
                                        ?.exerciseId
                                    }
                                    touched={
                                      touched?.items &&
                                      ((touched?.items as any)[index] as any)
                                        ?.exerciseId
                                    }
                                  />
                                </Grid>

                                <Grid item xs={2}>
                                  <AppSelectField
                                    fullWidth
                                    size='small'
                                    name={`items[${index}].sets`}
                                    labelId='workouts.set'
                                    label={messages["workouts.set"] as string}
                                    // disabled={!sets || sets <= 0} // Disable if sets is not valid
                                  >
                                    {/* Render MenuItems based on the value of sets */}
                                    {/* {values?.sets! > 0 &&
                                      Array(Number(values?.sets) || 0)
                                        .fill(null)
                                        .map((_, i) => (
                                          <MenuItem key={i + 1} value={i + 1}>
                                            <IntlMessages id="workouts.setNumber" />{" "}
                                            {i + 1}
                                          </MenuItem>
                                        ))} */}
                                    {Array.from(
                                      { length: sets },
                                      (_, index) => index + 1
                                    ).map((item) => (
                                      <MenuItem value={item}>
                                        <IntlMessages id='workouts.setNumber' />{" "}
                                        {item}
                                      </MenuItem>
                                    ))}
                                    {!sets && (
                                      <MenuItem disabled>
                                        <IntlMessages id='workouts.noSets' />
                                      </MenuItem>
                                    )}
                                  </AppSelectField>
                                </Grid>

                                {(values?.items![index]?.exercise?.type ===
                                  exerciseType.Reps ||
                                  values?.items![index]?.exercise?.type ===
                                    exerciseType.WeightAndReps) && (
                                  <Grid item xs={2}>
                                    <AppTextField
                                      type='number'
                                      label={
                                        <IntlMessages id='workouts.reps' />
                                      }
                                      name={`items[${index}].reps`}
                                      variant='outlined'
                                      size='small'
                                      fullWidth
                                    />
                                  </Grid>
                                )}
                                {values?.items![index]?.exercise?.type ===
                                  exerciseType.WeightAndReps && (
                                  <Grid item xs={2}>
                                    <AppTextField
                                      type='number'
                                      label={
                                        <IntlMessages id='workouts.weight' />
                                      }
                                      name={`items[${index}].weight`}
                                      variant='outlined'
                                      size='small'
                                      fullWidth
                                    />
                                  </Grid>
                                )}

                                {values?.items![index]?.exercise?.type ===
                                  exerciseType.Duration && (
                                  <Grid item xs={2}>
                                    <AppTextField
                                      type='number'
                                      label={
                                        <IntlMessages id='workouts.durationInSec' />
                                      }
                                      name={`items[${index}].durationInSec`}
                                      variant='outlined'
                                      size='small'
                                      fullWidth
                                    />
                                  </Grid>
                                )}
                                <Grid
                                  item
                                  container
                                  xs={2}
                                  columnGap={2}
                                  alignItems={"center"}>
                                  <AppIconButton
                                    label='workouts.item.delete'
                                    handleClick={() => {
                                      arrayHelpers.remove(index);
                                    }}
                                    disabled={values.items.length === 1}
                                    // Disable if there's only one item
                                    childComp={
                                      <DeleteForeverIcon
                                        fontSize='medium'
                                        sx={{ color: "#ff5252" }}
                                      />
                                    }
                                  />
                                  {index === values.items.length - 1 && (
                                    <AppIconButton
                                      label='workouts.item.add'
                                      handleClick={() => {
                                        arrayHelpers.push({
                                          exerciseId: "",
                                          exercise: null,
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
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </LoadingAndErrorWrapper>
      <Grid item xs={12} mt={6} display='flex' justifyContent={"end"}>
        <AppButton
          label={label}
          loading={addLoading}
          onClick={() => {
            submit();
          }}
        />
      </Grid>
    </>
  );
};

export default AddWorkoutExercise;
