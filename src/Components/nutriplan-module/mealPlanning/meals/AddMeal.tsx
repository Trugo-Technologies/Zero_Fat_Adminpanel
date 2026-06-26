/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useAddMealMutation } from "src/pages/nutriplan-module/mealPlanning/meals/services/api";
import { useGetAllRecipesQuery } from "src/pages/nutriplan-module/mealPlanning/recipes/services/api";
import { ICreateMealDto } from "src/types/modules/nutriplan/mealPlanning/meals";
import { IRecipesListDto } from "src/types/modules/nutriplan/mealPlanning/recipes";
import * as yup from "yup";

interface IAddMealProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddMeal: React.FC<IAddMealProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addMealMethod, { isLoading: addLoading, isSuccess }] =
    useAddMealMutation();

  const { messages } = useIntl();

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
  const refForm = React.useRef<FormikProps<ICreateMealDto>>(null);

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
            priceForCustomer: null,
            recipeId: "",
            image: "",
            isAddOn: false,
            // isDefault: false,
            suitableForFreezing: false,
            isActive: false,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addMealMethod(data);
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
                    // defaultChecked={values?.isDefault}
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

                <Grid
                  item
                  xs={3}
                  display={"flex"}
                  justifyContent={"flex-start"}>
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
      </AppAddModal>
    </>
  );
};

export default AddMeal;
