/** @format */

import { Chip, Divider, Grid } from "@mui/material";
import {
  FieldArray,
  FormikErrors,
  FormikHelpers,
  FormikProps,
  FormikTouched,
} from "formik";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllMealTypesQuery } from "src/pages/nutriplan-module/MealTypes/services/api";
import { ICreateMealPlanDto } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypesListDto } from "src/types/modules/nutriplan/mealTypes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Fonts } from "src/@crema/constants/AppEnums";
import AppUploadPhoto from "src/Components/baseComponents/uploadFile/uploadPhoto/AppUploadPhoto";
import React from "react";

interface ISecondStepProps {
  setFieldValue: FormikHelpers<ICreateMealPlanDto>["setFieldValue"];
  errors: FormikErrors<ICreateMealPlanDto>;
  touched: FormikTouched<ICreateMealPlanDto>;
  values: ICreateMealPlanDto;
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
}

const SecondStep = (props: ISecondStepProps) => {
  const {
    errors,
    setFieldValue,
    touched,
    values,
    uploadedFiles,
    setUploadedFiles,
  } = props;
  const { messages } = useIntl();
  const refForm = React.useRef<FormikProps<ICreateMealPlanDto>>(null);

  const {
    changePage: changePageMealTypes,
    data: mealTypesList,
    isError: isErrorMealTypes,
    isFetching: isFetchingMealTypes,
    limit: limitMealTypes,
    page: pageMealTypes,
    changeLimit: changeLimitMealTypes,
    setSearchValue: setSearchValueMealTypes,
    searchValue: searchValueMealTypes,
    totalRecords: totalRecordsMealTypes,
    handleDelete: handleDeleteMealTypes,
    refetch: refetchMealTypes,
  } = usePaginateData<IMealTypesListDto>(useGetAllMealTypesQuery);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.carbPercentage' />}
          name='carbPercentage'
          variant='outlined'
          size='small'
          fullWidth
          type='number'
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.proteinPercentage' />}
          name='proteinPercentage'
          variant='outlined'
          size='small'
          fullWidth
          type='number'
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='mealPlans.fatPercentage' />}
          name='fatPercentage'
          variant='outlined'
          size='small'
          fullWidth
          type='number'
        />
      </Grid>
      <Grid item container xs={12}>
        <AppUploadPhoto
          keyName='images'
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          multiple
          formRef={refForm}
          uploadModernXs={1.5}
          appGridXs={4}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider
          sx={{ color: "#a5d060", fontWeight: Fonts.SEMI_BOLD }}
          variant='fullWidth'>
          {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
          <Chip
            label={messages["sidebar.mealTypes"] as string}
            size='medium'
            color='primary'
            sx={{ fontSize: 17 }}
          />
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <FieldArray
          name='mealTypes'
          render={(arrayHelpers) => (
            <Grid container xs={12} item spacing={4}>
              {values?.mealTypes?.map((item, index) => {
                return (
                  <Grid item container xs={12} spacing={4}>
                    <Grid item xs={4}>
                      <AppBaseAutoComplete
                        // key={values?.sets}
                        label='mealTypes.name'
                        isLoading={isFetchingMealTypes}
                        options={mealTypesList?.data}
                        hasNextPage={mealTypesList?.hasNextPage}
                        pageNumber={pageMealTypes}
                        changePage={changePageMealTypes}
                        defaultValue={values?.mealTypes![index]?.mealType}
                        onChangeAutoComplete={(event, value) => {
                          setFieldValue(
                            `mealTypes[${index}].mealType`,
                            value ? value : null
                          );
                          setFieldValue(
                            `mealTypes[${index}].mealTypeId`,
                            value ? value?.id : ""
                          );
                          //   setFieldValue(`mealTypes[${index}].price`, null);
                          //   setFieldValue(
                          //     `mealTypes[${index}].averageCalories`,
                          //     null,
                          //   );

                          changePageMealTypes(1);
                        }}
                        searchText={searchValueMealTypes}
                        onChangeTextField={(value) => {
                          setSearchValueMealTypes(value.target.value);
                          changePageMealTypes(1);
                        }}
                        error={
                          errors?.mealTypes &&
                          ((errors?.mealTypes as any)[index] as any)?.mealTypeId
                        }
                        touched={
                          touched?.mealTypes &&
                          ((touched?.mealTypes as any)[index] as any)
                            ?.mealTypeId
                        }
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <AppTextField
                        label={<IntlMessages id='mealPlans.averageCalories' />}
                        name={`mealTypes[${index}].averageCalories`}
                        variant='outlined'
                        size='small'
                        fullWidth
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <AppTextField
                        label={<IntlMessages id='mealPlans.price' />}
                        name={`mealTypes[${index}].price`}
                        variant='outlined'
                        size='small'
                        fullWidth
                        type='number'
                      />
                    </Grid>

                    <Grid
                      item
                      xs={1}
                      container
                      columnGap={2}
                      alignItems={"center"}>
                      <AppIconButton
                        label='workouts.item.delete'
                        handleClick={() => {
                          arrayHelpers.remove(index);
                        }}
                        disabled={values?.mealTypes?.length === 1}
                        // Disable if there's only one item
                        childComp={
                          <DeleteForeverIcon
                            fontSize='medium'
                            sx={{ color: "#ff5252" }}
                          />
                        }
                      />
                      {index === values?.mealTypes?.length! - 1 && (
                        <AppIconButton
                          label='workouts.item.add'
                          handleClick={() => {
                            arrayHelpers.push({
                              mealType: null,
                              mealTypeId: "",
                              averageCalories: null,
                              price: null,
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
  );
};

export default SecondStep;
