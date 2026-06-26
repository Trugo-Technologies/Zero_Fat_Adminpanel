/** @format */

import { Grid } from "@mui/material";
import { Formik } from "formik";
import { FormikOnSubmitType } from "src/types";
import { Yup } from "src/validation";
import DateInput from "src/Components/formik-input/date-input";
import GenericButton from "../generic-button";

function DateFilter({
  onSubmit,
}: {
  onSubmit: FormikOnSubmitType<{
    startDate: string;
    endDate: string;
  }>;
}) {
  const initialValues = {
    startDate: "",
    endDate: "",
  };

  const validationSchema = Yup.object({
    startDate: Yup.dateRequired(),
    endDate: Yup.endDate("startDate"),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      {({
        handleSubmit,
        isSubmitting,
        resetForm,
        submitForm,
        setFieldValue,
      }) => (
        <>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <DateInput label='startDate' name='startDate' disableFuture />
              </Grid>
              <Grid item xs={6}>
                <DateInput label='endDate' name='endDate' disableFuture />
              </Grid>

              <Grid item xs={6} md={3} alignSelf='center' mt={1}>
                <GenericButton
                  variant={isSubmitting ? "outlined" : "contained"}
                  title={"submit"}
                  type={"submit"}
                  loading={false}
                />
              </Grid>
            </Grid>
            <br />
          </form>
        </>
      )}
    </Formik>
  );
}

export default DateFilter;
