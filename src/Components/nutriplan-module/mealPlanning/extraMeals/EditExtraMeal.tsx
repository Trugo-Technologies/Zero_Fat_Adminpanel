/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useParams } from "react-router-dom";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllIngredientsQuery } from "src/pages/nutriplan-module/ingredients/services/api";
import {
  useEditExtraMealMutation,
  useGetExtraMealQuery,
} from "src/pages/nutriplan-module/mealPlanning/extraMeals/services/api";

import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateIExtraMealDto } from "src/types/modules/nutriplan/extras";
import { IIngredientsListDto } from "src/types/modules/nutriplan/Ingredients";
import * as yup from "yup";

interface IEditExtraMealProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditExtraMeal: React.FC<IEditExtraMealProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: extraMealItem, isLoading: detailsLoading } =
    useGetExtraMealQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [updateExtraMeal, { isLoading: editLoading, isSuccess, error }] =
    useEditExtraMealMutation();

  const { mealIdParams } = useParams();

  const refForm = React.useRef<FormikProps<IUpdateIExtraMealDto>>(null);

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),

    orginalIngredientId: yup
      .string()
      .required(String(messages["validation.required"])),

    ingredientId: yup
      .string()
      .required(String(messages["validation.required"])),

    amount: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"])),

    weightInGrams: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"])),

    price: yup
      .number()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"])),
  });

  const {
    changePage: changePageIngredients,
    data: ingredientsList,
    isError: isErrorIngredients,
    isFetching: isFetchingIngredients,
    limit: limitIngredients,
    page: pageIngredients,
    changeLimit: changeLimitIngredients,
    setSearchValue: setSearchValueIngredients,
    searchValue: searchValueIngredients,
    totalRecords: totalRecordsIngredients,
    handleDelete: handleDeleteIngredients,
    refetch: refetchIngredients,
  } = usePaginateData<IIngredientsListDto>(useGetAllIngredientsQuery);

  const {
    changePage: changePageOrginalIngredients,
    data: orginalIngredientsList,
    isError: isErrorOrginalIngredients,
    isFetching: isFetchingIOrginalIngredients,
    limit: limitOrginalIngredients,
    page: pageOrginalIngredients,
    changeLimit: changeLimitOrginalIngredients,
    setSearchValue: setSearchValueOrginalIngredients,
    searchValue: searchValueOrginalIngredients,
    totalRecords: totalRecordsOrginalIngredients,
    handleDelete: handleDeleteOrginalIngredients,
    refetch: refetchOrginalIngredients,
  } = usePaginateData<IIngredientsListDto>(useGetAllIngredientsQuery);

  useEffect(() => {
    if (pageOrginalIngredients && pageOrginalIngredients > 1)
      refetchOrginalIngredients();
  }, [pageOrginalIngredients]);

  useEffect(() => {
    if (pageIngredients && pageIngredients > 1) refetchIngredients();
  }, [pageIngredients]);
  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppEditModal
      label={label}
      itemName={
        locale == "en-US" && extraMealItem?.data?.nameEn!
          ? `- ${extraMealItem?.data?.nameEn!}`
          : `- ${extraMealItem?.data?.nameAr!}`
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
          nameAr: extraMealItem?.data?.nameAr || "",
          nameEn: extraMealItem?.data?.nameEn || "",
          image: extraMealItem?.data?.imageUrl || "",
          imageUrl: extraMealItem?.data?.imageUrl || "",
          price: extraMealItem?.data?.price || null,
          amount: extraMealItem?.data?.amount || null,
          weightInGrams: extraMealItem?.data?.weightInGrams || null,
          ingredientId: extraMealItem?.data?.ingredient?.id || "",

          orginalIngredientId: extraMealItem?.data?.orginalIngredient?.id || "",
          mealId: mealIdParams || "",
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateExtraMeal({ id: selectedRow?.id, data });
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
                <AppTextField
                  label={<IntlMessages id='ingredients.price' />}
                  name='price'
                  variant='outlined'
                  size='small'
                  type='number'
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <AppBaseAutoComplete
                  label='ingredients.name'
                  isLoading={isFetchingIngredients}
                  options={ingredientsList?.data}
                  hasNextPage={ingredientsList?.hasNextPage}
                  pageNumber={pageIngredients}
                  changePage={changePageIngredients}
                  defaultValue={extraMealItem?.data?.ingredient}
                  onChangeAutoComplete={(event, value) => {
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

              <Grid item xs={4}>
                <AppBaseAutoComplete
                  label='orginalIngredients.name'
                  isLoading={isFetchingIOrginalIngredients}
                  options={orginalIngredientsList?.data}
                  hasNextPage={orginalIngredientsList?.hasNextPage}
                  pageNumber={pageOrginalIngredients}
                  changePage={changePageOrginalIngredients}
                  defaultValue={extraMealItem?.data?.orginalIngredient}
                  onChangeAutoComplete={(event, value) => {
                    setFieldValue(
                      "orginalIngredientId",
                      value ? value?.id : ""
                    );
                    changePageOrginalIngredients(1);
                  }}
                  searchText={searchValueIngredients}
                  onChangeTextField={(value) => {
                    setSearchValueOrginalIngredients(value.target.value);
                    changePageOrginalIngredients(1);
                  }}
                  error={errors.orginalIngredientId}
                  touched={touched.orginalIngredientId}
                />
              </Grid>

              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='recipeIngredients.amount' />}
                  name='amount'
                  variant='outlined'
                  size='small'
                  type='number'
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='dailyMenuMeals.weightInGrams' />}
                  name='weightInGrams'
                  variant='outlined'
                  size='small'
                  type='number'
                  fullWidth
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
export default EditExtraMeal;
