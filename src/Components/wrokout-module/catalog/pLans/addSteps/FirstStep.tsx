/** @format */

import { Grid, MenuItem } from "@mui/material";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllEquipmentCategoriesQuery } from "src/pages/workout-module/equipmentCategories/services/api";
import { workoutLevel } from "src/types/enums";
import { IEquipmentCategoriesListDto } from "src/types/modules/workout/equipmentCategories";
import { IWorkoutPlansCreateDto } from "src/types/modules/workout/workoutPlans";

const FirstStep = () => {
  const { errors, setFieldValue, touched, values } =
    useFormikContext<IWorkoutPlansCreateDto>();
  const { messages } = useIntl();

  const {
    data: equipmentCategoriesList,
    isFetching: isFetchingEquipmentCategories,
    page: pageEquipmentCategories,
    changePage: changePageEquipmentCategories,
    setSearchValue: setSearchValueEquipmentCategories,
    searchValue: searchValueEquipmentCategories,
    refetch: refetchEquipmentCategories,
  } = usePaginateData<IEquipmentCategoriesListDto>(
    useGetAllEquipmentCategoriesQuery
  );

  useEffect(() => {
    if (pageEquipmentCategories && pageEquipmentCategories > 1)
      refetchEquipmentCategories();
  }, [pageEquipmentCategories]);

  return (
    <Grid container rowSpacing={6} columnSpacing={6}>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='common.nameAr' />}
          name='nameAr'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppTextField
          label={<IntlMessages id='common.nameEn' />}
          name='nameEn'
          variant='outlined'
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AppSelectField
          fullWidth
          size='small'
          name='level'
          labelId='workouts.level'
          label={messages["workouts.level"] as string}
          error={Boolean(errors?.level)}>
          <MenuItem value={workoutLevel.Beginner}>
            <IntlMessages id='workouts.level.Beginner' />
          </MenuItem>
          <MenuItem value={workoutLevel.Intermediate}>
            <IntlMessages id='workouts.level.Intermediate' />
          </MenuItem>
          <MenuItem value={workoutLevel.Advanced}>
            <IntlMessages id='workouts.level.Advanced' />
          </MenuItem>
        </AppSelectField>
      </Grid>

      <Grid item xs={4}>
        <AppBaseAutoComplete
          label='categories.name'
          isLoading={isFetchingEquipmentCategories}
          options={equipmentCategoriesList?.data}
          hasNextPage={equipmentCategoriesList?.hasNextPage}
          pageNumber={pageEquipmentCategories}
          changePage={changePageEquipmentCategories}
          onChangeAutoComplete={(event, value) => {
            setFieldValue("equipmentCategory", value);
            setFieldValue("equipmentCategoryId", value ? value?.id : "");
            changePageEquipmentCategories(1);
          }}
          defaultValue={values?.equipmentCategory}
          searchText={searchValueEquipmentCategories}
          onChangeTextField={(value) => {
            setSearchValueEquipmentCategories(value.target.value);
            changePageEquipmentCategories(1);
          }}
          error={errors.equipmentCategoryId}
          touched={touched.equipmentCategoryId}
        />
      </Grid>
      <Grid item xs={12} display={"flex"} justifyContent={"flex-start"}>
        <AppCustomizedSwitch
          defaultChecked={values?.isActive}
          keyName='isActive'
          onChange={setFieldValue}
        />
      </Grid>
      <Grid item xs={6}>
        <AppTextField
          label={<IntlMessages id='workouts.overviewAr' />}
          name='overviewAr'
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={6}>
        <AppTextField
          label={<IntlMessages id='workouts.overviewEn' />}
          name='overviewEn'
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={3}
        />
      </Grid>

      <Grid item xs={6}>
        <AppImageField
          label={"common.avatarImage"}
          name='avatarImage'
          placeholder={""}
        />
      </Grid>
      <Grid item xs={6}>
        <AppImageField
          accept='*'
          label={"trainers.profileMedia"}
          name='profileMedia'
          placeholder={""}
        />
      </Grid>
    </Grid>
  );
};

export default FirstStep;
