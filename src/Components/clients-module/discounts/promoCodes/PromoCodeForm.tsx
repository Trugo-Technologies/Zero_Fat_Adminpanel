/** @format */

import {
  Box,
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
import {
  getActivePromoBanks,
  MOCK_PROMO_BANKS,
  MOCK_PROMO_PLANS,
} from "src/pages/clients-module/discounts/promoCodes/mockData";
import {
  ICreatePromoCodeDto,
  IUpdatePromoCodeDto,
  PromoApplyMode,
  PromoDuration,
  PromoEligibilityType,
  PromoRewardType,
  PromoSubscriptionType,
  PROMO_SUBSCRIPTION_TYPE_OPTIONS,
} from "src/types/modules/clientsManagement/discounts/promoCodes";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ width: "100%", mb: 2 }}>
    <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 2 }}>
      {title}
    </Typography>
    <Grid container spacing={3}>
      {children}
    </Grid>
  </Box>
);

const PromoCodeForm: React.FC = () => {
  const { messages, locale } = useIntl();
  const { values, setFieldValue, errors, touched } = useFormikContext<
    ICreatePromoCodeDto | IUpdatePromoCodeDto
  >();

  const isBankOffer = values.applyMode === PromoApplyMode.AutoOnBank;
  const isPercent = values.rewardType === PromoRewardType.Percent;
  const activeBanks = getActivePromoBanks();

  const t = (key: string, fallback: string) =>
    (messages[key] as string) || fallback;

  /** Normalize legacy values to the simplified 2-option model */
  const offerTypeValue = isBankOffer
    ? PromoApplyMode.AutoOnBank
    : PromoApplyMode.Manual;

  const rewardTypeValue =
    values.rewardType === PromoRewardType.Amount
      ? PromoRewardType.Amount
      : PromoRewardType.Percent;

  const eligibilityValue =
    values.eligibilityType === PromoEligibilityType.FirstTime
      ? PromoEligibilityType.FirstTime
      : PromoEligibilityType.All;

  const onOfferTypeChange = (next: PromoApplyMode) => {
    setFieldValue("applyMode", next);
    if (next !== PromoApplyMode.AutoOnBank) {
      setFieldValue("bankIds", []);
    }
  };

  const onRewardTypeChange = (next: PromoRewardType) => {
    setFieldValue("rewardType", next);
    setFieldValue("isPercent", next === PromoRewardType.Percent);
    setFieldValue("buyQuantity", null);
    setFieldValue("getQuantity", null);
    if (next === PromoRewardType.Percent) {
      setFieldValue("amountOff", null);
    } else {
      setFieldValue("percentOff", null);
    }
  };

  return (
    <Form>
      <Grid container spacing={2}>
        <Section title={t("promoCodes.section.offerType", "Offer Type")}>
          <Grid item xs={12}>
            <RadioGroup
              row
              value={offerTypeValue}
              onChange={(e) =>
                onOfferTypeChange(e.target.value as PromoApplyMode)
              }>
              <FormControlLabel
                value={PromoApplyMode.Manual}
                control={<Radio size='small' />}
                label={t("promoCodes.offerType.promoCode", "Promo Code")}
              />
              <FormControlLabel
                value={PromoApplyMode.AutoOnBank}
                control={<Radio size='small' />}
                label={t("promoCodes.offerType.bank", "Bank")}
              />
            </RadioGroup>
          </Grid>

          {isBankOffer && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='promo-banks-label'>
                  {t("promoCodes.banks", "Banks")}
                </InputLabel>
                <Select
                  labelId='promo-banks-label'
                  multiple
                  value={values.bankIds || []}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue(
                      "bankIds",
                      typeof value === "string" ? value.split(",") : value
                    );
                  }}
                  input={
                    <OutlinedInput label={t("promoCodes.banks", "Banks")} />
                  }
                  renderValue={(selected) =>
                    (selected as string[])
                      .map((id) => {
                        const bank = MOCK_PROMO_BANKS.find((b) => b.id === id);
                        return bank
                          ? locale === "en-US"
                            ? bank.nameEn
                            : bank.nameAr
                          : id;
                      })
                      .join(", ")
                  }>
                  {activeBanks.map((bank) => (
                    <MenuItem key={bank.id} value={bank.id}>
                      <Checkbox
                        checked={(values.bankIds || []).includes(bank.id)}
                        size='small'
                      />
                      <ListItemText
                        primary={
                          locale === "en-US" ? bank.nameEn : bank.nameAr
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {!activeBanks.length && (
                <FormHelperText>
                  {t(
                    "promoCodes.banksEmpty",
                    "No active banks yet. Add banks under Discounts → Banks."
                  )}
                </FormHelperText>
              )}
            </Grid>
          )}

          <Grid item xs={12} md={isBankOffer ? 6 : 12}>
            <AppTextField
              label={<IntlMessages id='promoCodes.code' />}
              name='code'
              variant='outlined'
              size='small'
              fullWidth
              placeholder='e.g. GET20OFF'
            />
          </Grid>

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
        </Section>

        <Section title={t("promoCodes.section.discount", "Discount Type")}>
          <Grid item xs={12}>
            <RadioGroup
              row
              value={rewardTypeValue}
              onChange={(e) =>
                onRewardTypeChange(e.target.value as PromoRewardType)
              }>
              <FormControlLabel
                value={PromoRewardType.Percent}
                control={<Radio size='small' />}
                label={t("promoCodes.rewardType.Percent", "Percentage")}
              />
              <FormControlLabel
                value={PromoRewardType.Amount}
                control={<Radio size='small' />}
                label={t("promoCodes.rewardType.Amount", "Fixed")}
              />
            </RadioGroup>
          </Grid>

          {isPercent ? (
            <Grid item xs={12} md={6}>
              <AppTextField
                key='percentOff'
                label={<IntlMessages id='promoCodes.percentOff' />}
                name='percentOff'
                variant='outlined'
                size='small'
                type='number'
                fullWidth
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={6}>
              <AppTextField
                key='amountOff'
                label={<IntlMessages id='promoCodes.amountOff' />}
                name='amountOff'
                variant='outlined'
                size='small'
                type='number'
                fullWidth
              />
            </Grid>
          )}
        </Section>

        <Section title={t("promoCodes.section.who", "Eligibility")}>
          <Grid item xs={12}>
            <RadioGroup
              row
              value={eligibilityValue}
              onChange={(e) => {
                const next = e.target.value as PromoEligibilityType;
                setFieldValue("eligibilityType", next);
                setFieldValue(
                  "firstTimeClientsOnly",
                  next === PromoEligibilityType.FirstTime
                );
              }}>
              <FormControlLabel
                value={PromoEligibilityType.All}
                control={<Radio size='small' />}
                label={t("promoCodes.eligibilityType.All", "All")}
              />
              <FormControlLabel
                value={PromoEligibilityType.FirstTime}
                control={<Radio size='small' />}
                label={t(
                  "promoCodes.eligibilityType.FirstTime",
                  "First time"
                )}
              />
            </RadioGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth size='small'>
              <InputLabel id='promo-plans-label'>
                {t("promoCodes.plans", "Meal Plan")}
              </InputLabel>
              <Select
                labelId='promo-plans-label'
                multiple
                value={values.planIds || []}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue(
                    "planIds",
                    typeof value === "string" ? value.split(",") : value
                  );
                }}
                input={
                  <OutlinedInput label={t("promoCodes.plans", "Meal Plan")} />
                }
                renderValue={(selected) => {
                  const ids = selected as string[];
                  if (!ids.length) {
                    return t("promoCodes.plans.all", "All plans");
                  }
                  return ids
                    .map((id) => {
                      const plan = MOCK_PROMO_PLANS.find((p) => p.id === id);
                      return plan
                        ? locale === "en-US"
                          ? plan.nameEn
                          : plan.nameAr
                        : id;
                    })
                    .join(", ");
                }}>
                {MOCK_PROMO_PLANS.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    <Checkbox
                      checked={(values.planIds || []).includes(plan.id)}
                      size='small'
                    />
                    <ListItemText
                      primary={locale === "en-US" ? plan.nameEn : plan.nameAr}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormHelperText>
              {t(
                "promoCodes.plansHint",
                "Leave empty to apply to all meal plans."
              )}
            </FormHelperText>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth size='small'>
              <InputLabel id='promo-subscription-types-label'>
                {t("promoCodes.subscriptionTypes", "Subscription Type")}
              </InputLabel>
              <Select
                labelId='promo-subscription-types-label'
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
                      "promoCodes.subscriptionTypes",
                      "Subscription Type"
                    )}
                  />
                }
                renderValue={(selected) => {
                  const types = selected as PromoSubscriptionType[];
                  if (!types.length) {
                    return t(
                      "promoCodes.subscriptionTypes.all",
                      "All types"
                    );
                  }
                  return types
                    .map((type) => {
                      const option = PROMO_SUBSCRIPTION_TYPE_OPTIONS.find(
                        (item) => item.value === type
                      );
                      return option
                        ? t(option.labelKey, type)
                        : type;
                    })
                    .join(", ");
                }}>
                {PROMO_SUBSCRIPTION_TYPE_OPTIONS.map((option) => (
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
            </FormControl>
            <FormHelperText>
              {t(
                "promoCodes.subscriptionTypesHint",
                "Leave empty to apply to all subscription lengths."
              )}
            </FormHelperText>
          </Grid>
        </Section>

        <Section title={t("promoCodes.section.schedule", "Schedule & Limits")}>
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
              label='promoCodes.expirationDate'
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
          <Grid item xs={12} md={4}>
            <AppSelectField
              fullWidth
              size='small'
              name='duration'
              labelId='promoCodes.duration'
              label={messages["promoCodes.duration"] as string}
              error={Boolean(errors?.duration)}>
              <MenuItem value={PromoDuration.Once}>
                <IntlMessages id='promoCodes.duration.Once' />
              </MenuItem>
              <MenuItem value={PromoDuration.Repeating}>
                <IntlMessages id='promoCodes.duration.Repeating' />
              </MenuItem>
              <MenuItem value={PromoDuration.Forever}>
                <IntlMessages id='promoCodes.duration.Forever' />
              </MenuItem>
            </AppSelectField>
          </Grid>

          {values.duration === PromoDuration.Repeating && (
            <Grid item xs={12} md={4}>
              <AppTextField
                label={<IntlMessages id='promoCodes.durationInMonths' />}
                name='durationInMonths'
                variant='outlined'
                size='small'
                type='number'
                fullWidth
              />
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <AppTextField
              label={<IntlMessages id='promoCodes.maxRedemptions' />}
              name='maxRedemptions'
              variant='outlined'
              size='small'
              type='number'
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AppTextField
              label={<IntlMessages id='promoCodes.maxRedemptionsPerClient' />}
              name='maxRedemptionsPerClient'
              variant='outlined'
              size='small'
              type='number'
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4} display='flex' alignItems='center'>
            <AppCustomizedSwitch
              defaultChecked={values?.isActive}
              keyName='isActive'
              onChange={setFieldValue}
            />
          </Grid>
        </Section>
      </Grid>
    </Form>
  );
};

export default PromoCodeForm;
