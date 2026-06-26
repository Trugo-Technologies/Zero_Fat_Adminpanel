/** @format */

import { Grid, MenuItem } from "@mui/material";
import {
  FormikErrors,
  FormikHelpers,
  FormikTouched,
  useFormikContext,
} from "formik";
import { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllPlanGoalsQuery } from "src/pages/workout-module/planGoals/services/api";
import { useGetAllTrainersQuery } from "src/pages/workout-module/training-module/trainer/services/api";
import { workoutEnvironment } from "src/types/enums";
import { ITrainersListDto } from "src/types/modules/training/trainers";
import { IPlanGoalsListDto } from "src/types/modules/workout/planGoals";
import { IWorkoutPlansCreateDto } from "src/types/modules/workout/workoutPlans";
import { ICreateWorkoutDto } from "src/types/modules/workout/workouts";

interface ISecondStepProps {
  setFieldValue: FormikHelpers<ICreateWorkoutDto>["setFieldValue"];
  errors: FormikErrors<ICreateWorkoutDto>;
  touched: FormikTouched<ICreateWorkoutDto>;
  values: ICreateWorkoutDto;
}

const SecondStep = () => {
  //   const { errors, setFieldValue, touched, values } = props;
  const { errors, setFieldValue, touched, values } =
    useFormikContext<IWorkoutPlansCreateDto>();

  const { messages } = useIntl();

  const daysOfWeek = [
    messages["common.days.Sunday"],
    messages["common.days.Monday"],
    messages["common.days.Tuesday"],
    messages["common.days.Wednesday"],
    messages["common.days.Thursday"],
    messages["common.days.Friday"],
    messages["common.days.Saturday"],
  ];

  const {
    data: trainersList,
    isFetching: isFetchingTrainers,
    page: pageTrainers,
    changePage: changePageTrainers,
    setSearchValue: setSearchValueTrainers,
    searchValue: searchValueTrainers,
    refetch: refetchTrainers,
  } = usePaginateData<ITrainersListDto>(useGetAllTrainersQuery);

  const {
    data: planGoalsList,
    isFetching: isFetchingPlanGoals,
    page: pagePlanGoals,
    changePage: changePagePlanGoals,

    setSearchValue: setSearchValuePlanGoal,
    searchValue: searchValuePlanGoal,
    refetch: refetchPlanGoals,
  } = usePaginateData<IPlanGoalsListDto>(useGetAllPlanGoalsQuery);

  useEffect(() => {
    if (pageTrainers && pageTrainers > 1) refetchTrainers();
  }, [pageTrainers]);

  useEffect(() => {
    if (pagePlanGoals && pagePlanGoals > 1) refetchPlanGoals();
  }, [pagePlanGoals]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={4}>
        <AppSelectField
          fullWidth
          size='small'
          name='environment'
          labelId='workouts.environment'
          label={messages["workouts.environment"] as string}
          error={Boolean(errors?.environment)}>
          <MenuItem value={workoutEnvironment.Home}>
            <IntlMessages id='workouts.environment.Home' />
          </MenuItem>
          <MenuItem value={workoutEnvironment.Gym}>
            <IntlMessages id='workouts.environment.Gym' />
          </MenuItem>
        </AppSelectField>
      </Grid>

      <Grid item xs={4}>
        <AppBaseAutoComplete
          label='trainers.name'
          isLoading={isFetchingTrainers}
          options={trainersList?.data}
          hasNextPage={trainersList?.hasNextPage}
          pageNumber={pageTrainers}
          changePage={changePageTrainers}
          onChangeAutoComplete={(event, value) => {
            setFieldValue("trainer", value);
            setFieldValue("trainerId", value ? value?.id : "");
            changePageTrainers(1);
          }}
          defaultValue={values?.trainer}
          searchText={searchValueTrainers}
          onChangeTextField={(value) => {
            setSearchValueTrainers(value.target.value);
            changePageTrainers(1);
          }}
          error={errors.trainerId}
          touched={touched.trainerId}
        />
      </Grid>

      <Grid item xs={4}>
        <AppBaseAutoComplete
          label='planGoal.name'
          isLoading={isFetchingPlanGoals}
          options={planGoalsList?.data}
          hasNextPage={planGoalsList?.hasNextPage}
          pageNumber={pagePlanGoals}
          changePage={changePagePlanGoals}
          onChangeAutoComplete={(event, value) => {
            setFieldValue("planGoal", value);
            setFieldValue("planGoalId", value ? value?.id : "");
            changePagePlanGoals(1);
          }}
          defaultValue={values?.planGoal}
          searchText={searchValuePlanGoal}
          onChangeTextField={(value) => {
            setSearchValuePlanGoal(value.target.value);
            changePagePlanGoals(1);
          }}
          error={errors.planGoalId}
          touched={touched.planGoalId}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='workoutPlans.daysPerWeek' />}
          name='daysPerWeek'
          type='number'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>

      <Grid item xs={4}>
        <AppSelectField
          fullWidth
          size='small'
          name='restDays'
          labelId='workouts.RestDays'
          label={messages["workouts.RestDays"] as string}
          // error={Boolean(errors?.restDays)}
          multiple>
          {daysOfWeek?.map((item, index) => (
            <MenuItem value={index}>{item.toString()}</MenuItem>
          ))}
        </AppSelectField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='workoutPlans.weeklyRepetition' />}
          name='weeklyRepetition'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>

      <Grid item xs={6}>
        <AppTextField
          label={<IntlMessages id='PlanConclusionAr' />}
          name='planConclusionAr'
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={6}>
        <AppTextField
          label={<IntlMessages id='PlanConclusionEn' />}
          name='planConclusionEn'
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
    </Grid>
  );
};

export default SecondStep;
