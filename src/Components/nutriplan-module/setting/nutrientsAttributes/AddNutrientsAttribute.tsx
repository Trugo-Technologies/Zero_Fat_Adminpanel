/** @format */

import { Grid, MenuItem } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useAddNutrientsAttributeMutation } from "src/pages/nutriplan-module/nutrientsAttributes/services/api";
import { ICreateNutrientsAttributesDto } from "src/types/modules/nutriplan/nutrientsAttributes";
import * as yup from "yup";

interface IAddNutrientsAttributeProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddNutrientsAttribute: React.FC<IAddNutrientsAttributeProps> = (
  props
) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addNutrientsAttribute, { isLoading: addLoading, isSuccess }] =
    useAddNutrientsAttributeMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    unit: yup.string().required(String(messages["validation.required"])),
  });
  const refForm =
    React.useRef<FormikProps<ICreateNutrientsAttributesDto>>(null);

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
            unit: "",
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addNutrientsAttribute(data);
          }}>
          {({ errors, values }) => (
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
                  <AppSelectField
                    fullWidth
                    size='small'
                    name='unit'
                    defaultValue={values?.unit}
                    labelId='nutrientsAttributes.unit'
                    label={messages["nutrientsAttributes.unit"] as string}
                    error={Boolean(errors?.unit)}>
                    <MenuItem value={"g"} key={"g"}>
                      G
                    </MenuItem>
                    <MenuItem value={"mg"}>MG</MenuItem>
                    <MenuItem value={"μg"}>μg</MenuItem>
                  </AppSelectField>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </AppAddModal>
    </>
  );
};

export default AddNutrientsAttribute;
