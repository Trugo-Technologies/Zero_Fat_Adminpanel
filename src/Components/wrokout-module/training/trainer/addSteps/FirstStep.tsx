/** @format */

import { Grid, MenuItem } from "@mui/material";
import { FormikErrors, FormikHelpers, FormikTouched } from "formik";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppTags from "src/Components/baseComponents/inputs/AppTags";
import { trainerType } from "src/types/enums";
import { ICreateTrainerDto } from "src/types/modules/training/trainers";

interface IFirstStepProps {
  setFieldValue: FormikHelpers<ICreateTrainerDto>["setFieldValue"];
  errors: FormikErrors<ICreateTrainerDto>;
  touched: FormikTouched<ICreateTrainerDto>;
  values: ICreateTrainerDto;
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
        <AppSelectField
          fullWidth
          size='small'
          name='type'
          labelId='exercises.type'
          label={messages["exercises.type"] as string}
          error={Boolean(errors?.type)}>
          <MenuItem value={trainerType.Athlete}>
            <IntlMessages id='trainers.type.Athlete' />
          </MenuItem>
          <MenuItem value={trainerType.Trainer}>
            <IntlMessages id='trainers.type.Trainer' />
          </MenuItem>
        </AppSelectField>
      </Grid>
      <Grid item xs={12} display={"flex"} justifyContent={"flex-start"}>
        <AppCustomizedSwitch
          defaultChecked={values?.isActive}
          keyName='isActive'
          onChange={setFieldValue}
        />
      </Grid>
      <Grid item xs={12}>
        <AppTags
          error={errors?.specialisesIn}
          touched={touched?.specialisesIn}
          label='trainers.specialises'
          onChangeAutoComplete={(event, value) =>
            setFieldValue("specialisesIn", value)
          }
          value={values?.specialisesIn}
        />
      </Grid>
      <Grid item xs={6}>
        <AppImageField
          label={"common.avatarImage"}
          name='avatarImage'
          placeholder={""}
        />
      </Grid>
      <Grid item xs={6}>
        <AppImageField
          accept='*'
          label={"trainers.profileMedia"}
          name='profileMedia'
          placeholder={""}
        />
      </Grid>
    </Grid>
  );
};

export default FirstStep;
