/** @format */

import { Grid } from "@mui/material";
import { Form, useFormikContext } from "formik";
import React from "react";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import {
  ICreateCustomizationGroupDto,
  IUpdateCustomizationGroupDto,
} from "src/types/modules/nutriplan/mealPlanning/customizationGroups";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";

interface IProps {}

const CustomizationGroupForm: React.FC<IProps> = (props) => {
  const {} = props;
  const { values, setFieldValue } = useFormikContext<
    ICreateCustomizationGroupDto | IUpdateCustomizationGroupDto
  >();

  return (
    <Form>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <AppTextField
            label={<IntlMessages id='common.nameAr' />}
            name='nameAr'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <AppTextField
            label={<IntlMessages id='common.nameEn' />}
            name='nameEn'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <AppTextField
            label={<IntlMessages id='customizationGroups.caloriesAdjustment' />}
            name='caloriesAdjustment'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <AppTextField
            label={<IntlMessages id='customizationGroups.fatAdjustment' />}
            name='fatAdjustment'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <AppTextField
            label={<IntlMessages id='customizationGroups.carbsAdjustment' />}
            name='carbsAdjustment'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <AppTextField
            label={<IntlMessages id='customizationGroups.proteinAdjustment' />}
            name='proteinAdjustment'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <AppTextField
            label={<IntlMessages id='customizationGroups.displayOrder' />}
            name='displayOrder'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <AppCheckbox
            keyName='isRequired'
            label='customizationGroups.isRequired'
            defaultChecked={values?.isRequired}
            onChange={setFieldValue}
          />
        </Grid>

        <Grid item xs={12}>
          <AppImageField name='image' label='common.image' placeholder='' />
        </Grid>
      </Grid>
    </Form>
  );
};

export default CustomizationGroupForm;
