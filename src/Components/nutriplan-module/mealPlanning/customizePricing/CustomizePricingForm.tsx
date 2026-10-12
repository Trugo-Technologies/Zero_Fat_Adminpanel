/** @format */

import { FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import { Form, useFormikContext } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import {
  CustomizeMacroType,
  ICustomizePricingFormValues,
} from "src/types/modules/nutriplan/customizePricing";

const CustomizePricingForm: React.FC = () => {
  const { messages } = useIntl();
  const { values, setFieldValue } =
    useFormikContext<ICustomizePricingFormValues>();

  const t = (key: string, fallback: string) =>
    (messages[key] as string) || fallback;

  return (
    <Form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RadioGroup
            row
            value={values.macroType}
            onChange={(e) =>
              setFieldValue("macroType", e.target.value as CustomizeMacroType)
            }>
            <FormControlLabel
              value={CustomizeMacroType.Protein}
              control={<Radio size='small' />}
              label={t("customizePricing.macro.Protein", "Protein")}
            />
            <FormControlLabel
              value={CustomizeMacroType.Carbs}
              control={<Radio size='small' />}
              label={t("customizePricing.macro.Carbs", "Carbs")}
            />
          </RadioGroup>
        </Grid>

        <Grid item xs={12} sm={4}>
          <AppTextField
            label={<IntlMessages id='customizePricing.fromGrams' />}
            name='fromGrams'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
            FormHelperTextProps={{
              sx: { mx: 0, minHeight: 20, lineHeight: 1.25 },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppTextField
            label={<IntlMessages id='customizePricing.toGrams' />}
            name='toGrams'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
            FormHelperTextProps={{
              sx: { mx: 0, minHeight: 20, lineHeight: 1.25 },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppTextField
            label={
              <IntlMessages
                id={
                  values.macroType === CustomizeMacroType.Carbs
                    ? "customizePricing.priceCarbs"
                    : "customizePricing.priceProtein"
                }
              />
            }
            name='price'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
            FormHelperTextProps={{
              sx: { mx: 0, minHeight: 20, lineHeight: 1.25 },
            }}
          />
        </Grid>

        {/* Meal plan / meal type temporarily disabled
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='cp-meal-plan-label'>
              {t("customizePricing.mealPlan", "Meal Plan")}
            </InputLabel>
            <Select
              labelId='cp-meal-plan-label'
              value={values.mealPlanId || ""}
              label={t("customizePricing.mealPlan", "Meal Plan")}
              onChange={(e) => setFieldValue("mealPlanId", e.target.value)}>
              <MenuItem value=''>
                {t("customizePricing.mealPlan.all", "All meal plans")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='cp-meal-type-label'>
              {t("customizePricing.mealType", "Meal Type")}
            </InputLabel>
            <Select
              labelId='cp-meal-type-label'
              value={values.mealTypeId || ""}
              label={t("customizePricing.mealType", "Meal Type")}
              onChange={(e) => setFieldValue("mealTypeId", e.target.value)}>
              <MenuItem value=''>
                {t("customizePricing.mealType.all", "All meal types")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        */}

        <Grid item xs={12} md={4} display='flex' alignItems='center'>
          <AppCustomizedSwitch
            defaultChecked={values?.isActive}
            keyName='isActive'
            onChange={setFieldValue}
          />
        </Grid>
      </Grid>
    </Form>
  );
};

export default CustomizePricingForm;
