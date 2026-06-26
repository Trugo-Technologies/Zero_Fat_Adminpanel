/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  useEditMealMutation,
  useGetMealQuery,
} from "src/pages/nutriplan-module/mealPlanning/meals/services/api";
import { useGetAllRecipesQuery } from "src/pages/nutriplan-module/mealPlanning/recipes/services/api";

import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateMealDto } from "src/types/modules/nutriplan/mealPlanning/meals";
import { IRecipesListDto } from "src/types/modules/nutriplan/mealPlanning/recipes";
import * as yup from "yup";

interface IEditMealProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditMeal: React.FC<IEditMealProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: mealItem, isLoading: detailsLoading } = useGetMealQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updateMeal, { isLoading: editLoading, isSuccess, error }] =
    useEditMealMutation();

  const refForm = React.useRef<FormikProps<IUpdateMealDto>>(null);

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    recipeId: yup.string().required(String(messages["validation.required"])),
    priceForCustomer: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"])),
  });

  const {
    changePage: changePageRecipes,
    data: recipesList,
    isError: isErrorRecipes,
    isFetching: isFetchingRecipes,
    limit: limitRecipes,
    page: pageRecipes,
    changeLimit: changeLimitRecipes,
    setSearchValue: setSearchValueRecipes,
    searchValue: searchValueRecipes,
    totalRecords: totalRecordsRecipes,
    handleDelete: handleDeleteRecipes,
    refetch: refetchRecipes,
  } = usePaginateData<IRecipesListDto>(useGetAllRecipesQuery);

  useEffect(() => {
    if (pageRecipes && pageRecipes > 1) refetchRecipes();
  }, [pageRecipes]);
  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppEditModal
      label={label}
      itemName={
        locale == "en-US" && mealItem?.data?.nameEn!
          ? `- ${mealItem?.data?.nameEn!}`
          : `- ${mealItem?.data?.nameAr!}`
      }
      open={showEditModal}
      onClose={() => {
        setShowEditModal(false);
      }}
      handleSubmit={submit}
      loading={detailsLoading}
      errorMessage={""}
      loadingForEdit={editLoading}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow?.id || "",
          nameAr: mealItem?.data?.nameAr || "",
          nameEn: mealItem?.data?.nameEn || "",
          image: mealItem?.data?.imageUrl || "",
          imageUrl: mealItem?.data?.imageUrl || "",
          priceForCustomer: mealItem?.data?.priceForCustomer || null,
          recipeId: mealItem?.data?.recipe?.id || "",
          isAddOn: mealItem?.data?.isAddOn || false,
          // isDefault: mealItem?.data?.isDefault || false,
          suitableForFreezing: mealItem?.data?.suitableForFreezing || false,
          isActive: mealItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateMeal({ id: selectedRow?.id, data });
        }}>
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='common.nameAr' />}
                  name='nameAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='common.nameEn' />}
                  name='nameEn'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <AppBaseAutoComplete
                  label='recipes.name'
                  isLoading={isFetchingRecipes}
                  options={recipesList?.data}
                  hasNextPage={recipesList?.hasNextPage}
                  pageNumber={pageRecipes}
                  changePage={changePageRecipes}
                  onChangeAutoComplete={(event, value) => {
                    setFieldValue("recipeId", value ? value?.id : "");
                    changePageRecipes(1);
                  }}
                  defaultValue={mealItem?.data?.recipe}
                  searchText={searchValueRecipes}
                  onChangeTextField={(value) => {
                    setSearchValueRecipes(value.target.value);
                    changePageRecipes(1);
                  }}
                  error={errors.recipeId}
                  touched={touched.recipeId}
                />
              </Grid>
              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='meals.priceForCustomer' />}
                  name='priceForCustomer'
                  variant='outlined'
                  size='small'
                  type='number'
                  fullWidth
                />
              </Grid>

              {/* <Grid item>
                <AppCheckbox
                  keyName="isDefault"
                  label="dailyMenuMeals.isDefault"
                  defaultChecked={values?.isDefault}
                  onChange={setFieldValue}
                />
              </Grid> */}
              <Grid item>
                <AppCheckbox
                  keyName='isAddOn'
                  label='meals.isAddOn'
                  defaultChecked={values?.isAddOn}
                  onChange={setFieldValue}
                />
              </Grid>
              <Grid item>
                <AppCheckbox
                  keyName='suitableForFreezing'
                  label='recipes.suitableForFreezing'
                  defaultChecked={values?.suitableForFreezing}
                  onChange={setFieldValue}
                />
              </Grid>

              <Grid item xs={3} display={"flex"} justifyContent={"flex-start"}>
                <AppCustomizedSwitch
                  defaultChecked={values?.isActive}
                  keyName='isActive'
                  onChange={setFieldValue}
                />
              </Grid>

              <Grid item xs={12}>
                <AppImageField
                  name='image'
                  label='common.image'
                  placeholder=''
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditMeal;
