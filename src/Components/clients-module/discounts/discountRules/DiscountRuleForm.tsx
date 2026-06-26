/** @format */

import { Grid, MenuItem } from "@mui/material";
import { Form, useFormikContext } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppDatePicker from "src/Components/baseComponents/inputs/dateTimePickers/AppDatePicker";
import {
  Duration,
  ICreateDiscountRuleDto,
  IUpdateDiscountRuleDto,
} from "src/types/modules/clientsManagement/discounts/discountRules";

interface IProps {}

const DiscountRuleForm: React.FC<IProps> = (props) => {
  const {} = props;
  const { messages } = useIntl();
  const { values, setFieldValue, errors, touched } = useFormikContext<
    ICreateDiscountRuleDto | IUpdateDiscountRuleDto
  >();

  console.log("errors", errors);

  return (
    <Form>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <AppTextField
            label={<IntlMessages id='discountRules.code' />}
            name='code'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <AppDatePicker
            label='common.startDate'
            name='startDate'
            minDate={new Date()}
            onChange={setFieldValue}
            value={values?.startDate}
            errorText={
              errors?.startDate && touched?.startDate ? errors?.startDate : ""
            }
          />
        </Grid>

        <Grid item xs={4}>
          <AppDatePicker
            label='discountRules.expirationDate'
            name='expirationDate'
            minDate={new Date()}
            onChange={setFieldValue}
            value={values?.expirationDate}
            errorText={
              errors?.expirationDate && touched?.expirationDate
                ? errors?.expirationDate
                : ""
            }
          />
        </Grid>

        <Grid item xs={4}>
          <AppCheckbox
            keyName='isPercent'
            label='discountRules.isPercent'
            defaultChecked={values?.isPercent}
            onChange={(value: any) => {
              setFieldValue("amountOff", null);
              setFieldValue("percentOff", null);
              setFieldValue("isPercent", !values.isPercent);
            }}
          />
        </Grid>

        {values.isPercent && (
          <Grid item xs={4}>
            <AppTextField
              key={"percentOff"}
              label={<IntlMessages id='discountRules.percentOff' />}
              name='percentOff'
              variant='outlined'
              disabled={!values.isPercent}
              size='small'
              type='number'
              fullWidth
            />
          </Grid>
        )}

        {!values.isPercent && (
          <Grid item xs={4}>
            <AppTextField
              key={"amountOff"}
              label={<IntlMessages id='discountRules.amountOff' />}
              name='amountOff'
              variant='outlined'
              disabled={values.isPercent}
              size='small'
              type='number'
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={4}>
          <AppCheckbox
            keyName='firstTimeClientsOnly'
            label='discountRules.firstTimeClientsOnly'
            defaultChecked={values?.firstTimeClientsOnly}
            onChange={setFieldValue}
          />
        </Grid>

        <Grid item xs={4}>
          <AppSelectField
            fullWidth
            size='small'
            name='duration'
            labelId='discountRules.duration'
            label={messages["discountRules.duration"] as string}
            error={Boolean(errors?.duration)}>
            <MenuItem value={Duration.Once}>
              <IntlMessages id='discountRules.duration.Once' />
            </MenuItem>
            <MenuItem value={Duration.Repeating}>
              <IntlMessages id='discountRules.duration.Repeating' />
            </MenuItem>
            <MenuItem value={Duration.Forever}>
              <IntlMessages id='discountRules.duration.Forever' />
            </MenuItem>
          </AppSelectField>
        </Grid>

        {values.duration === Duration.Repeating && (
          <Grid item xs={4}>
            <AppTextField
              label={<IntlMessages id='discountRules.durationInMonths' />}
              name='durationInMonths'
              variant='outlined'
              size='small'
              type='number'
              fullWidth
            />
          </Grid>
        )}

        <Grid item xs={values.duration !== Duration.Repeating ? 8 : 4} />

        <Grid item xs={4}>
          <AppTextField
            label={<IntlMessages id='discountRules.maxRedemptions' />}
            name='maxRedemptions'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <AppTextField
            label={<IntlMessages id='discountRules.maxRedemptionsPerClient' />}
            name='maxRedemptionsPerClient'
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
          <AppTextField
            label={<IntlMessages id='common.descriptionAr' />}
            name='descriptionAr'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <AppTextField
            label={<IntlMessages id='common.descriptionEn' />}
            name='descriptionEn'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>
      </Grid>
    </Form>
  );
};

export default DiscountRuleForm;
