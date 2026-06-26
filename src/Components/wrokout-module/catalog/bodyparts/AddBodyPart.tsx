/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import * as yup from "yup";
import { useAddWorkoutBodyPartsMutation } from "src/pages/workout-module/workoutBodyParts/services/api";
import { ICreateWorkoutBodyPartDto } from "src/types/modules/workout/workoutBodyParts";

interface IAddBodyPartProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddBodyPart: React.FC<IAddBodyPartProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addWorkoutBodyPart, { isLoading: addLoading, isSuccess }] =
    useAddWorkoutBodyPartsMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateWorkoutBodyPartDto>>(null);

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
            isActive: true,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addWorkoutBodyPart(data);
            // addWorkoutBodyPart.submitData(data);
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

                <Grid
                  item
                  xs={6}
                  display={"flex"}
                  justifyContent={"flex-start"}>
                  <AppCustomizedSwitch
                    keyName='isActive'
                    onChange={setFieldValue}
                  />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        {/* <GenerateForm
          isMultiLanguage={false}
          fields={fields}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (data, { setSubmitting }) => {
            // addWorkoutBodyPart.submitData(data);
          }}
          hideCardContainer={true}
          isError={false}
          loading={false}
        /> */}
      </AppAddModal>
    </>
  );
};

export default AddBodyPart;
