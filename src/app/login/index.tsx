import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";

import AppInfoView from "@crema/components/AppInfoView";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useIntl } from "react-intl";
import AppTextField from "@crema/components/AppFormComponents/AppTextField";
import { useJWTAuthActions } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { Fonts } from "@crema/constants/AppEnums";
import AuthWrapper from "./components/AuthWrapper";
import { Yup } from "src/validation";
import { useLoginMutation } from "./services/api";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { setLoginData } from "./services/slice";
type initialValuesType = { email: string; password: string };

const initialValues = {
  email: "",
  password: "",
};
const Login = () => {
  const navigate = useNavigate();
  const { signInUser } = useJWTAuthActions();
  const { messages } = useIntl();

  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    email: Yup.email(),
    password: Yup.password(),
  });
  const onSubmit = (
    { email, password }: initialValuesType,
    helpers: FormikHelpers<initialValuesType>
  ) => {
    return login({
      email,
      mobileNumber: null,
      password,
      fcmToken: null,
      trustDevice: true,
    })
      .unwrap()
      .then((data) => {
        dispatch(setLoginData(data.data));
      })
      .catch((error) => {
        helpers.setSubmitting(false);
      });
  };
  return (
    <AuthWrapper>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", mb: 5 }}>
          <Formik
            validateOnChange={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, errors }) => {
              return (
                <Form
                  style={{ textAlign: "left" }}
                  noValidate
                  autoComplete="off"
                >
                  <Box sx={{ mb: { xs: 5, xl: 8 } }}>
                    <AppTextField
                      placeholder={messages["common.email"] as string}
                      name="email"
                      label={<IntlMessages id="common.email" />}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-input": {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <AppTextField
                      type="password"
                      placeholder={messages["common.password"] as string}
                      label={<IntlMessages id="common.password" />}
                      name="password"
                      variant="outlined"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-input": {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      mb: { xs: 3, xl: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        color="primary"
                        sx={{ ml: -3 }}
                        id="rememberMe"
                      />
                      <Box
                        aria-labelledby="rememberMe"
                        component="span"
                        sx={{
                          color: "grey.700",
                        }}
                      >
                        <IntlMessages id="common.rememberMe" />
                      </Box>
                    </Box>
                  </Box>

                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      sx={{
                        minWidth: 160,
                        fontWeight: Fonts.REGULAR,
                        fontSize: 16,
                        textTransform: "capitalize",
                        padding: "4px 16px 8px",
                      }}
                    >
                      <IntlMessages id="common.login" />
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Box>

        <AppInfoView />
      </Box>
    </AuthWrapper>
  );
};

export default Login;
