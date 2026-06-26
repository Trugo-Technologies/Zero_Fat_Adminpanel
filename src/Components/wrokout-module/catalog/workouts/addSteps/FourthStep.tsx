/** @format */

import { Grid } from "@mui/material";
import { FormikErrors, FormikHelpers, FormikTouched } from "formik";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { ICreateWorkoutDto } from "src/types/modules/workout/workouts";

interface IFourthStepProps {
  setFieldValue: FormikHelpers<ICreateWorkoutDto>["setFieldValue"];
  errors: FormikErrors<ICreateWorkoutDto>;
  touched: FormikTouched<ICreateWorkoutDto>;
  values: ICreateWorkoutDto;
}

const FourthStep = (props: IFourthStepProps) => {
  const { errors, setFieldValue, touched, values } = props;
  const { messages } = useIntl();

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <AppTextField
          label={<IntlMessages id='trainers.facebookUrl' />}
          name='facebookUrl'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <AppTextField
          label={<IntlMessages id='trainers.instagramUrl' />}
          name='instagramUrl'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <AppTextField
          label={<IntlMessages id='trainers.youtubeUrl' />}
          name='youtubeUrl'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <AppTextField
          label={<IntlMessages id='trainers.websiteUrl' />}
          name='websiteUrl'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <AppTextField
          label={<IntlMessages id='trainers.pinterestUrl' />}
          name='pinterestUrl'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default FourthStep;
