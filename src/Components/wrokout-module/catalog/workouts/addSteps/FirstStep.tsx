/** @format */

import { Grid, MenuItem } from "@mui/material";
import {
  FormikErrors,
  FormikHelpers, FormikTouched
} from "formik";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import { workoutLevel } from "src/types/enums";
import { ICreateWorkoutDto } from "src/types/modules/workout/workouts";

interface IFirstStepProps {
  setFieldValue: FormikHelpers<ICreateWorkoutDto>["setFieldValue"];
  errors: FormikErrors<ICreateWorkoutDto>;
  touched: FormikTouched<ICreateWorkoutDto>;
  values: ICreateWorkoutDto;
}

const FirstStep = (props: IFirstStepProps) => {
  const { errors, setFieldValue, touched, values } = props;
  const { messages } = useIntl();

  return (
    <Grid container rowSpacing={6} columnSpacing={6}>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='common.nameAr' />}
          name='nameAr'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='common.nameEn' />}
          name='nameEn'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='workouts.durationInMins' />}
          name='durationInMins'
          type='number'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppSelectField
          fullWidth
          size='small'
          name='level'
          labelId='workouts.level'
          label={messages["workouts.level"] as string}
          error={Boolean(errors?.level)}>
          <MenuItem value={workoutLevel.Beginner}>
            <IntlMessages id='workouts.level.Beginner' />
          </MenuItem>
          <MenuItem value={workoutLevel.Intermediate}>
            <IntlMessages id='workouts.level.Intermediate' />
          </MenuItem>
          <MenuItem value={workoutLevel.Advanced}>
            <IntlMessages id='workouts.level.Advanced' />
          </MenuItem>
        </AppSelectField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='workouts.caloriesBurned' />}
          name='caloriesBurned'
          variant='outlined'
          size='small'
          type='number'
          fullWidth
        />
      </Grid>
      <Grid item xs={4} display={"flex"} justifyContent={"flex-start"}>
        <AppCustomizedSwitch
          defaultChecked={values?.isActive}
          keyName='isActive'
          onChange={setFieldValue}
        />
      </Grid>
      <Grid item xs={6}>
        <AppFreeEditor name='overviewAr' label='workouts.overviewAr' />
      </Grid>
      <Grid item xs={6}>
        <AppFreeEditor name='overviewEn' label='workouts.overviewEn' />
      </Grid>

      <Grid item xs={6}>
        <AppImageField
          label={"common.avatarImage"}
          name='avatarImage'
          placeholder={""}
        />
      </Grid>
    </Grid>
  );
};

export default FirstStep;
