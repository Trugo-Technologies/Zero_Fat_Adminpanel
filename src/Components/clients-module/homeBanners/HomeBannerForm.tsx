/** @format */

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { Form, useFormikContext } from "formik";
import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import {
  isExcludedCustomizeMealType,
} from "src/pages/clients-module/clientAccountAccess/mealPlanHelpers";
import { useGetAllMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import { useGetAllMealTypesQuery } from "src/pages/nutriplan-module/MealTypes/services/api";
import { PreferredDeliveryTime } from "src/types/modules/clientsManagement/clientSubscriptions";
import {
  getHomeBannerMealsPerDay,
  HomeBannerAudience,
  HomeBannerDeliveryDay,
  HomeBannerSubscriptionPlan,
  HOME_BANNER_DELIVERY_DAY_OPTIONS,
  HOME_BANNER_DELIVERY_TIME_OPTIONS,
  HOME_BANNER_DISABLED_DELIVERY_DAYS,
  HOME_BANNER_MAX_DELIVERY_DAYS,
  HOME_BANNER_MAX_MEAL_QUANTITY,
  HOME_BANNER_MIN_DELIVERY_DAYS,
  HOME_BANNER_SUBSCRIPTION_PLAN_DAYS,
  HOME_BANNER_SUBSCRIPTION_PLAN_MAX_DAYS,
  IHomeBannerFormValues,
  IHomeBannerMealTypeSelection,
  syncHomeBannerMealMacros,
} from "src/types/modules/clientsManagement/homeBanners";
import { isCustomizeMealPlanRow } from "src/types/modules/nutriplan/mealPlans";

const fieldAlignSx = {
  display: "flex",
  alignItems: "center",
  minHeight: 40,
};

const HomeBannerForm: React.FC = () => {
  const { messages, locale } = useIntl();
  const { values, setFieldValue, errors, touched } =
    useFormikContext<IHomeBannerFormValues>();

  const t = (key: string, fallback: string) =>
    (messages[key] as string) || fallback;

  const { data: mealPlansData } = useGetAllMealPlansQuery({
    pageNumber: 1,
    pageSize: 200,
    isActive: true,
  });
  const { data: mealTypesData } = useGetAllMealTypesQuery({
    pageNumber: 1,
    pageSize: 200,
    isActive: true,
  });

  const mealPlans = useMemo(
    () => mealPlansData?.data ?? [],
    [mealPlansData?.data]
  );
  const mealTypes = useMemo(
    () => mealTypesData?.data ?? [],
    [mealTypesData?.data]
  );

  const selectedMealPlanId = values.planIds?.[0] || "";
  const selectedMealPlan = useMemo(
    () => mealPlans.find((plan) => plan.id === selectedMealPlanId),
    [mealPlans, selectedMealPlanId]
  );
  /** False while a selected plan id is waiting to appear in the meal-plans list */
  const planResolved = !selectedMealPlanId || !!selectedMealPlan;
  const isCustomize = isCustomizeMealPlanRow(selectedMealPlan);
  /** Show macros when Customize is known, or while edit is loading and macros already exist */
  const showCustomizeMacros =
    isCustomize ||
    (!planResolved &&
      (values.proteinGrams !== "" ||
        values.carbsGrams !== "" ||
        values.fiberGrams !== ""));

  useEffect(() => {
    // Don't clear edit macros before the selected meal plan is resolved
    if (!planResolved) return;

    setFieldValue("_isCustomizePlan", isCustomize, false);
    if (!isCustomize) {
      setFieldValue("proteinGrams", "", false);
      setFieldValue("carbsGrams", "", false);
      setFieldValue("fiberGrams", "", false);
    }
  }, [isCustomize, planResolved, setFieldValue]);

  const availableMealTypes = useMemo(() => {
    if (!isCustomize || !selectedMealPlan) return mealTypes;
    const fromPlan =
      selectedMealPlan.mealPlanMealTypes
        ?.map((item) => item.mealType)
        .filter(Boolean) || [];
    return fromPlan.filter(
      (mealType) => mealType && !isExcludedCustomizeMealType(mealType)
    ) as typeof mealTypes;
  }, [isCustomize, selectedMealPlan, mealTypes]);

  // Ensure each Customize meal type has one macro row per quantity unit
  useEffect(() => {
    if (!showCustomizeMacros) return;
    const selections = values.mealTypeSelections || [];
    if (!selections.length) return;

    let changed = false;
    const next = selections.map((sel) => {
      const qty = Math.max(1, sel.quantityPerDay || 1);
      const synced = syncHomeBannerMealMacros(qty, sel.macros);
      if (
        !sel.macros ||
        sel.macros.length !== synced.length ||
        sel.quantityPerDay !== qty
      ) {
        changed = true;
        return { ...sel, quantityPerDay: qty, macros: synced };
      }
      return sel;
    });
    if (changed) {
      setFieldValue("mealTypeSelections", next, false);
    }
  }, [setFieldValue, showCustomizeMacros, values.mealTypeSelections]);

  // Fill missing meal-type names (edit load when API returns name: null)
  useEffect(() => {
    const selections = values.mealTypeSelections || [];
    if (!selections.length || !mealTypes.length) return;

    let changed = false;
    const next = selections.map((item) => {
      if (item.mealTypeNameEn || item.mealTypeNameAr) return item;
      const mealType =
        mealTypes.find((m) => m.id === item.mealTypeId) ||
        availableMealTypes.find((m) => m.id === item.mealTypeId);
      if (!mealType) return item;
      changed = true;
      return {
        ...item,
        mealTypeNameEn: mealType.nameEn || null,
        mealTypeNameAr: mealType.nameAr || null,
      };
    });
    if (changed) {
      setFieldValue("mealTypeSelections", next, false);
    }
  }, [
    availableMealTypes,
    mealTypes,
    setFieldValue,
    values.mealTypeSelections,
  ]);

  const mealTypeLabel = (id: string) => {
    const mealType =
      mealTypes.find((m) => m.id === id) ||
      availableMealTypes.find((m) => m.id === id);
    if (!mealType) return id;
    return locale === "en-US" ? mealType.nameEn : mealType.nameAr;
  };

  const syncMealTypeSelections = (ids: string[]) => {
    const existing = values.mealTypeSelections || [];
    const next: IHomeBannerMealTypeSelection[] = ids.map((id) => {
      const found = existing.find((item) => item.mealTypeId === id);
      const mealType =
        mealTypes.find((m) => m.id === id) ||
        availableMealTypes.find((m) => m.id === id);
      const quantityPerDay = found?.quantityPerDay || 1;
      return {
        mealTypeId: id,
        quantityPerDay,
        mealTypeNameEn:
          found?.mealTypeNameEn || mealType?.nameEn || null,
        mealTypeNameAr:
          found?.mealTypeNameAr || mealType?.nameAr || null,
        macros: syncHomeBannerMealMacros(quantityPerDay, found?.macros),
      };
    });
    setFieldValue("mealTypeIds", ids);
    setFieldValue("mealTypeSelections", next);
    setFieldValue("mealsPerDay", getHomeBannerMealsPerDay(next));
  };

  const updateMealQuantity = (mealTypeId: string, delta: number) => {
    const next = (values.mealTypeSelections || []).map((item) => {
      if (item.mealTypeId !== mealTypeId) return item;
      const quantity = Math.min(
        HOME_BANNER_MAX_MEAL_QUANTITY,
        Math.max(1, (item.quantityPerDay || 1) + delta)
      );
      return {
        ...item,
        quantityPerDay: quantity,
        macros: syncHomeBannerMealMacros(quantity, item.macros),
      };
    });
    setFieldValue("mealTypeSelections", next);
    setFieldValue("mealsPerDay", getHomeBannerMealsPerDay(next));
  };

  const toggleDeliveryDay = (day: HomeBannerDeliveryDay) => {
    if (
      HOME_BANNER_DISABLED_DELIVERY_DAYS.includes(
        day as (typeof HOME_BANNER_DISABLED_DELIVERY_DAYS)[number]
      )
    ) {
      return;
    }
    const current = values.deliveryDays || [];
    const isSelected = current.includes(day);
    const nextDays = isSelected
      ? current.filter((d) => d !== day)
      : current.length >= HOME_BANNER_MAX_DELIVERY_DAYS
        ? current
        : [...current, day];

    if (!isSelected && current.length >= HOME_BANNER_MAX_DELIVERY_DAYS) {
      return;
    }

    setFieldValue("deliveryDays", nextDays);
    // Weekly Days = number of selected delivery weekdays
    if (
      values.subscriptionPlanType === HomeBannerSubscriptionPlan.Weekly
    ) {
      setFieldValue("durationDays", nextDays.length);
    }
  };

  const getDurationDaysForPlan = (
    plan: HomeBannerSubscriptionPlan,
    deliveryDays: number[]
  ) => {
    if (plan === HomeBannerSubscriptionPlan.Weekly) {
      const count = deliveryDays?.length || 0;
      if (
        count >= HOME_BANNER_MIN_DELIVERY_DAYS &&
        count <= HOME_BANNER_MAX_DELIVERY_DAYS
      ) {
        return count;
      }
      return HOME_BANNER_SUBSCRIPTION_PLAN_DAYS[plan];
    }
    return HOME_BANNER_SUBSCRIPTION_PLAN_DAYS[plan];
  };

  const deliveryDaysError =
    touched.deliveryDays && errors.deliveryDays
      ? String(errors.deliveryDays)
      : "";

  const mealTypeError =
    touched.mealTypeIds && errors.mealTypeIds
      ? String(errors.mealTypeIds)
      : touched.mealTypeSelections && errors.mealTypeSelections
        ? String(errors.mealTypeSelections)
        : "";

  return (
    <Form>
      <Grid container spacing={3} alignItems='flex-start'>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size='small'>
            <InputLabel id='home-banner-plans-label' shrink>
              {t("homeBanners.mealPlan", "Meal Plan")}
            </InputLabel>
            <Select
              labelId='home-banner-plans-label'
              value={selectedMealPlanId}
              displayEmpty
              onChange={(e) => {
                const value = e.target.value as string;
                setFieldValue("planIds", value ? [value] : []);
                // Reset meal types when plan changes
                setFieldValue("mealTypeIds", []);
                setFieldValue("mealTypeSelections", []);
                setFieldValue("mealsPerDay", 0);
                setFieldValue("proteinGrams", "");
                setFieldValue("carbsGrams", "");
                setFieldValue("fiberGrams", "");
              }}
              input={
                <OutlinedInput
                  notched
                  label={t("homeBanners.mealPlan", "Meal Plan")}
                />
              }
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Box component='span' sx={{ color: "text.secondary" }}>
                      {t("homeBanners.mealPlan.all", "Select meal plan")}
                    </Box>
                  );
                }
                const plan = mealPlans.find((p) => p.id === selected);
                if (!plan) return String(selected);
                return locale === "en-US" ? plan.nameEn : plan.nameAr;
              }}>
              {mealPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {locale === "en-US" ? plan.nameEn : plan.nameAr}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth size='small' error={!!mealTypeError}>
            <InputLabel id='home-banner-meal-types-label' shrink>
              {t("homeBanners.mealType", "Meal Type")}
            </InputLabel>
            <Select
              labelId='home-banner-meal-types-label'
              multiple
              displayEmpty
              value={values.mealTypeIds || []}
              onChange={(e) => {
                const value = e.target.value;
                const ids =
                  typeof value === "string" ? value.split(",") : value;
                syncMealTypeSelections(ids as string[]);
              }}
              input={
                <OutlinedInput
                  notched
                  label={t("homeBanners.mealType", "Meal Type")}
                />
              }
              renderValue={(selected) => {
                const ids = selected as string[];
                if (!ids.length) {
                  return (
                    <Box component='span' sx={{ color: "text.secondary" }}>
                      {t("homeBanners.mealType.all", "Select meal type(s)")}
                    </Box>
                  );
                }
                return ids.map(mealTypeLabel).join(", ");
              }}>
              {availableMealTypes.map((mealType) => (
                <MenuItem key={mealType.id} value={mealType.id}>
                  <Checkbox
                    checked={(values.mealTypeIds || []).includes(mealType.id)}
                    size='small'
                  />
                  <ListItemText
                    primary={
                      locale === "en-US" ? mealType.nameEn : mealType.nameAr
                    }
                  />
                </MenuItem>
              ))}
            </Select>
            {mealTypeError ? (
              <FormHelperText>{mealTypeError}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>

        {(values.mealTypeSelections || []).length > 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: 2,
                bgcolor: "#F8FAFC",
                px: 2,
                py: 1.75,
              }}>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                mb={1.25}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}>
                  {showCustomizeMacros
                    ? t(
                        "homeBanners.mealTypeQuantitiesCustomize",
                        "Meal types & macros"
                      )
                    : t(
                        "homeBanners.mealTypeQuantities",
                        "Meal type quantities"
                      )}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {t("homeBanners.mealsPerDay", "Meals / Day")}:{" "}
                  <Box
                    component='span'
                    sx={{ fontWeight: 700, color: "text.primary" }}>
                    {values.mealsPerDay || 0}
                  </Box>
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {(values.mealTypeSelections || []).map((selection, index) => {
                  const quantity = selection.quantityPerDay || 1;
                  const macros = syncHomeBannerMealMacros(
                    quantity,
                    selection.macros
                  );
                  const label = mealTypeLabel(selection.mealTypeId);
                  return (
                    <Box
                      key={selection.mealTypeId}
                      sx={{
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 1.5,
                        border: "1px solid #E2E8F0",
                        bgcolor: "#fff",
                      }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          mb: showCustomizeMacros ? 1.5 : 0,
                        }}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "text.primary",
                          }}>
                          {label}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #E2E8F0",
                            borderRadius: 1.5,
                            bgcolor: "#F8FAFC",
                          }}>
                          <IconButton
                            size='small'
                            onClick={() =>
                              updateMealQuantity(selection.mealTypeId, -1)
                            }
                            disabled={quantity <= 1}
                            sx={{ p: 0.75 }}>
                            <RemoveIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Typography
                            sx={{
                              minWidth: 32,
                              textAlign: "center",
                              fontSize: 14,
                              fontWeight: 700,
                            }}>
                            {quantity}
                          </Typography>
                          <IconButton
                            size='small'
                            onClick={() =>
                              updateMealQuantity(selection.mealTypeId, 1)
                            }
                            disabled={quantity >= HOME_BANNER_MAX_MEAL_QUANTITY}
                            sx={{ p: 0.75 }}>
                            <AddIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      {showCustomizeMacros ? (
                        <Stack spacing={1.5}>
                          {macros.map((_, macroIndex) => (
                            <Box key={`${selection.mealTypeId}-${macroIndex}`}>
                              {quantity > 1 ? (
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "text.secondary",
                                    mb: 1,
                                  }}>
                                  {label} {macroIndex + 1}
                                </Typography>
                              ) : null}
                              <Grid container spacing={1.5}>
                                <Grid item xs={12} sm={4}>
                                  <AppTextField
                                    label={t(
                                      "homeBanners.proteinGrams",
                                      "Protein (g)"
                                    )}
                                    name={`mealTypeSelections[${index}].macros[${macroIndex}].proteinGrams`}
                                    variant='outlined'
                                    size='small'
                                    type='number'
                                    fullWidth
                                    inputProps={{ min: 0, step: 1 }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <AppTextField
                                    label={t(
                                      "homeBanners.carbsGrams",
                                      "Carbs (g)"
                                    )}
                                    name={`mealTypeSelections[${index}].macros[${macroIndex}].carbsGrams`}
                                    variant='outlined'
                                    size='small'
                                    type='number'
                                    fullWidth
                                    inputProps={{ min: 0, step: 1 }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <AppTextField
                                    label={t(
                                      "homeBanners.fiberGrams",
                                      "Fiber (g)"
                                    )}
                                    name={`mealTypeSelections[${index}].macros[${macroIndex}].fiberGrams`}
                                    variant='outlined'
                                    size='small'
                                    type='number'
                                    fullWidth
                                    inputProps={{ min: 0, step: 1 }}
                                    helperText={t(
                                      "common.optional",
                                      "Optional"
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          ))}
                        </Stack>
                      ) : null}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Grid>
        ) : showCustomizeMacros ? (
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {t(
                "homeBanners.customizeMacrosSelectMeals",
                "Select meal type(s) to set protein, carbs, and fiber for each."
              )}
            </Typography>
          </Grid>
        ) : null}

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='home-banner-audience-label'>
              {t("homeBanners.audience", "Audience")}
            </InputLabel>
            <Select
              labelId='home-banner-audience-label'
              value={values.audienceType || HomeBannerAudience.All}
              onChange={(e) =>
                setFieldValue(
                  "audienceType",
                  e.target.value as HomeBannerAudience
                )
              }
              input={
                <OutlinedInput
                  label={t("homeBanners.audience", "Audience")}
                />
              }>
              <MenuItem value={HomeBannerAudience.All}>
                {t("homeBanners.audience.All", "All")}
              </MenuItem>
              <MenuItem value={HomeBannerAudience.FirstTime}>
                {t("homeBanners.audience.FirstTime", "First time")}
              </MenuItem>
              <MenuItem value={HomeBannerAudience.Expired}>
                {t("homeBanners.audience.Expired", "Expired")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='home-banner-subscription-plan-label'>
              {t("homeBanners.subscriptionPlan", "Plan Duration")}
            </InputLabel>
            <Select
              labelId='home-banner-subscription-plan-label'
              value={
                values.subscriptionPlanType ||
                HomeBannerSubscriptionPlan.OneMonth
              }
              onChange={(e) => {
                const next = e.target.value as HomeBannerSubscriptionPlan;
                setFieldValue("subscriptionPlanType", next);
                setFieldValue(
                  "durationDays",
                  getDurationDaysForPlan(next, values.deliveryDays || [])
                );
              }}
              input={
                <OutlinedInput
                  label={t("homeBanners.subscriptionPlan", "Plan Duration")}
                />
              }>
              <MenuItem value={HomeBannerSubscriptionPlan.Weekly}>
                {t("homeBanners.subscriptionPlan.Weekly", "Weekly")}
              </MenuItem>
              <MenuItem value={HomeBannerSubscriptionPlan.OneMonth}>
                {t("homeBanners.subscriptionPlan.OneMonth", "1 Month")}
              </MenuItem>
              <MenuItem value={HomeBannerSubscriptionPlan.ThreeMonths}>
                {t("homeBanners.subscriptionPlan.ThreeMonths", "3 Months")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='home-banner-delivery-time-label'>
              {t("homeBanners.deliveryTime", "Delivery Time")}
            </InputLabel>
            <Select
              labelId='home-banner-delivery-time-label'
              value={
                values.preferredDeliveryTime ||
                PreferredDeliveryTime.EarlyMorning
              }
              onChange={(e) =>
                setFieldValue("preferredDeliveryTime", e.target.value)
              }
              input={
                <OutlinedInput
                  label={t("homeBanners.deliveryTime", "Delivery Time")}
                />
              }>
              {HOME_BANNER_DELIVERY_TIME_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.labelKey, option.fallback)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              mb: 0.5,
              color: "text.secondary",
            }}>
            {t("homeBanners.deliveryDays", "Delivery Days")}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>
            {t(
              "homeBanners.deliveryDaysHint",
              `Select ${HOME_BANNER_MIN_DELIVERY_DAYS}–${HOME_BANNER_MAX_DELIVERY_DAYS} weekdays (Saturday not available)`
            )}
            {" — "}
            {(values.deliveryDays || []).length} selected
          </Typography>
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            {HOME_BANNER_DELIVERY_DAY_OPTIONS.map((day) => {
              const isDisabled = HOME_BANNER_DISABLED_DELIVERY_DAYS.includes(
                day.value as (typeof HOME_BANNER_DISABLED_DELIVERY_DAYS)[number]
              );
              const isSelected = (values.deliveryDays || []).includes(
                day.value
              );
              const atMax =
                !isSelected &&
                (values.deliveryDays || []).length >=
                  HOME_BANNER_MAX_DELIVERY_DAYS;
              return (
                <Button
                  key={day.value}
                  size='small'
                  variant={isSelected ? "contained" : "outlined"}
                  disabled={isDisabled || atMax}
                  onClick={() => toggleDeliveryDay(day.value)}
                  sx={{
                    minWidth: 72,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    borderColor: "#E2E8F0",
                    color: isSelected ? "#fff" : "#0F172A",
                    bgcolor: isSelected ? "primary.main" : "#fff",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: isSelected
                        ? "primary.dark"
                        : alpha("#10B981", 0.06),
                    },
                  }}>
                  {t(day.labelKey, day.fallback)}
                </Button>
              );
            })}
          </Stack>
          {deliveryDaysError ? (
            <FormHelperText error sx={{ mx: 0, mt: 1 }}>
              {deliveryDaysError}
            </FormHelperText>
          ) : (values.deliveryDays || []).length > 0 &&
            ((values.deliveryDays || []).length <
              HOME_BANNER_MIN_DELIVERY_DAYS ||
              (values.deliveryDays || []).length >
                HOME_BANNER_MAX_DELIVERY_DAYS) ? (
            <FormHelperText error sx={{ mx: 0, mt: 1 }}>
              {`Select ${HOME_BANNER_MIN_DELIVERY_DAYS}–${HOME_BANNER_MAX_DELIVERY_DAYS} delivery days`}
            </FormHelperText>
          ) : null}
        </Grid>

        <Grid item xs={12} md={4}>
          <AppTextField
            label={<IntlMessages id='homeBanners.mealsPerDay' />}
            name='mealsPerDay'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
            disabled
            helperText={t(
              "homeBanners.mealsPerDayHint",
              "Sum of meal type quantities"
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AppTextField
            label={<IntlMessages id='homeBanners.snacksPerDay' />}
            name='snacksPerDay'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AppTextField
            label={<IntlMessages id='homeBanners.durationDays' />}
            name='durationDays'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
          <FormHelperText sx={{ mx: 0, mt: 0.5 }}>
            {(() => {
              const plan =
                values.subscriptionPlanType ||
                HomeBannerSubscriptionPlan.OneMonth;
              if (plan === HomeBannerSubscriptionPlan.Weekly) {
                return t(
                  "homeBanners.durationDaysWeeklyHint",
                  "For Weekly, Days matches selected delivery days"
                );
              }
              const min = HOME_BANNER_SUBSCRIPTION_PLAN_DAYS[plan];
              const max = HOME_BANNER_SUBSCRIPTION_PLAN_MAX_DAYS[plan];
              return `${t("homeBanners.durationDaysHint", "Suggested range")} ${min}–${max}`;
            })()}
          </FormHelperText>
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='homeBanners.originalPrice' />}
            name='originalPrice'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='homeBanners.salePrice' />}
            name='salePrice'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <AppTextField
            label={<IntlMessages id='homeBanners.sortOrder' />}
            name='sortOrder'
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} sx={fieldAlignSx}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!values.freeDelivery}
                onChange={(e) =>
                  setFieldValue("freeDelivery", e.target.checked)
                }
                size='small'
              />
            }
            label={t("homeBanners.freeDelivery", "Free delivery")}
            sx={{ m: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={fieldAlignSx}>
          <AppCustomizedSwitch
            defaultChecked={values?.isActive}
            keyName='isActive'
            onChange={setFieldValue}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='common.nameEn' />}
            name='titleEn'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='common.nameAr' />}
            name='titleAr'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='homeBanners.descriptionEn' />}
            name='descriptionEn'
            variant='outlined'
            size='small'
            fullWidth
            multiline
            minRows={2}
            placeholder='e.g. Free delivery included'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='homeBanners.descriptionAr' />}
            name='descriptionAr'
            variant='outlined'
            size='small'
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='homeBanners.badgeTextEn' />}
            name='badgeTextEn'
            variant='outlined'
            size='small'
            fullWidth
            placeholder='e.g. 15% OFF'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='homeBanners.badgeTextAr' />}
            name='badgeTextAr'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
            <IntlMessages id='homeBanners.image' />
          </Typography>
          <Box
            sx={{
              "& > .MuiBox-root": { top: "0 !important" },
              "& > .MuiBox-root > .MuiBox-root": {
                minHeight: "200px !important",
                height: "200px !important",
                py: 3,
              },
              "& img": {
                width: "80% !important",
                maxHeight: "160px !important",
              },
            }}>
            <AppImageField
              name='image'
              label='homeBanners.image'
              placeholder='homeBanners.imageHint'
              accept='image/*'
              height={200}
            />
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
};

export default HomeBannerForm;
