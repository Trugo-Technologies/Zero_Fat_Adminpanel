/** @format */

import { Grid } from "@mui/material";
import { FormikErrors, FormikHelpers, FormikTouched } from "formik";
import { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllEquipmentsQuery } from "src/pages/workout-module/equipments/services/api";
import { useGetAllTrainersQuery } from "src/pages/workout-module/training-module/trainer/services/api";
import { useGetAllWorkoutBodyPartsQuery } from "src/pages/workout-module/workoutBodyParts/services/api";
import { useGetAllWorkoutTypesQuery } from "src/pages/workout-module/workoutTypes/services/api";
import { ITrainersListDto } from "src/types/modules/training/trainers";
import {
  IEquipment,
  IEquipmentsListDto,
} from "src/types/modules/workout/equipments";
import {
  IWorkoutBodyPart,
  IWorkoutBodyPartsListDto,
} from "src/types/modules/workout/workoutBodyParts";
import { ICreateWorkoutDto } from "src/types/modules/workout/workouts";
import { IWorkoutTypesListDto } from "src/types/modules/workout/workoutTypes";

interface ISecondStepProps {
  setFieldValue: FormikHelpers<ICreateWorkoutDto>["setFieldValue"];
  errors: FormikErrors<ICreateWorkoutDto>;
  touched: FormikTouched<ICreateWorkoutDto>;
  values: ICreateWorkoutDto;
}

