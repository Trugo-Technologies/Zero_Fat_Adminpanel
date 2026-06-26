/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllMealsQuery } from "src/pages/nutriplan-module/mealPlanning/meals/services/api";
import { useAddDailyMenuMealsMutation } from "src/pages/nutriplan-module/menuManagement/dailyMenuMeals/services/api";
import { IMealsListDto } from "src/types/modules/nutriplan/mealPlanning/meals";
import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import { ICreateDailyMenuMealsDto } from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import * as yup from "yup";

interface IAddDailyMenuMealProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  date: string;
  mealTypeId: string;
  mealPlanId: string;
  mealPlan?: IMealPlans;
  mealType?: IMealTypes;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddDailyMenuMeal: React.FC<IAddDailyMenuMealProps> = (props) => {
  const {
    showAddModal,
    setShowAddModal,
    label,
    date,
    mealTypeId,
    mealPlanId,
    mealPlan,
    mealType,
  } = props;
  const { menuIdParams } = useParams();

  const [addDailyMenuMealMethod, { isLoading: addLoading, isSuccess }] =
    useAddDailyMenuMealsMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    // nameAr: yup.string().required(String(messages["validation.required"])),
    // nameEn: yup.string().required(String(messages["validation.required"])),
    // recipeId: yup.string().required(String(messages["validation.required"])),
    mealId: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateDailyMenuMealsDto>>(null);

  // const {
  //   changePage: changePageRecipes,
  //   data: recipesList,
  //   isError: isErrorRecipes,
  //   isFetching: isFetchingRecipes,
  //   limit: limitRecipes,
  //   page: pageRecipes,
  //   changeLimit: changeLimitRecipes,
  //   setSearchValue: setSearchValueRecipes,
  //   searchValue: searchValueRecipes,
  //   totalRecords: totalRecordsRecipes,
  //   handleDelete: handleDeleteRecipes,
  //   refetch: refetchRecipes,
  // } = usePaginateData<IRecipesListDto>(useGetAllRecipesQuery);

  const {
    changePage: changePageMeals,
    data: mealsList,
    isError: isErrorMeals,
    isFetching: isFetchingMeals,
    limit: limitMeals,
    page: pageMeals,
    changeLimit: changeLimitMeals,
    setSearchValue: setSearchValueMeals,
    searchValue: searchValueMeals,
    totalRecords: totalRecordsMeals,
    handleDelete: handleDeleteMeals,
    refetch: refetchMeals,
  } = usePaginateData<IMealsListDto>(useGetAllMealsQuery);

  // useEffect(() => {
  //   if (pageRecipes && pageRecipes > 1) refetchRecipes();
  // }, [pageRecipes]);

  useEffect(() => {
    if (pageMeals && pageMeals > 1) refetchMeals();
  }, [pageMeals]);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppAddModal
      label={label}
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      handleSubmit={submit}
      itemName={` - ${getValueBasedOnCurrentLanguage(
        mealPlan?.nameAr!,
        mealPlan?.nameEn!
      )} (${getValueBasedOnCurrentLanguage(
        mealType?.nameAr!,
        mealType?.nameEn!
      )} - ${date})`}
      loadingForAdd={addLoading}
      maxWidth={"sm"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          date: dateFormatInBackendPayload(date),
          mealPlanId: mealPlanId || "",
          mealTypeId: mealTypeId || "",
          menuId: menuIdParams || "",
          mealId: "",
          isDefault: false,
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={addDailyMenuMealMethod}>
        {({ errors, values, setFieldValue, touched }) => (
          <Form>
            <Grid container spacing={4}>
              {/* <Grid item xs={4}>
                  <AppTextField
                    label={<IntlMessages id="common.nameAr" />}
                    name="nameAr"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={4}>
                  <AppTextField
                    label={<IntlMessages id="common.nameEn" />}
                    name="nameEn"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid> */}

              <Grid item xs={4}>
                <AppBaseAutoComplete
                  label='sidebar.meals'
                  isLoading={isFetchingMeals}
                  options={mealsList?.data}
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

              {/* <Grid item xs={4}>
                  <AppBaseAutoComplete
                    label="recipes.name"
                    isLoading={isFetchingRecipes}
                    options={recipesList?.data}
                    hasNextPage={recipesList?.hasNextPage}
                    pageNumber={pageRecipes}
                    changePage={changePageRecipes}
                    onChangeAutoComplete={(event, value) => {
                      setFieldValue("recipeId", value ? value?.id : "");
                      changePageRecipes(1);
                    }}
                    searchText={searchValueRecipes}
                    onChangeTextField={(value) => {
                      setSearchValueRecipes(value.target.value);
                      changePageRecipes(1);
                    }}
                    error={errors.recipeId}
                    touched={touched.recipeId}
                  />
                </Grid> */}
              <Grid item xs={4}>
                <AppCheckbox
                  keyName='isDefault'
                  label='dailyMenuMeals.isDefault'
                  defaultChecked={values?.isDefault}
                  onChange={setFieldValue}
                />
              </Grid>
              {/* 
                <Grid item xs={12}>
                  <AppImageField
                    name="image"
                    label="common.image"
                    placeholder=""
                  />
                </Grid> */}
            </Grid>
          </Form>
        )}
      </Formik>
    </AppAddModal>
  );
};

export default AddDailyMenuMeal;
