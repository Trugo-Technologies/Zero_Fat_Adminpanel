/** @format */
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Grid, MenuItem } from "@mui/material";
import { FieldArray, Form, Formik, FormikProps } from "formik";
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
import { CUSTOMIZE_MENU_MACRO_OPTIONS } from "src/pages/nutriplan-module/menuManagement/dailyMenuMeals/customizeMenuHelpers";
import { useCreateDailyMenuMultiMealsMutation } from "src/pages/nutriplan-module/menuManagement/dailyMenuMeals/services/api";
import {
  IMeals,
  IMealsListDto,
} from "src/types/modules/nutriplan/mealPlanning/meals";
import {
  IMealPlansListDto,
  isCustomizeMealPlanRow,
} from "src/types/modules/nutriplan/mealPlans";
import { IAddDailyMenuMealsMultiMealsDto } from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import * as yup from "yup";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  dates: string[];
}

type MealPlanRow = IAddDailyMenuMealsMultiMealsDto["mealPlanIds"][number];

const emptyMealPlanRow = (): MealPlanRow => ({
  mealPlanId: "",
  mealTypeIds: [],
  mealPlan: null,
  macroCategory: "",
});

const toApiMealPlanRow = (row: MealPlanRow) => ({
  mealPlanId: row.mealPlanId,
  mealPlan: row.mealPlan,
  mealTypeIds: row.mealTypeIds,
});

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
        macroCategory: yup.string().when("mealPlan", {
          is: (mealPlan: MealPlanRow["mealPlan"]) =>
            isCustomizeMealPlanRow(mealPlan),
          then: (schema) =>
            schema.required(String(messages["validation.required"])),
          otherwise: (schema) => schema.optional(),
        }),
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
          mealPlanIds: [emptyMealPlanRow()],
          menuId: menuIdParams || "",
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={async (data) => {
          const formattedDates = data.dates.map((dateItem) =>
            dateFormatInBackendPayload(dateItem)
          );

          const macrosFromCustomize = Array.from(
            new Set(
              (data.mealPlanIds || [])
                .filter((row) => isCustomizeMealPlanRow(row.mealPlan))
                .map((row) => row.macroCategory)
                .filter((macro): macro is string => !!macro)
            )
          );

          const payload: IAddDailyMenuMealsMultiMealsDto = {
            mealIds: data.mealIds,
            menuId: data.menuId,
            dates: formattedDates,
            mealPlanIds: (data.mealPlanIds || []).map(toApiMealPlanRow),
          };

          if (macrosFromCustomize.length > 0) {
            payload.macroCategories = macrosFromCustomize;
            payload.macroCategory = macrosFromCustomize[0];
          }

          await createMethod(payload);
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
                                arrayHelpers.push(emptyMealPlanRow());
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
                        {values?.mealPlanIds?.map((row, index) => {
                          const isCustomize = isCustomizeMealPlanRow(
                            row?.mealPlan
                          );
                          const planCol = isCustomize ? 4 : 5;
                          const typeCol = isCustomize ? 4 : 5;

                          return (
                            <Grid
                              item
                              container
                              xs={12}
                              spacing={4}
                              key={index}
                              alignItems='flex-start'>
                              <Grid item xs={12} md={planCol}>
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
                                    setFieldValue(
                                      `mealPlanIds[${index}].macroCategory`,
                                      isCustomizeMealPlanRow(value)
                                        ? values.mealPlanIds[index]
                                            ?.macroCategory || ""
                                        : ""
                                    );
                                    changePageMealPlans(1);
                                  }}
                                  searchText={searchValueMealPlans}
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

                              <Grid item xs={12} md={typeCol}>
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

                              {isCustomize && (
                                <Grid item xs={12} md={2}>
                                  <AppSelectField
                                    fullWidth
                                    size='small'
                                    name={`mealPlanIds[${index}].macroCategory`}
                                    labelId='dailyMenuMeals.macroCategory'
                                    label={
                                      (messages[
                                        "dailyMenuMeals.macroCategory"
                                      ] as string) || "Macro Category"
                                    }
                                    error={
                                      errors?.mealPlanIds &&
                                      (
                                        (errors?.mealPlanIds as any)[
                                          index
                                        ] as any
                                      )?.macroCategory
                                    }>
                                    {CUSTOMIZE_MENU_MACRO_OPTIONS.map(
                                      (option) => (
                                        <MenuItem
                                          key={option.value}
                                          value={option.value}>
                                          {(messages[
                                            option.labelKey
                                          ] as string) || option.fallback}
                                        </MenuItem>
                                      )
                                    )}
                                  </AppSelectField>
                                </Grid>
                              )}

                              <Grid
                                item
                                xs={12}
                                md={2}
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
                                      arrayHelpers.push(emptyMealPlanRow());
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
