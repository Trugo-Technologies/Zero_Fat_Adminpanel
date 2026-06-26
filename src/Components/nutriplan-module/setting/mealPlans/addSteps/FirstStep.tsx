/** @format */

import { Grid, MenuItem } from "@mui/material";
import { FormikErrors, FormikHelpers, FormikTouched } from "formik";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import { mealPlansDefaultDietitianGoal } from "src/types/enums";
import { ICreateMealPlanDto } from "../../../../../types/modules/nutriplan/mealPlans";

interface IFirstStepProps {
  setFieldValue: FormikHelpers<ICreateMealPlanDto>["setFieldValue"];
  errors: FormikErrors<ICreateMealPlanDto>;
  touched: FormikTouched<ICreateMealPlanDto>;
  values: ICreateMealPlanDto;
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
          label={<IntlMessages id='common.code' />}
          name='code'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppSelectField
          fullWidth
          size='small'
          name='defaultDietitianGoal'
          labelId='mealPlans.defaultDietitianGoal'
          label={messages["mealPlans.defaultDietitianGoal"] as string}
          error={Boolean(errors?.defaultDietitianGoal)}>
          <MenuItem value={mealPlansDefaultDietitianGoal.BuildMuscles}>
            <IntlMessages id='defaultDietitianGoal.type.BuildMuscles' />
          </MenuItem>
          <MenuItem value={mealPlansDefaultDietitianGoal.GainWeight}>
            <IntlMessages id='defaultDietitianGoal.type.GainWeight' />
          </MenuItem>
          <MenuItem value={mealPlansDefaultDietitianGoal.GeneralHealth}>
            <IntlMessages id='defaultDietitianGoal.type.GeneralHealth' />
          </MenuItem>
          <MenuItem value={mealPlansDefaultDietitianGoal.LoseWeight}>
            <IntlMessages id='defaultDietitianGoal.type.LoseWeight' />
          </MenuItem>
          <MenuItem value={mealPlansDefaultDietitianGoal.LoseFat}>
            <IntlMessages id='defaultDietitianGoal.type.LoseFat' />
          </MenuItem>
        </AppSelectField>
      </Grid>
      <Grid item xs={4} display={"flex"} justifyContent={"flex-start"}>
        <AppCustomizedSwitch
          defaultChecked={values?.isActive}
          keyName='isActive'
          onChange={setFieldValue}
        />
      </Grid>

      <Grid item xs={12}>
        <AppImageField
          label={"common.image"}
          name='mainImage'
          placeholder={""}
        />
      </Grid>
    </Grid>
  );
};

export default FirstStep;
