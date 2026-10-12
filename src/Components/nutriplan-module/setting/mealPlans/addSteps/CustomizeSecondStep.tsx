/** @format */

import { Chip, Divider, Grid, Typography } from "@mui/material";
import { FormikErrors, FormikHelpers, FormikTouched } from "formik";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllMealTypesQuery } from "src/pages/nutriplan-module/MealTypes/services/api";
import { ICreateCustomizeMealPlanDto } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypesListDto } from "src/types/modules/nutriplan/mealTypes";

interface ICustomizeSecondStepProps {
  setFieldValue: FormikHelpers<ICreateCustomizeMealPlanDto>["setFieldValue"];
  errors: FormikErrors<ICreateCustomizeMealPlanDto>;
  touched: FormikTouched<ICreateCustomizeMealPlanDto>;
  values: ICreateCustomizeMealPlanDto;
}

const CustomizeSecondStep = (props: ICustomizeSecondStepProps) => {
  const { setFieldValue, errors, touched, values } = props;
  const { messages } = useIntl();

  const {
    changePage: changePageMealTypes,
    data: mealTypesList,
    isFetching: isFetchingMealTypes,
    page: pageMealTypes,
    setSearchValue: setSearchValueMealTypes,
    searchValue: searchValueMealTypes,
  } = usePaginateData<IMealTypesListDto>(useGetAllMealTypesQuery);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Divider
          sx={{ color: "#a5d060", fontWeight: Fonts.SEMI_BOLD }}
          variant='fullWidth'>
          <Chip
            label={messages["sidebar.mealTypes"] as string}
            size='medium'
            color='primary'
            sx={{ fontSize: 17 }}
          />
        </Divider>
      </Grid>

      <Grid item xs={12} md={6}>
        <AppBaseAutoComplete
          multiple
          label='sidebar.mealTypes'
          isLoading={isFetchingMealTypes}
          options={mealTypesList?.data}
          hasNextPage={mealTypesList?.hasNextPage}
          pageNumber={pageMealTypes}
          changePage={changePageMealTypes}
          value={values.mealTypes || []}
          defaultValue={values.mealTypes || []}
          onChangeAutoComplete={(_event, value) => {
            const selected = Array.isArray(value) ? value : [];
            // Avoid validating untouched macro fields when meal types change
            setFieldValue("mealTypes", selected, false);
            setFieldValue(
              "mealTypeIds",
              selected.map((item: { id: string }) => item.id),
              false
            );
            changePageMealTypes(1);
          }}
          searchText={searchValueMealTypes}
          onChangeTextField={(event) => {
            setSearchValueMealTypes(event.target.value);
            changePageMealTypes(1);
          }}
          error={errors?.mealTypeIds}
          touched={touched?.mealTypeIds}
        />
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ display: "block", mt: 0.75, px: 0.5 }}>
          {(messages["mealPlans.customize.mealTypesHint"] as string) ||
            "Selected meal types only available for this plan"}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider
          sx={{ color: "#a5d060", fontWeight: Fonts.SEMI_BOLD }}
          variant='fullWidth'>
          <Chip
            label={
              (messages["mealPlans.customize.macrosCalories"] as string) ||
              "Macros & Calories"
            }
            size='medium'
            color='primary'
            sx={{ fontSize: 17 }}
          />
        </Divider>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body2' color='text.secondary'>
          {(messages["mealPlans.customize.macrosCaloriesHint"] as string) ||
            "Set grams and calories for protein, carbs, and fiber. Pricing stays in Customize Pricing."}
        </Typography>
      </Grid>

      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.customize.proteinGrams' />}
          name='protein.grams'
          variant='outlined'
          size='small'
          type='number'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.customize.proteinCalories' />}
          name='protein.calories'
          variant='outlined'
          size='small'
          type='number'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4} />

      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.customize.carbsGrams' />}
          name='carbs.grams'
          variant='outlined'
          size='small'
          type='number'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.customize.carbsCalories' />}
          name='carbs.calories'
          variant='outlined'
          size='small'
          type='number'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4} />

      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.customize.fiberGrams' />}
          name='fiber.grams'
          variant='outlined'
          size='small'
          type='number'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.customize.fiberCalories' />}
          name='fiber.calories'
          variant='outlined'
          size='small'
          type='number'
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default CustomizeSecondStep;
