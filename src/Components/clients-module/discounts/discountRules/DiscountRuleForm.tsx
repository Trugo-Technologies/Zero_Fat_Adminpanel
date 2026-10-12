/** @format */

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import { Form, useFormikContext } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppDatePicker from "src/Components/baseComponents/inputs/dateTimePickers/AppDatePicker";
import { useGetAllBanksQuery } from "src/pages/clients-module/discounts/banks/services/api";
import { useGetActiveMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import {
  DiscountOfferType,
  DISCOUNT_SUBSCRIPTION_TYPE_OPTIONS,
  Duration,
  ICreateDiscountRuleDto,
  IUpdateDiscountRuleDto,
} from "src/types/modules/clientsManagement/discounts/discountRules";

const checkboxCellSx = {
  display: "flex",
  alignItems: "center",
  minHeight: 40,
};

const DiscountRuleForm: React.FC = () => {
  const { messages, locale } = useIntl();
  const { values, setFieldValue, errors, touched } = useFormikContext<
    ICreateDiscountRuleDto | IUpdateDiscountRuleDto
  >();

  const { data: banksResponse } = useGetAllBanksQuery({
    pageNumber: 1,
    pageSize: 200,
    isActive: true,
  });
  const { data: mealPlansResponse } = useGetActiveMealPlansQuery();

  const banks = banksResponse?.data || [];
  const mealPlans = mealPlansResponse?.data || [];
  const isBankOffer = values.offerType === DiscountOfferType.Bank;
  const isRepeating = values.duration === Duration.Repeating;

  const t = (key: string, fallback: string) =>
    (messages[key] as string) || fallback;

  React.useEffect(() => {
    if (!isBankOffer && values.bankId) {
      setFieldValue("bankId", "");
    }
  }, [isBankOffer, values.bankId, setFieldValue]);

  const subscriptionTypesError =
    touched.subscriptionTypes && errors.subscriptionTypes
      ? String(errors.subscriptionTypes)
      : "";

  return (
    <Form>
      <Grid container spacing={3} alignItems='flex-start'>
        {/* Row 1 */}
        <Grid item xs={12} md={4}>
          <AppSelectField
            fullWidth
            size='small'
            name='offerType'
            labelId='discountRules.offerType'
            label={t("discountRules.offerType", "Offer Type")}
            error={Boolean(errors?.offerType)}>
            <MenuItem value={DiscountOfferType.PromoCode}>
              <IntlMessages id='discountRules.offerType.PromoCode' />
            </MenuItem>
            <MenuItem value={DiscountOfferType.Bank}>
              <IntlMessages id='discountRules.offerType.Bank' />
            </MenuItem>
          </AppSelectField>
        </Grid>

        <Grid item xs={12} md={4}>
          <AppTextField
            label={<IntlMessages id='discountRules.code' />}
            name='code'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4}>
          {isBankOffer ? (
            <AppSelectField
              fullWidth
              size='small'
              name='bankId'
              labelId='discountRules.bank'
              label={t("discountRules.bank", "Bank")}
              error={Boolean(errors?.bankId)}>
              <MenuItem value=''>
                <em>{t("discountRules.bank.select", "Select bank")}</em>
              </MenuItem>
              {banks.map((bank) => (
                <MenuItem key={bank.id} value={bank.id}>
                  {locale === "en-US" ? bank.nameEn : bank.nameAr}
                </MenuItem>
              ))}
            </AppSelectField>
          ) : null}
        </Grid>

        {/* Row 2 */}
        <Grid item xs={12} md={4}>
          <AppSelectField
            fullWidth
            size='small'
            name='mealPlanId'
            labelId='discountRules.mealPlan'
            label={t("discountRules.mealPlan", "Meal Plan")}
            error={Boolean(errors?.mealPlanId)}>
            <MenuItem value=''>
              <em>{t("discountRules.mealPlan.all", "All meal plans")}</em>
            </MenuItem>
            {mealPlans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {locale === "en-US" ? plan.nameEn : plan.nameAr}
              </MenuItem>
            ))}
          </AppSelectField>
        </Grid>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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

        {/* Row 3 */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size='small' error={!!subscriptionTypesError}>
            <InputLabel id='discount-subscription-types-label'>
              {t("discountRules.subscriptionTypes", "Subscription Types")}
            </InputLabel>
            <Select
              labelId='discount-subscription-types-label'
              multiple
              value={values.subscriptionTypes || []}
              onChange={(e) => {
                const value = e.target.value;
                setFieldValue(
                  "subscriptionTypes",
                  typeof value === "string" ? value.split(",") : value
                );
              }}
              input={
                <OutlinedInput
                  label={t(
                    "discountRules.subscriptionTypes",
                    "Subscription Types"
                  )}
                />
              }
              renderValue={(selected) => {
                const ids = selected as string[];
                if (!ids.length) {
                  return t(
                    "discountRules.subscriptionTypes.all",
                    "All subscription types"
                  );
                }
                return ids
                  .map((id) => {
                    const opt = DISCOUNT_SUBSCRIPTION_TYPE_OPTIONS.find(
                      (o) => o.value === id
                    );
                    return opt ? t(opt.labelKey, id) : id;
                  })
                  .join(", ");
              }}>
              {DISCOUNT_SUBSCRIPTION_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox
                    checked={(values.subscriptionTypes || []).includes(
                      option.value
                    )}
                    size='small'
                  />
                  <ListItemText primary={t(option.labelKey, option.value)} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {subscriptionTypesError ||
                t(
                  "discountRules.subscriptionTypesHint",
                  "Leave empty to apply to all subscription types"
                )}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
          {isRepeating ? (
            <AppTextField
              label={<IntlMessages id='discountRules.durationInMonths' />}
              name='durationInMonths'
              variant='outlined'
              size='small'
              type='number'
              fullWidth
              helperText={t(
                "discountRules.durationInMonthsHint",
                "How many months the discount repeats"
              )}
            />
          ) : null}
        </Grid>

        {/* Row 4 */}
        <Grid item xs={12} md={4}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "text.secondary",
              mb: 0.25,
            }}>
            {t("discountRules.discountType", "Discount Type")}
          </Typography>
          <RadioGroup
            row
            value={values.isPercent ? "percent" : "amount"}
            onChange={(e) => {
              const isPercent = e.target.value === "percent";
              setFieldValue("isPercent", isPercent);
              setFieldValue("amountOff", null);
              setFieldValue("percentOff", null);
            }}>
            <FormControlLabel
              value='percent'
              control={<Radio size='small' />}
              label={t("discountRules.isPercent", "Percent")}
            />
            <FormControlLabel
              value='amount'
              control={<Radio size='small' />}
              label={t("discountRules.amountOff", "Amount")}
            />
          </RadioGroup>
        </Grid>

        <Grid item xs={12} md={4}>
          {values.isPercent ? (
            <AppTextField
              key='percentOff'
              label={<IntlMessages id='discountRules.percentOff' />}
              name='percentOff'
              variant='outlined'
              size='small'
              type='number'
              fullWidth
            />
          ) : (
            <AppTextField
              key='amountOff'
              label={<IntlMessages id='discountRules.amountOff' />}
              name='amountOff'
              variant='outlined'
              size='small'
              type='number'
              fullWidth
            />
          )}
        </Grid>

        <Grid item xs={12} md={4} sx={checkboxCellSx}>
          <AppCustomizedSwitch
            defaultChecked={values?.isActive}
            keyName='isActive'
            onChange={setFieldValue}
          />
        </Grid>

        {/* Row 5 */}
        <Grid item xs={12} md={4}>
          <AppTextField
            label={<IntlMessages id='discountRules.maxRedemptions' />}
            name='maxRedemptions'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <AppTextField
            label={<IntlMessages id='discountRules.maxRedemptionsPerClient' />}
            name='maxRedemptionsPerClient'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4} />

        {/* Row 6 */}
        <Grid item xs={12} md={4} sx={checkboxCellSx}>
          <FormControlLabel
            control={
              <Checkbox
                size='small'
                checked={!!values.firstTimeClientsOnly}
                onChange={(e) =>
                  setFieldValue("firstTimeClientsOnly", e.target.checked)
                }
              />
            }
            label={t(
              "discountRules.firstTimeClientsOnly",
              "First Time Clients Only"
            )}
            sx={{ m: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={4} sx={checkboxCellSx}>
          <FormControlLabel
            control={
              <Checkbox
                size='small'
                checked={!!values.addToOffers}
                onChange={(e) =>
                  setFieldValue("addToOffers", e.target.checked)
                }
              />
            }
            label={t("discountRules.addToOffers", "Add to Offers")}
            sx={{ m: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={4} />

        {/* Row 7 */}
        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='common.descriptionEn' />}
            name='descriptionEn'
            variant='outlined'
            size='small'
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='common.descriptionAr' />}
            name='descriptionAr'
            variant='outlined'
            size='small'
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>
      </Grid>
    </Form>
  );
};

export default DiscountRuleForm;
