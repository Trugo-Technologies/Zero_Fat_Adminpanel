/** @format */

import { Grid } from "@mui/material";
import { Form, useFormikContext } from "formik";
import React, { useEffect } from "react";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import {
  ICreateCustomizationOptionDto,
  IUpdateCustomizationOptionDto,
} from "src/types/modules/nutriplan/mealPlanning/customizationOptions";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import { usePaginateData } from "src/hooks/use-paginate-data";

import { useGetAllIngredientsQuery } from "src/pages/nutriplan-module/ingredients/services/api";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import {
  ICustomizationGroupsListDto,
  ICustomizationGroup,
} from "src/types/modules/nutriplan/mealPlanning/customizationGroups";
import { useGetAllCustomizationGroupsQuery } from "src/pages/nutriplan-module/mealPlanning/customizationGroups/services/api";
import {
  IMealsListDto,
  IMeals,
} from "src/types/modules/nutriplan/mealPlanning/meals";
import { useGetAllMealsQuery } from "src/pages/nutriplan-module/mealPlanning/meals/services/api";
import { useParams } from "react-router-dom";
import {
  IIngredientsListDto,
  IIngredients,
} from "src/types/modules/nutriplan/mealPlanning/ingredients";

interface IProps {
  defaultMeal: IMeals | null;
  defaultIngredient: IIngredients | null;
  defaultGroup: ICustomizationGroup | null;
}

const CustomizationOptionsForm: React.FC<IProps> = (props) => {
  const { defaultGroup, defaultIngredient, defaultMeal } = props;
  const { mealIdParams } = useParams();

  const { values, setFieldValue, errors, touched } = useFormikContext<
    ICreateCustomizationOptionDto | IUpdateCustomizationOptionDto
  >();

  const {
    changePage: changePageIngredients,
    data: ingredientsList,
    isFetching: isFetchingIngredients,
    page: pageIngredients,
    setSearchValue: setSearchValueIngredients,
    searchValue: searchValueIngredients,
    refetch: refetchIngredients,
  } = usePaginateData<IIngredientsListDto>(useGetAllIngredientsQuery);

  const {
    changePage: changePageGroups,
    data: groupsList,
    isFetching: isFetchingGroups,
    page: pageGroups,
    setSearchValue: setSearchValueGroups,
    searchValue: searchValueGroups,
    refetch: refetchGroups,
  } = usePaginateData<ICustomizationGroupsListDto>(
    useGetAllCustomizationGroupsQuery
  );

  const {
    changePage: changePageMeals,
    data: mealsList,
    isFetching: isFetchingMeals,
    page: pageMeals,
    setSearchValue: setSearchValueMeals,
    searchValue: searchValueMeals,
    refetch: refetchMeals,
  } = usePaginateData<IMealsListDto>(useGetAllMealsQuery);

  useEffect(() => {
    if (pageIngredients && pageIngredients > 1) refetchIngredients();
  }, [pageIngredients]);

  useEffect(() => {
    if (pageGroups && pageGroups > 1) refetchGroups();
  }, [pageGroups]);

  useEffect(() => {
    if (pageMeals && pageMeals > 1) refetchMeals();
  }, [pageMeals]);

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

        <Grid item xs={6}>
          <AppBaseAutoComplete
            label='ingredients.name'
            isLoading={isFetchingIngredients}
            options={ingredientsList?.data}
            defaultValue={defaultIngredient}
            hasNextPage={ingredientsList?.hasNextPage}
            pageNumber={pageIngredients}
            changePage={changePageIngredients}
            onChangeAutoComplete={(_, value) => {
              setFieldValue("ingredientId", value ? value?.id : "");
              changePageIngredients(1);
            }}
            searchText={searchValueIngredients}
            onChangeTextField={(value) => {
              setSearchValueIngredients(value.target.value);
              changePageIngredients(1);
            }}
            error={errors.ingredientId}
            touched={touched.ingredientId}
          />
        </Grid>

        <Grid item xs={6}>
          <AppBaseAutoComplete
            label='customizationGroups.name'
            isLoading={isFetchingGroups}
            options={groupsList?.data}
            defaultValue={defaultGroup}
            hasNextPage={groupsList?.hasNextPage}
            pageNumber={pageGroups}
            changePage={changePageGroups}
            onChangeAutoComplete={(_, value) => {
              setFieldValue("groupId", value ? value?.id : "");
              changePageGroups(1);
            }}
            searchText={searchValueGroups}
            onChangeTextField={(value) => {
              setSearchValueGroups(value.target.value);
              changePageGroups(1);
            }}
            error={errors.groupId}
            touched={touched.groupId}
          />
        </Grid>

        {!mealIdParams && (
          <>
            <Grid item xs={2}>
              <AppCheckbox
                keyName='isAllMeals'
                label='customizationOptions.isAllMeals'
                defaultChecked={values?.isAllMeals}
                onChange={(f, val) => {
                  setFieldValue("mealId", "");
                  setFieldValue(f, val);
                }}
              />
            </Grid>

            {!values?.isAllMeals && (
              <Grid item xs={4}>
                <AppBaseAutoComplete
                  key='mealId'
                  label='sidebar.meals'
                  isLoading={isFetchingMeals}
                  options={mealsList?.data}
                  defaultValue={defaultMeal}
                  hasNextPage={mealsList?.hasNextPage}
                  pageNumber={pageMeals}
                  changePage={changePageMeals}
                  onChangeAutoComplete={(_, value) => {
                    setFieldValue("mealId", value ? value?.id : "");
                    changePageMeals(1);
                  }}
                  searchText={searchValueMeals}
                  onChangeTextField={(value) => {
                    setSearchValueMeals(value.target.value);
                    changePageMeals(1);
                  }}
                  error={errors.mealId}
                  touched={touched.mealId}
                />
              </Grid>
            )}
          </>
        )}

        <Grid item xs={6}>
          <AppCheckbox
            keyName='isDefault'
            label='customizationOptions.isDefault'
            defaultChecked={values?.isDefault}
            onChange={setFieldValue}
          />
        </Grid>
        <Grid item xs={6}>
          <AppTextField
            label={<IntlMessages id='customizationOptions.priceAdjustment' />}
            name='priceAdjustment'
            type='number'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <AppTextField
            label={
              <IntlMessages id='customizationOptions.caloriesAdjustment' />
            }
            name='caloriesAdjustment'
            variant='outlined'
            type='number'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <AppTextField
            label={<IntlMessages id='customizationOptions.fatAdjustment' />}
            name='fatAdjustment'
            variant='outlined'
            type='number'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <AppTextField
            label={<IntlMessages id='customizationOptions.carbsAdjustment' />}
            name='carbsAdjustment'
            variant='outlined'
            type='number'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <AppTextField
            label={<IntlMessages id='customizationOptions.proteinAdjustment' />}
            name='proteinAdjustment'
            variant='outlined'
            type='number'
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <AppImageField name='image' label='common.image' placeholder='' />
        </Grid>
      </Grid>
    </Form>
  );
};

export default CustomizationOptionsForm;
