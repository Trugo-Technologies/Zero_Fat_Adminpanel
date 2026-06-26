/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useAddAdvertisementsMutation } from "src/pages/core-module/advertisements/services";
import { ICreateAdvertisement } from "src/types/modules/core/advertisements";
import * as yup from "yup";

interface IAddAdvertisementProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddAdvertisement: React.FC<IAddAdvertisementProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addAdvertisementMethod, { isLoading: addLoading, isSuccess }] =
    useAddAdvertisementsMutation();

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
  const refForm = React.useRef<FormikProps<ICreateAdvertisement>>(null);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <>
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
            welcomeMsgAr: "",
            welcomeMsgEn: "",
            image: "",
            isActive: false,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data) => {
            addAdvertisementMethod(data);
          }}>
          {({ errors, setFieldValue, values }) => (
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
                <Grid
                  item
                  xs={12}
                  display={"flex"}
                  justifyContent={"flex-start"}>
                  <AppCustomizedSwitch
                    defaultChecked={values?.isActive}
                    keyName='isActive'
                    onChange={setFieldValue}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppFreeEditor
                    name='welcomeMsgAr'
                    label='advertisements.welcomeMsgAr'
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppFreeEditor
                    name='welcomeMsgEn'
                    label='advertisements.welcomeMsgEn'
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppFreeEditor
                    name='descriptionAr'
                    label='trainers.descriptionAr'
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppFreeEditor
                    name='descriptionEn'
                    label='trainers.descriptionEn'
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
    </>
  );
};

export default AddAdvertisement;
