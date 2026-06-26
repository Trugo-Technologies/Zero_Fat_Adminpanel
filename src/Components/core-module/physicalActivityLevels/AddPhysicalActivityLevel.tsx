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
import { useAddPhysicalActivityLevelsMutation } from "src/pages/core-module/physicalActivityLevels/services";
import { ICreatePhysicalActivityLevel } from "src/types/modules/core/physicalActivityLevels";
import * as yup from "yup";

interface IAddPhysicalActivityLevelProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddPhysicalActivityLevel: React.FC<IAddPhysicalActivityLevelProps> = (
  props
) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addPhysicalActivityLevelMethod, { isLoading: addLoading, isSuccess }] =
    useAddPhysicalActivityLevelsMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    exampleAr: yup.string().required(String(messages["validation.required"])),
    exampleEn: yup.string().required(String(messages["validation.required"])),
    activityValue: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"])),
    descriptionAr: yup
      .string()
      .required(String(messages["validation.required"])),
    descriptionEn: yup
      .string()
      .required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreatePhysicalActivityLevel>>(null);

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
            exampleAr: "",
            exampleEn: "",
            descriptionAr: "",
            descriptionEn: "",
            activityValue: null,
            image: "",
            isActive: false,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addPhysicalActivityLevelMethod(data);
          }}>
          {({ errors, setFieldValue, values }) => (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <AppTextField
                    label={
                      <IntlMessages id='physicalActivityLevels.exampleAr' />
                    }
                    name='exampleAr'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <AppTextField
                    label={
                      <IntlMessages id='physicalActivityLevels.exampleEn' />
                    }
                    name='exampleEn'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <AppTextField
                    label={
                      <IntlMessages id='physicalActivityLevels.activityValue' />
                    }
                    name='activityValue'
                    type='number'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  display={"flex"}
                  justifyContent={"flex-start"}>
                  <AppCustomizedSwitch
                    defaultChecked={values?.isActive}
                    keyName='isActive'
                    onChange={setFieldValue}
                  />
                </Grid>

                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='trainers.descriptionAr' />}
                    name='descriptionAr'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='trainers.descriptionEn' />}
                    name='descriptionEn'
                    variant='outlined'
                    size='small'
                    fullWidth
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

export default AddPhysicalActivityLevel;
