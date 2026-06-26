/** @format */

import { Grid, MenuItem } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useParams } from "react-router-dom";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useEditPlanScheduleMutation } from "src/pages/workout-module/planSchedules/services/api";
import { useGetAllWorkoutsQuery } from "src/pages/workout-module/workouts/services/api";
import {
  IPlanSchedule,
  IUpdatePlanScheduleDto,
} from "src/types/modules/workout/planSchedules";
import { IWorkoutsListDto } from "src/types/modules/workout/workouts";
import * as yup from "yup";

interface IEditPlanScheduleProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: IPlanSchedule;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditPlanSchedule: React.FC<IEditPlanScheduleProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { planIdParams } = useParams();

  const [updatePlanSchedule, { isLoading: editLoading, isSuccess, error }] =
    useEditPlanScheduleMutation();

  const {
    changePage: changePageWorkouts,
    data: workoutsList,
    isError: isErrorWorkouts,
    isFetching: isFetchingWorkouts,
    limit: limitWorkouts,
    page: pageWorkouts,
    changeLimit: changeLimitWorkouts,
    setSearchValue: setSearchValueWorkouts,
    searchValue: searchValueWorkouts,
    totalRecords: totalRecordsWorkouts,
    handleDelete: handleDeleteWorkouts,
    refetch: refetchWorkouts,
  } = usePaginateData<IWorkoutsListDto>(useGetAllWorkoutsQuery);

  const refForm = React.useRef<FormikProps<IUpdatePlanScheduleDto>>(null);

  const validationSchema = yup.object({
    day: yup.string().required(String(messages["validation.required"])),
    daytime: yup.string().required(String(messages["validation.required"])),
  });

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  useEffect(() => {
    if (pageWorkouts && pageWorkouts > 1) refetchWorkouts();
  }, [pageWorkouts]);
  return (
    <AppEditModal
      label={label}
      itemName={""}
      open={showEditModal}
      onClose={() => {
        setShowEditModal(false);
      }}
      handleSubmit={submit}
      loading={false}
      errorMessage={""}
      loadingForEdit={editLoading}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth={"sm"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow?.id || "",
          planId: planIdParams || "",
          plan: selectedRow?.plan || null,
          workoutId: selectedRow?.workout?.id || "",
          workout: selectedRow?.workout || null,
          day: selectedRow?.day || 0,
          daytime: selectedRow?.daytime || "AM",
          // isRestDay: selectedRow?.isRestDay || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updatePlanSchedule({ id: selectedRow?.id, data: data });
        }}>
        {({ setFieldValue, errors, touched, values }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <AppSelectField
                  fullWidth
                  size='small'
                  name='day'
                  labelId='planSchedules.day'
                  label={messages["planSchedules.day"] as string}
                  error={Boolean(errors?.day)}>
                  <MenuItem value={0}>
                    <IntlMessages id='planSchedules.day.Monday' />
                  </MenuItem>
                  <MenuItem value={1}>
                    <IntlMessages id='exercises.type.Tuesday' />
                  </MenuItem>
                  <MenuItem value={2}>
                    <IntlMessages id='exercises.type.Wednesday' />
                  </MenuItem>
                  <MenuItem value={3}>
                    <IntlMessages id='exercises.type.Thursday' />
                  </MenuItem>
                  <MenuItem value={4}>
                    <IntlMessages id='exercises.type.Friday' />
                  </MenuItem>
                  <MenuItem value={5}>
                    <IntlMessages id='exercises.type.Saturday' />
                  </MenuItem>
                  <MenuItem value={6}>
                    <IntlMessages id='exercises.type.Sunday' />
                  </MenuItem>
                </AppSelectField>
              </Grid>
              <Grid item xs={4}>
                <AppSelectField
                  fullWidth
                  size='small'
                  name='daytime'
                  labelId='planSchedules.daytime'
                  label={messages["planSchedules.daytime"] as string}
                  error={Boolean(errors?.daytime)}>
                  <MenuItem value={"AM"}>
                    <IntlMessages id='planSchedules.daytime.AM' />
                  </MenuItem>
                  <MenuItem value={"PM"}>
                    <IntlMessages id='planSchedules.daytime.PM' />
                  </MenuItem>
                </AppSelectField>
              </Grid>
              {/* <Grid item xs={4}>
                <AppCheckbox
                  keyName="isRestDay"
                  label="planSchedules.isRestDay"
                  defaultChecked={values?.isRestDay}
                  onChange={setFieldValue}
                />
              </Grid> */}

              <Grid item xs={6}>
                <AppBaseAutoComplete
                  label='workout.name'
                  isLoading={isFetchingWorkouts}
                  options={workoutsList?.data}
                  hasNextPage={workoutsList?.hasNextPage}
                  pageNumber={pageWorkouts}
                  changePage={changePageWorkouts}
                  onChangeAutoComplete={(event, value) => {
                    setFieldValue("workoutId", value ? value?.id : "");
                    changePageWorkouts(1);
                  }}
                  searchText={searchValueWorkouts}
                  onChangeTextField={(value) => {
                    setSearchValueWorkouts(value.target.value);
                    changePageWorkouts(1);
                  }}
                  error={errors.workoutId}
                  touched={touched.workoutId}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditPlanSchedule;
