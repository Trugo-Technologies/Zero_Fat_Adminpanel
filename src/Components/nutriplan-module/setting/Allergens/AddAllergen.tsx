/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import * as yup from "yup";
import { ICreateAllergensDto } from "src/types/modules/nutriplan/allergens";
import { useAddAllergensMutation } from "src/pages/nutriplan-module/Allergens/services/api";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";

interface IAddAllergenProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddAllergen: React.FC<IAddAllergenProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addAllergens, { isLoading: addLoading, isSuccess }] =
    useAddAllergensMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateAllergensDto>>(null);

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
            icon: "",
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addAllergens(data);
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

export default AddAllergen;
