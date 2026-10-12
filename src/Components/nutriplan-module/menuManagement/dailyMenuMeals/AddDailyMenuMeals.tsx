/** @format */
import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllMealsQuery } from "src/pages/nutriplan-module/mealPlanning/meals/services/api";
import { useAddDailyMenuMealsMultiMutation } from "src/pages/nutriplan-module/menuManagement/dailyMenuMeals/services/api";
import {
  IMeals,
  IMealsListDto,
} from "src/types/modules/nutriplan/mealPlanning/meals";
import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import { ICreateDailyMenuMealsMultiDto } from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import * as yup from "yup";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  date: string;
  mealPlan: IMealPlans;
  mealType: IMealTypes;
  /** Protein | Carbs | Fiber for Customize plan sections. */
  macroCategory?: string;
}

const AddDailyMenuMeals: React.FC<IProps> = (props) => {
  const {
    showAddModal,
    setShowAddModal,
    label,
    date,
    mealPlan,
    mealType,
    macroCategory,
  } = props;
  const { menuIdParams } = useParams();
  const [addDailyMenuMealsMethod, { isLoading, isSuccess }] =
    useAddDailyMenuMealsMultiMutation();
  const { messages } = useIntl();
  const validationSchema = yup.object({
    mealIds: yup.array().min(1, String(messages["validation.required"])),
  });
  const refForm =
    React.useRef<FormikProps<ICreateDailyMenuMealsMultiDto>>(null);

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
      loadingForAdd={isLoading}
      maxWidth={"sm"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          date: dateFormatInBackendPayload(date),
          mealPlanId: mealPlan.id,
          mealTypeId: mealType.id,
          menuId: menuIdParams || "",
          mealIds: [],
          ...(macroCategory ? { macroCategory } : {}),
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={(data) =>
          addDailyMenuMealsMethod({
            ...data,
            ...(macroCategory ? { macroCategory } : {}),
          })
        }>
        {({ errors, setFieldValue, touched }) => (
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
            </Grid>
          </Form>
        )}
      </Formik>
    </AppAddModal>
  );
};

export default AddDailyMenuMeals;
