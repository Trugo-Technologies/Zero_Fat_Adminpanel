/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppPasswordField from "src/@crema/components/AppFormComponents/AppPasswordField";
import { passwordRegex } from "src/@crema/constants/AppConst";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useResetAdminPasswordMutation } from "src/pages/users-module/adminsManagement/admins/services/api";
import { IResetAdminPasswordDto } from "src/types/modules/users-module/adminsManagement/admins";
import * as yup from "yup";

interface IAddAdminProps {
  setShowResetPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  id: string;
  fullName: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const ResetAdminPassword: React.FC<IAddAdminProps> = (props) => {
  const { id, setShowResetPasswordModal, label, fullName } = props;
  const { messages } = useIntl();
  const [resetAdminPasswordMethod, { isSuccess, isLoading }] =
    useResetAdminPasswordMutation();

  const validationSchema = yup.object({
    newPassword: yup
      .string()
      .min(8, String(messages["validation.password.min"]))
      .max(25, String(messages["validation.password.max"]))
      .matches(passwordRegex, String(messages["validation.password.special"]))
      .required(String(messages["validation.required"])),
    confirmPassword: yup
      .string()
      .required(String(messages["validation.required"]))
      .oneOf(
        [yup.ref("newPassword")],
        String(messages["validation.confirmPassword"])
      ),
  });
  const refForm = React.useRef<FormikProps<IResetAdminPasswordDto>>(null);
  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  return (
    <AppAddModal
      label={label}
      open={true}
      itemName={` - ${fullName}`}
      labelForAddBtn='common.save'
      onClose={() => setShowResetPasswordModal(false)}
      closeModalState={setShowResetPasswordModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForAdd={isLoading}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          userId: id,
          newPassword: "",
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={(data) => {
          delete data["confirmPassword"];
          resetAdminPasswordMethod(data);
        }}>
        {() => {
          return (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <AppPasswordField
                    name='newPassword'
                    label='common.newPassword'
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppPasswordField
                    name='confirmPassword'
                    label='common.confirmPassword'
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

export default ResetAdminPassword;
