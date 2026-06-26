/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import MuiPhoneNumber from "material-ui-phone-number";
import React from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppPasswordField from "src/@crema/components/AppFormComponents/AppPasswordField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import { passwordRegex } from "src/@crema/constants/AppConst";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { appendToFormData } from "src/Helpers/append-to-form-data";
import { useAddAdminMutation } from "src/pages/users-module/adminsManagement/admins/services/api";
import { ICreateAdminDto } from "src/types/modules/users-module/adminsManagement/admins";
import * as yup from "yup";

interface IAddAdminProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddAdmin: React.FC<IAddAdminProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;
  const { messages, formatMessage } = useIntl();
  const [addAdminMethod, { isSuccess, isLoading }] = useAddAdminMutation();

  const validationSchema = yup.object({
    fullName: yup.string().required(String(messages["validation.required"])),
    phoneNumber: yup.string().required(String(messages["validation.required"])),
    email: yup
      .string()
      .email(String(messages["validation.emailFormat"]))
      .required(String(messages["validation.required"])),
    password: yup
      .string()
      .min(8, String(messages["validation.password.min"]))
      .max(25, String(messages["validation.password.max"]))
      .matches(passwordRegex, String(messages["validation.password.special"]))
      .required(String(messages["validation.required"])),
    confirmPassword: yup
      .string()
      .required(String(messages["validation.required"]))
      .oneOf(
        [yup.ref("password")],
        String(messages["validation.confirmPassword"])
      ),
  });
  const refForm = React.useRef<FormikProps<ICreateAdminDto>>(null);
  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  return (
    <AppAddModal
      label={label}
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
          fullName: "",
          email: "",
          isActive: true,
          password: "",
          phoneNumber: "",
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={async (data) => {
          addAdminMethod(appendToFormData(data));
        }}>
        {({ setFieldValue, errors, values, touched }) => {
          return (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='common.fullName' />}
                    name='fullName'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='common.email' />}
                    name='email'
                    variant='outlined'
                    size='small'
                    type='email'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <MuiPhoneNumber
                    variant='outlined'
                    label='phone'
                    value={values.phoneNumber}
                    name='phoneNumber'
                    fullWidth
                    defaultCountry='ae'
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    InputProps={{
                      style: {
                        height: "40px", // Set the height to 150px
                      },
                    }}
                    onChange={(value) => {
                      setFieldValue("phoneNumber", value);
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <AppPasswordField name='password' label='common.password' />
                </Grid>
                <Grid item xs={6}>
                  <AppPasswordField
                    name='confirmPassword'
                    label='common.confirmPassword'
                  />
                </Grid>

                <Grid item xs={6} display={"flex"} alignItems='start'>
                  <AppCustomizedSwitch
                    keyName='isActive'
                    onChange={setFieldValue}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppImageField
                    label={"common.image"}
                    name='image'
                    placeholder={""}
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

export default AddAdmin;
