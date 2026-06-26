/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useAddBannerMutation } from "src/pages/core-module/banners/services";
import { ICreateBanner } from "src/types/modules/core/banners";
import * as yup from "yup";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}

const AddBanner: React.FC<IProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;
  const refForm = React.useRef<FormikProps<ICreateBanner>>(null);
  const [addBannerMethod, { isLoading: addLoading, isSuccess }] =
    useAddBannerMutation();
  const { messages } = useIntl();
  const validationSchema = yup.object({
    titleAr: yup.string().required(String(messages["validation.required"])),
    titleEn: yup.string().required(String(messages["validation.required"])),
    descriptionAr: yup
      .string()
      .required(String(messages["validation.required"])),
    descriptionEn: yup
      .string()
      .required(String(messages["validation.required"])),
  });

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
      loadingForAdd={addLoading}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          titleAr: "",
          titleEn: "",
          descriptionAr: "",
          descriptionEn: "",
          image: "",
          isActive: false,
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={addBannerMethod}>
        {({ setFieldValue, values }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='common.titleAr' />}
                  name='titleAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='common.titleEn' />}
                  name='titleEn'
                  variant='outlined'
                  size='small'
                  fullWidth
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
                  label={<IntlMessages id='common.descriptionAr' />}
                  name='descriptionAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                  rows={3}
                  multiline
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='common.descriptionEn' />}
                  name='descriptionEn'
                  variant='outlined'
                  size='small'
                  fullWidth
                  rows={3}
                  multiline
                />
              </Grid>

              <Grid item xs={12}>
                <AppImageField
                  name='image'
                  label='common.image'
                  placeholder=''
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppAddModal>
  );
};

export default AddBanner;
