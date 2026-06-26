/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllIngredientsQuery } from "src/pages/nutriplan-module/ingredients/services/api";
import { useAddExtraMealMutation } from "src/pages/nutriplan-module/mealPlanning/extraMeals/services/api";
import { ICreateExtraMealDto } from "src/types/modules/nutriplan/extras";
import { IIngredientsListDto } from "src/types/modules/nutriplan/Ingredients";
import * as yup from "yup";

interface IAddExtraMealProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddExtraMeal: React.FC<IAddExtraMealProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addExtraMealMethod, { isLoading: addLoading, isSuccess }] =
    useAddExtraMealMutation();

  const { messages } = useIntl();

  const { mealIdParams } = useParams();

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
  const refForm = React.useRef<FormikProps<ICreateExtraMealDto>>(null);

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
    <>
      <AppAddModal
        label={label}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        closeModalState={setShowAddModal}
        successClose={isSuccess}
        handleSubmit={submit}
        loadingForAdd={addLoading}
        maxWidth={"md"}>
        <Formik
          validateOnChange={true}
          initialValues={{
            nameAr: "",
            nameEn: "",
            price: null,
            amount: null,
            weightInGrams: null,
            ingredientId: "",
            orginalIngredientId: "",
            mealId: mealIdParams || "",
            image: "",
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addExtraMealMethod(data);
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
      </AppAddModal>
    </>
  );
};

export default AddExtraMeal;
