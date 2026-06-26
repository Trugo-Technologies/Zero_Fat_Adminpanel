/** @format */

import { Grid, Typography } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import OutlinedPasswordInput from "src/Components/formik-input/outlined-password-input";
import OutlinedTextInput from "src/Components/formik-input/outlined-text-input";
import GenericButton from "src/Components/generic-button";
import { useLoginMutation } from "../services/api";
import { Yup } from "src/validation";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { setLoginData } from "../services/slice";
import { useTranslation } from "src/hooks/use-translation";
type initialValuesType = { username: string; password: string };

const initialValues = {
  username: "",
  password: "",
};
const LoginForm = () => {
  const { t } = useTranslation("translation");
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    username: Yup.username(4),
    password: Yup.password(),
  });

  const onSubmit = (
    values: initialValuesType,
    helpers: FormikHelpers<initialValuesType>
  ) => {
    login(values)
      .unwrap()
      .then((data) => {
        dispatch(setLoginData(data));
      })
      .catch((error) => {
        helpers.setSubmitting(false);
      });
  };

  return (
    <Grid
      sx={{ minWidth: "350px", width: "100%" }}
      container
      spacing={2}
      alignItems='center'
      justifyContent='center'>
      <Grid item xs={12} sx={{ margin: "0px 20px" }}>
        <Typography variant='h2'>{t("welcome")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}>
          {({ values, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <OutlinedTextInput
                    name='username'
                    label={"username"}
                    type='text'
                  />
                </Grid>
                <Grid item xs={12}>
                  <OutlinedPasswordInput name='password' label={"password"} />
                </Grid>
                <Grid item xs={12}>
                  <GenericButton
                    loading={isSubmitting}
                    title='submit'
                    type='submit'
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
