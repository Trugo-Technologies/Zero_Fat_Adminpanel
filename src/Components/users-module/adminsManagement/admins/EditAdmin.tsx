/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import MuiPhoneNumber from "material-ui-phone-number";
import React from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { appendToFormData } from "src/Helpers/append-to-form-data";
import {
  useEditAdminMutation,
  useGetAdminQuery,
} from "src/pages/users-module/adminsManagement/admins/services/api";
import { IUpdateAdminDto } from "src/types/modules/users-module/adminsManagement/admins";
import * as yup from "yup";

interface IEditAdminProps {
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  fullName: string;
  id: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditAdmin: React.FC<IEditAdminProps> = (props) => {
  const { setShowEditModal, label, fullName, id } = props;
  const [editAdminMethod, { isSuccess, isLoading }] = useEditAdminMutation();
  const { messages } = useIntl();
  const validationSchema = yup.object({
    fullName: yup.string().required(String(messages["validation.required"])),
    phoneNumber: yup.string().required(String(messages["validation.required"])),
    email: yup
      .string()
      .email(String(messages["validation.emailFormat"]))
      .required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<IUpdateAdminDto>>(null);

  const { data: adminItem, isLoading: detailsLoading } = useGetAdminQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  return (
    <AppEditModal
      label={label}
      itemName={fullName ? ` - ${fullName}` : ""}
      open={true}
      onClose={() => {
        setShowEditModal(false);
      }}
      handleSubmit={submit}
      loading={detailsLoading}
      errorMessage={""}
      loadingForEdit={isLoading}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: id,
          fullName: adminItem?.data?.fullName || fullName,
          isActive: adminItem?.data?.isActive || false,
          email: adminItem?.data?.email || "",
          imageUrl: adminItem?.data?.imageUrl || "",
          image: adminItem?.data?.imageUrl || "",
          phoneNumber: adminItem?.data?.phoneNumber || "",
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={async (data) => {
          editAdminMethod({
            id: id,
            data: appendToFormData(data),
          });
        }}>
        {({ setFieldValue, values, touched, errors }) => {
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
                    defaultValue={values?.phoneNumber}
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
    </AppEditModal>
  );
};

export default EditAdmin;
