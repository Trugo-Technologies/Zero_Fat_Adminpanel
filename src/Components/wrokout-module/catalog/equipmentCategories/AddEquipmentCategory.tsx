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
import { ICreateEquipmentCategoryDto } from "src/types/modules/workout/equipmentCategories";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import { useAddEquipmentCategoryMutation } from "src/pages/workout-module/equipmentCategories/services/api";
import { appendToFormData } from "src/Helpers/append-to-form-data";

interface IAddEquipmentCategoryProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddEquipmentCategory: React.FC<IAddEquipmentCategoryProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addEquipmentCategory, { isLoading: addLoading, isSuccess }] =
    useAddEquipmentCategoryMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateEquipmentCategoryDto>>(null);

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
            addEquipmentCategory(appendToFormData(data));
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
                <Grid item xs={12}>
                  <AppImageField
                    label={messages["common.icon"] as string}
                    name='icon'
                    placeholder={""}
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
            // addEquipmentCategory.submitData(data);
          }}
          hideCardContainer={true}
          isError={false}
          loading={false}
        /> */}
      </AppAddModal>
    </>
  );
};

export default AddEquipmentCategory;
