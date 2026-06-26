/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useAddMeasurementUnitMutation } from "src/pages/nutriplan-module/measurementUnits/services/api";
import { ICreateMeasurmentUnitsDto } from "src/types/modules/nutriplan/measurementUnits";
import * as yup from "yup";

interface IAddMeasurmentUnitProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddMeasurementUnit: React.FC<IAddMeasurmentUnitProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addMeasurementUnit, { isLoading: addLoading, isSuccess }] =
    useAddMeasurementUnitMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    code: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateMeasurmentUnitsDto>>(null);

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
        maxWidth={"sm"}>
        <Formik
          validateOnChange={true}
          initialValues={{
            nameAr: "",
            nameEn: "",
            code: "",
            icon: "",
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addMeasurementUnit(data);
          }}>
          {({ setFieldValue }) => (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='common.nameAr' />}
                    name='nameAr'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='common.nameEn' />}
                    name='nameEn'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='common.code' />}
                    name='code'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <AppImageField
                    name='icon'
                    label='common.icon'
                    placeholder=''
                    accept='image/png, image/jpeg, image/jpg'
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

export default AddMeasurementUnit;
