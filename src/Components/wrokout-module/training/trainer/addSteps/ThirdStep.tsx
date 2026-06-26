/** @format */

import { Grid, MenuItem } from "@mui/material";
import {
  FormikErrors,
  FormikHelpers,
  FormikProps,
  FormikTouched,
} from "formik";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { ICreateTrainerDto } from "src/types/modules/training/trainers";

interface IThirdStepProps {
  setFieldValue: FormikHelpers<ICreateTrainerDto>["setFieldValue"];
  errors: FormikErrors<ICreateTrainerDto>;
  touched: FormikTouched<ICreateTrainerDto>;
  values: ICreateTrainerDto;
}

const ThirdStep = (props: IThirdStepProps) => {
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

export default ThirdStep;