const SecondStep = (props: ISecondStepProps) => {
  const { errors, setFieldValue, touched, values } = props;
  const { messages } = useIntl();

  // const {
  //   data: equipmentCategoriesList,
  //   isError: isErrorEquipmentCategories,
  //   isFetching: isFetchingEquipmentCategories,
  //   limit: limitEquipmentCategories,
  //   page: pageEquipmentCategories,
  //   changePage: changePageEquipmentCategories,

  //   changeLimit: changeLimitEquipmentCategories,
  //   setSearchValue: setSearchValueEquipmentCategories,
  //   searchValue: searchValueEquipmentCategories,
  //   totalRecords: totalRecordsEquipmentCategories,
  //   refetch: refetchEquipmentCategories,
  // } = usePaginateData<IEquipmentCategoriesListDto>(
  //   useGetAllEquipmentCategoriesQuery
  // );

  const {
    data: equipmentsList,
    isError: isErrorEquipments,
    isFetching: isFetchingEquipments,
    limit: limitEquipments,
    page: pageEquipments,
    changePage: changePageEquipments,

    changeLimit: changeLimitEquipments,
    setSearchValue: setSearchValueEquipments,
    searchValue: searchValueEquipments,
    totalRecords: totalRecordsEquipments,
    refetch: refetchEquipments,
  } = usePaginateData<IEquipmentsListDto>(useGetAllEquipmentsQuery);

  const {
    data: trainersList,
    isError: isErrorTrainers,
    isFetching: isFetchingTrainers,
    limit: limitTrainers,
    page: pageTrainers,
    changePage: changePageTrainers,

    changeLimit: changeLimitTrainers,
    setSearchValue: setSearchValueTrainers,
    searchValue: searchValueTrainers,
    totalRecords: totalRecordsTrainers,
    refetch: refetchTrainers,
  } = usePaginateData<ITrainersListDto>(useGetAllTrainersQuery);

  const {
    data: workoutTypesList,
    isError: isErrorWorkoutTypes,
    isFetching: isFetchingWorkoutTypes,
    limit: limitWorkoutTypes,
    page: pageWorkoutTypes,
    changePage: changePageWorkoutTypes,

    changeLimit: changeLimitWorkoutTypes,
    setSearchValue: setSearchValueWorkoutTypes,
    searchValue: searchValueWorkoutTypes,
    totalRecords: totalRecordsWorkoutTypes,
    refetch: refetchWorkoutTypes,
  } = usePaginateData<IWorkoutTypesListDto>(useGetAllWorkoutTypesQuery);

  const {
    data: bodyPartsList,
    isError: isErrorBodyParts,
    isFetching: isFetchingBodyParts,
    limit: limitBodyParts,
    page: pageBodyParts,
    changePage: changePageBodyParts,

    changeLimit: changeLimitBodyParts,
    setSearchValue: setSearchValueBodyParts,
    searchValue: searchValueBodyParts,
    totalRecords: totalRecordsBodyParts,
    refetch: refetchBodyParts,
  } = usePaginateData<IWorkoutBodyPartsListDto>(useGetAllWorkoutBodyPartsQuery);

  useEffect(() => {
    if (pageEquipments && pageEquipments > 1) refetchEquipments();
  }, [pageEquipments]);

  useEffect(() => {
    if (pageTrainers && pageTrainers > 1) refetchTrainers();
  }, [pageTrainers]);

  useEffect(() => {
    if (pageWorkoutTypes && pageWorkoutTypes > 1) refetchWorkoutTypes();
  }, [pageWorkoutTypes]);

  useEffect(() => {
    if (pageBodyParts && pageBodyParts > 1) refetchBodyParts();
  }, [pageBodyParts]);

  return (
    <Grid container spacing={4}>
      {/* <Grid item xs={4}>
        <AppBaseAutoComplete
          label="sidebar.categories"
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
      </Grid> */}

      <Grid item xs={4}>
        <AppBaseAutoComplete
          label='trainers.name'
          isLoading={isFetchingTrainers}
          options={trainersList?.data}
          hasNextPage={trainersList?.hasNextPage}
          pageNumber={pageTrainers}
          changePage={changePageTrainers}
          onChangeAutoComplete={(event, value) => {
            setFieldValue("trainer", value);
            setFieldValue("exerciseSets", [
              {
                exerciseId: "",
                exercise: null,
                durationInSec: null,
                reps: null,
                index: null,
                sets: null,
                weight: null,
              },
            ]);

            setFieldValue("trainerId", value ? value?.id : "");

            changePageEquipments(1);
          }}
          defaultValue={values?.trainer}
          searchText={searchValueTrainers}
          onChangeTextField={(value) => {
            setSearchValueTrainers(value.target.value);
            changePageTrainers(1);
          }}
          error={errors.trainerId}
          touched={touched.trainerId}
        />
      </Grid>

      <Grid item xs={4}>
        <AppBaseAutoComplete
          label='workoutTypes.name'
          isLoading={isFetchingWorkoutTypes}
          options={workoutTypesList?.data}
          hasNextPage={workoutTypesList?.hasNextPage}
          pageNumber={pageWorkoutTypes}
          changePage={changePageWorkoutTypes}
          onChangeAutoComplete={(event, value) => {
            setFieldValue("workoutType", value);
            setFieldValue("workoutTypeId", value ? value?.id : "");
            changePageWorkoutTypes(1);
          }}
          defaultValue={values?.workoutType}
          searchText={searchValueWorkoutTypes}
          onChangeTextField={(value) => {
            changePageWorkoutTypes(value.target.value);
            changePageEquipments(1);
          }}
          error={errors.workoutTypeId}
          touched={touched.workoutTypeId}
        />
      </Grid>

      <Grid item xs={12}>
        <AppBaseAutoComplete
          label='sidebar.equipments'
          isLoading={isFetchingEquipments}
          // options={equipmentsList?.data}
          options={equipmentsList?.data?.filter(
            (part) => !values?.equipmentIds?.includes(part.id)
          )}
          hasNextPage={equipmentsList?.hasNextPage}
          pageNumber={pageEquipments}
          changePage={changePageEquipments}
          multiple
          onChangeAutoComplete={(event, value) => {
            setFieldValue("equipments", value);
            setFieldValue(
              "equipmentIds",
              value ? value?.map((item: IEquipment) => item?.id) : ""
            );
            changePageEquipments(1);
          }}
          defaultValue={values?.equipments}
          searchText={searchValueEquipments}
          onChangeTextField={(value) => {
            setSearchValueEquipments(value.target.value);
            changePageEquipments(1);
          }}
          error={errors.equipmentIds}
          touched={touched.equipmentIds}
        />
      </Grid>

      <Grid item xs={12}>
        <AppBaseAutoComplete
          label='sidebar.workoutBodyParts'
          isLoading={isFetchingBodyParts}
          // options={bodyPartsList?.data}
          options={bodyPartsList?.data?.filter(
            (part) => !values?.bodyPartsIds?.includes(part.id)
          )}
          hasNextPage={bodyPartsList?.hasNextPage}
          pageNumber={pageBodyParts}
          changePage={changePageBodyParts}
          multiple
          onChangeAutoComplete={(event, value) => {
            setFieldValue("bodyParts", value);
            setFieldValue(
              "bodyPartsIds",
              value ? value?.map((item: IWorkoutBodyPart) => item?.id) : ""
            );
            changePageBodyParts(1);
          }}
          defaultValue={values?.bodyParts}
          searchText={searchValueBodyParts}
          onChangeTextField={(value) => {
            setSearchValueBodyParts(value.target.value);
            changePageBodyParts(1);
          }}
          error={errors.bodyPartsIds}
          touched={touched.bodyPartsIds}
        />
      </Grid>
    </Grid>
  );
};

export default SecondStep;
