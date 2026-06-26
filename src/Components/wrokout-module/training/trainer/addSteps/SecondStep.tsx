/** @format */

import { Grid } from "@mui/material";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface ISecondStepProps {}

const SecondStep = (props: ISecondStepProps) => {
  const {} = props;

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <AppTextField
          label={<IntlMessages id='trainers.briefAr' />}
          name='briefAr'
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
      <Grid item xs={6}>
        <AppTextField
          label={<IntlMessages id='trainers.briefEn' />}
          name='briefEn'
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
      <Grid item xs={6}>
        <AppTextField
          label={<IntlMessages id='trainers.descriptionAr' />}
          name='descriptionAr'
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
      <Grid item xs={6}>
        <AppTextField
          label={<IntlMessages id='trainers.descriptionEn' />}
          name='descriptionEn'
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
    </Grid>
  );
};

export default SecondStep;
