/** @format */

import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useAddPlanScheduleMutation } from "src/pages/workout-module/planSchedules/services/api";
import { useGetAllWorkoutsQuery } from "src/pages/workout-module/workouts/services/api";
import { ICreatePlanScheduleDto } from "src/types/modules/workout/planSchedules";
import { IWorkoutsListDto } from "src/types/modules/workout/workouts";
import * as yup from "yup";

interface IAddPlanScheduleProps {
  label: string;
  planId: string;
  daysPerWeek: number;
}

const AddPlanSchedule: React.FC<IAddPlanScheduleProps> = (props) => {
  const { planId, label, daysPerWeek } = props;

  const [addPlanScheduleMethod, { isLoading: addLoading, isSuccess }] =
    useAddPlanScheduleMutation();

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

  const { messages } = useIntl();

  const validationSchema = yup.object({
    day: yup
      .string()
      .nullable()
      .required(String(messages["validation.required"])),
    // .when("isRestDay", {
    //   is: (isRestDay: boolean) => !isRestDay,
    //   then: () =>
    //     yup.string().required(String(messages["validation.required"])),
    //   otherwise: () => yup.string().nullable().notRequired(),
    // }),
    // daytime: yup.string().required(String(messages['validation.required'])),
    workoutId: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreatePlanScheduleDto>>(null);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  useEffect(() => {
    if (pageWorkouts && pageWorkouts > 1) refetchWorkouts();
  }, [pageWorkouts]);
  return (
    <>
      <LoadingAndErrorWrapper isLoading={addLoading} errorMessage={""}>
        <Formik
          validateOnChange={true}
          initialValues={{
            planId: planId || "",
            workoutId: "",
            day: 1,
            daytime: null,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addPlanScheduleMethod(data);
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
                    {daysPerWeek &&
                      Number(daysPerWeek) > 0 &&
                      Array(Number(daysPerWeek) || 0)
                        .fill(null)
                        .map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            <IntlMessages id='common.today' /> {i + 1}
                          </MenuItem>
                        ))}
                  </AppSelectField>
                </Grid>
                <Grid item xs={4}>
                  <FormControl variant='outlined' fullWidth size='small'>
                    <InputLabel id='select-footer'>
                      {messages["planSchedules.daytime"] as string}
                    </InputLabel>

                    <Select
                      value={values?.daytime}
                      defaultValue={values?.daytime}
                      fullWidth
                      size='small'
                      name='daytime'
                      labelId='planSchedules.daytime'
                      label={messages["planSchedules.daytime"] as string}
                      onChange={(event) => {
                        if (event.target.value === "null") {
                          setFieldValue("daytime", null);
                        } else {
                          setFieldValue("daytime", event.target.value);
                        }
                      }}>
                      <MenuItem value={"null"}>
                        <IntlMessages id='common.noValue' />
                      </MenuItem>
                      <MenuItem value={"AM"}>
                        <IntlMessages id='planSchedules.daytime.AM' />
                      </MenuItem>
                      <MenuItem value={"PM"}>
                        <IntlMessages id='planSchedules.daytime.PM' />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4}>
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
                {/* <Grid item xs={4}>
                  <AppCheckbox
                    keyName="isRestDay"
                    label="planSchedules.isRestDay"
                    defaultChecked={values?.isRestDay}
                    onChange={(field: string, value: boolean) => {
                      setFieldValue("daytime", null);
                      setFieldValue("day", null);

                      setFieldValue("isRestDay", value);
                    }}
                  />
                </Grid> */}
              </Grid>
            </Form>
          )}
        </Formik>
      </LoadingAndErrorWrapper>

      <Grid item xs={12} mt={6} display='flex' justifyContent={"end"}>
        <AppButton
          label={label}
          loading={addLoading}
          onClick={() => {
            submit();
          }}
        />
      </Grid>
    </>
  );
};

export default AddPlanSchedule;
