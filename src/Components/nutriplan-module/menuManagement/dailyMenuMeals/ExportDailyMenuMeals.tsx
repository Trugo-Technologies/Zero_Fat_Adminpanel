/** @format */
import { Grid, MenuItem } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import { CUSTOMIZE_MENU_MACRO_OPTIONS } from "src/pages/nutriplan-module/menuManagement/dailyMenuMeals/customizeMenuHelpers";
import { useAddDailyMenuMealsMultiMutation } from "src/pages/nutriplan-module/menuManagement/dailyMenuMeals/services/api";
import {
  IMealPlans,
  IMealPlansListDto,
  isCustomizeMealPlanRow,
} from "src/types/modules/nutriplan/mealPlans";
import { IExportDailyMenuMealsDto } from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import * as yup from "yup";

interface IProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  dates: string[];
  mealIds: string[];
  onSuccess: () => void;
}

const ExportDailyMenuMeals: React.FC<IProps> = (props) => {
  const { showModal, setShowModal, dates, mealIds, onSuccess } = props;
  const { menuIdParams } = useParams();
  const [selectedMealPlan, setSelectedMealPlan] = useState<IMealPlans | null>(
    null
  );

  const [exportDailyMenuMealsMethod, { isLoading, isSuccess }] =
    useAddDailyMenuMealsMultiMutation();

  const { messages } = useIntl();
  const validationSchema = yup.object({
    date: yup.string().required(String(messages["validation.required"])),
    mealPlanId: yup.string().required(String(messages["validation.required"])),
    mealTypeId: yup.string().required(String(messages["validation.required"])),
    macroCategory: yup.string().when([], {
      is: () => isCustomizeMealPlanRow(selectedMealPlan),
      then: (schema) =>
        schema.required(String(messages["validation.required"])),
      otherwise: (schema) => schema.optional(),
    }),
  });
  const refForm = React.useRef<FormikProps<IExportDailyMenuMealsDto>>(null);
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
      label={"dailyMenuMeals.export"}
      open={showModal}
      onClose={() => setShowModal(false)}
      closeModalState={setShowModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForAdd={isLoading}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        enableReinitialize
        initialValues={{
          mealIds,
          date: "",
          mealPlanId: "",
          mealTypeId: "",
          menuId: menuIdParams || "",
          macroCategory: "",
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={(data) => {
          const payload: IExportDailyMenuMealsDto = {
            ...data,
            date: dateFormatInBackendPayload(data.date),
          };
          if (
            !isCustomizeMealPlanRow(selectedMealPlan) ||
            !payload.macroCategory
          ) {
            delete payload.macroCategory;
          }
          exportDailyMenuMealsMethod(payload)
            .unwrap()
            .then(onSuccess)
            .catch(() => {});
        }}>
        {({ errors, setFieldValue, touched }) => {
          return (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <AppBaseAutoComplete
                    label='mealPlans.name'
                    isLoading={isFetchingMealPlans}
                    options={mealPlansList?.data}
                    hasNextPage={mealPlansList?.hasNextPage}
                    pageNumber={pageMealPlans}
                    changePage={changePageMealPlans}
                    onChangeAutoComplete={(_, value: IMealPlans) => {
                      setSelectedMealPlan(value || null);
                      setFieldValue("mealTypeId", "");
                      setFieldValue("mealPlanId", value ? value?.id : "");
                      setFieldValue("macroCategory", "");
                      changePageMealPlans(1);
                    }}
                    searchText={searchValueMealPlans}
                    onChangeTextField={(value) => {
                      setSearchValueMealPlans(value.target.value);
                      changePageMealPlans(1);
                    }}
                    error={errors.mealPlanId}
                    touched={touched.mealPlanId}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppSelectField
                    fullWidth
                    disabled={!selectedMealPlan}
                    size='small'
                    name='mealTypeId'
                    labelId='mealTypes.name'
                    label={messages["mealTypes.name"] as string}
                    error={Boolean(errors?.mealTypeId)}>
                    {selectedMealPlan?.mealPlanMealTypes?.map((mealType) => (
                      <MenuItem
                        key={`mealType-${mealType.mealTypeId}`}
                        value={mealType?.mealType?.id || ""}>
                        {getValueBasedOnCurrentLanguage(
                          mealType?.mealType?.nameAr || "",
                          mealType?.mealType?.nameEn || ""
                        )}
                      </MenuItem>
                    ))}
                  </AppSelectField>
                </Grid>
                <Grid item xs={6}>
                  <AppSelectField
                    fullWidth
                    size='small'
                    name='date'
                    labelId='common.date'
                    label={messages["common.date"] as string}
                    error={Boolean(errors?.date)}>
                    {dates.map((x, index) => (
                      <MenuItem key={`date-${index}`} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </AppSelectField>
                </Grid>
                {isCustomizeMealPlanRow(selectedMealPlan) && (
                  <Grid item xs={6}>
                    <AppSelectField
                      fullWidth
                      size='small'
                      name='macroCategory'
                      labelId='dailyMenuMeals.macroCategory'
                      label={
                        (messages["dailyMenuMeals.macroCategory"] as string) ||
                        "Macro Category"
                      }
                      error={Boolean(errors?.macroCategory)}>
                      {CUSTOMIZE_MENU_MACRO_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {(messages[option.labelKey] as string) ||
                            option.fallback}
                        </MenuItem>
                      ))}
                    </AppSelectField>
                  </Grid>
                )}
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </AppAddModal>
  );
};

export default ExportDailyMenuMeals;
