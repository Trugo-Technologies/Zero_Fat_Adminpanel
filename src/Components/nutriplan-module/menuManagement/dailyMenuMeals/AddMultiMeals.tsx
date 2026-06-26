/** @format */
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Grid, MenuItem } from "@mui/material";
import { FieldArray, Form, Formik, FormikProps } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllMealsQuery } from "src/pages/nutriplan-module/mealPlanning/meals/services/api";
import { useGetAllMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import { useCreateDailyMenuMultiMealsMutation } from "src/pages/nutriplan-module/menuManagement/dailyMenuMeals/services/api";
import {
  IMeals,
  IMealsListDto,
} from "src/types/modules/nutriplan/mealPlanning/meals";
import { IMealPlansListDto } from "src/types/modules/nutriplan/mealPlans";
import { IAddDailyMenuMealsMultiMealsDto } from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import * as yup from "yup";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  dates: string[];
}

const AddMultiMeals: React.FC<IProps> = (props) => {
  const { showAddModal, setShowAddModal, dates } = props;
  const { menuIdParams } = useParams();
  const [createMethod, { isLoading, isSuccess }] =
    useCreateDailyMenuMultiMealsMutation();
  const { messages } = useIntl();
  const validationSchema = yup.object({
    mealIds: yup.array().min(1, String(messages["validation.required"])),
    dates: yup.array().min(1, String(messages["validation.required"])),
    mealPlanIds: yup.array().of(
      yup.object().shape({
        mealPlanId: yup
          .string()
          .required(String(messages["validation.required"])),
        mealTypeIds: yup
          .array()
          .min(1, String(messages["validation.required"])),
      })
    ),
  });
  const refForm =
    React.useRef<FormikProps<IAddDailyMenuMealsMultiMealsDto>>(null);

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
    if (pageMeals && pageMeals > 1) refetchMeals();
  }, [pageMeals]);

  const {
    changePage: changePageMealPlans,
    data: mealPlansList,
    isFetching: isFetchingMealPlans,
    page: pageMealPlans,
    setSearchValue: setSearchValueMealPlans,
    searchValue: searchValueMealPlans,
    refetch: refetchMealPlans,
  } = usePaginateData<IMealPlansListDto>(useGetAllMealPlansQuery);

  useEffect(() => {
    if (pageMealPlans && pageMealPlans > 1) refetchMealPlans();
  }, [pageMealPlans]);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppAddModal
      label={"dailyMenuMealsMulti.add"}
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForAdd={isLoading}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          mealIds: [],
          dates: [],
          mealPlanIds: [{ mealPlanId: "", mealTypeIds: [], mealPlan: null }],
          menuId: menuIdParams || "",
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={async (data) => {
          data = {
            ...data,
            dates: data.dates.map((dateItem) =>
              dateFormatInBackendPayload(dateItem)
            ),
          };
          await createMethod(data);
        }}>
        {({ errors, setFieldValue, touched, values }) => {
          return (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <AppBaseAutoComplete
                    label='sidebar.meals'
                    isLoading={isFetchingMeals}
                    options={mealsList?.data}
                    hasNextPage={mealsList?.hasNextPage}
                    pageNumber={pageMeals}
                    changePage={changePageMeals}
                    onChangeAutoComplete={(_, value) => {
                      setFieldValue(
                        "mealIds",
                        value ? value?.map((item: IMeals) => item?.id) : ""
                      );
                      changePageMeals(1);
                    }}
                    multiple
                    searchText={searchValueMeals}
                    onChangeTextField={(value) => {
                      setSearchValueMeals(value.target.value);
                      changePageMeals(1);
                    }}
                    error={errors.mealIds}
                    touched={touched.mealIds}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AppSelectField
                    fullWidth
                    size='small'
                    name='dates'
                    labelId='common.date'
                    multiple
                    //   multiple
                    label={messages["common.date"] as string}
                    error={Boolean(errors?.dates)}>
                    {dates.map((x, index) => (
                      <MenuItem key={`date-${index}`} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </AppSelectField>
                </Grid>

                <Grid item xs={12}>
                  <FieldArray
                    name='mealPlanIds'
                    render={(arrayHelpers) => (
                      <Grid container xs={12} item spacing={4}>
                        <Grid
                          item
                          xs={12}
                          display={"flex"}
                          justifyContent={"center"}>
                          {values?.mealPlanIds?.length! === 0 && (
                            <AppIconButton
                              label='common.add'
                              handleClick={() => {
                                arrayHelpers.push({
                                  mealPlanId: "",
                                  mealTypeIds: [],
                                  mealPlan: null,
                                });
                              }}
                              childComp={
                                <AddCircleIcon
                                  fontSize='large'
                                  sx={{ color: "#a5d060" }}
                                />
                              }
                            />
                          )}
                        </Grid>
                        {values?.mealPlanIds?.map((item, index) => {
                          return (
                            <Grid item container xs={12} spacing={4}>
                              <Grid item xs={5}>
                                <AppBaseAutoComplete
                                  label='sidebar.mealPlans'
                                  isLoading={isFetchingMealPlans}
                                  options={mealPlansList?.data}
                                  hasNextPage={mealPlansList?.hasNextPage}
                                  pageNumber={pageMealPlans}
                                  changePage={changePageMealPlans}
                                  onChangeAutoComplete={(_, value) => {
                                    setFieldValue(
                                      `mealPlanIds[${index}].mealPlanId`,
                                      value?.id || ""
                                    );
                                    setFieldValue(
                                      `mealPlanIds[${index}].mealPlan`,
                                      value || null
                                    );
                                    setFieldValue(
                                      `mealPlanIds[${index}].mealTypeIds`,
                                      []
                                    );
                                    changePageMealPlans(1);
                                  }}
                                  searchText={searchValueMeals}
                                  onChangeTextField={(value) => {
                                    setSearchValueMealPlans(value.target.value);
                                    changePageMealPlans(1);
                                  }}
                                  error={
                                    errors?.mealPlanIds &&
                                    ((errors?.mealPlanIds as any)[index] as any)
                                      ?.mealPlanId
                                  }
                                  touched={
                                    touched?.mealPlanIds &&
                                    (
                                      (touched?.mealPlanIds as any)[
                                        index
                                      ] as any
                                    )?.mealPlanId
                                  }
                                />
                              </Grid>

                              <Grid item xs={5}>
                                <AppSelectField
                                  fullWidth
                                  disabled={
                                    !values?.mealPlanIds[index]?.mealPlan
                                  }
                                  size='small'
                                  name={`mealPlanIds[${index}].mealTypeIds`}
                                  labelId='mealTypes.name'
                                  multiple
                                  label={messages["mealTypes.name"] as string}
                                  error={
                                    errors?.mealPlanIds &&
                                    ((errors?.mealPlanIds as any)[index] as any)
                                      ?.mealTypeIds
                                  }>
                                  {values?.mealPlanIds[
                                    index
                                  ]?.mealPlan?.mealPlanMealTypes?.map(
                                    (mealType) => (
                                      <MenuItem
                                        key={`mealType-${mealType.mealTypeId}`}
                                        value={mealType?.mealType?.id || ""}>
                                        {getValueBasedOnCurrentLanguage(
                                          mealType?.mealType?.nameAr || "",
                                          mealType?.mealType?.nameEn || ""
                                        )}
                                      </MenuItem>
                                    )
                                  )}
                                </AppSelectField>
                              </Grid>

                              <Grid
                                item
                                xs={2}
                                container
                                columnGap={2}
                                alignItems={"center"}>
                                <AppIconButton
                                  label='ingredients.ingredientMeasurementUnits.delete'
                                  handleClick={() => {
                                    arrayHelpers.remove(index);
                                  }}
                                  childComp={
                                    <DeleteForeverIcon
                                      fontSize='medium'
                                      sx={{ color: "#ff5252" }}
                                    />
                                  }
                                />
                                {index === values?.mealPlanIds?.length! - 1 && (
                                  <AppIconButton
                                    label='common.add'
                                    handleClick={() => {
                                      arrayHelpers.push({
                                        mealPlanId: "",
                                        mealTypeIds: [],
                                        mealPlan: null,
                                      });
                                    }}
                                    childComp={
                                      <AddCircleIcon
                                        fontSize='medium'
                                        sx={{ color: "#a5d060" }}
                                      />
                                    }
                                  />
                                )}
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                  />
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </AppAddModal>
  );
};

export default AddMultiMeals;
