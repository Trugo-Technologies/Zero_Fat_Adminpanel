/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useCreateFaqCategoriesMutation } from "src/pages/core-module/faqCategories/services";
import { ICreateFaqCategories } from "src/types/modules/core/faqCategories";
import * as yup from "yup";

interface IAddFaqCategoryProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddFaqCategory: React.FC<IAddFaqCategoryProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addFaqCategoryMethod, { isLoading: addLoading, isSuccess }] =
    useCreateFaqCategoriesMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateFaqCategories>>(null);

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
            nameAr: "",
            nameEn: "",
            descriptionAr: "",
            descriptionEn: "",
            isActive: false,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data) => {
            addFaqCategoryMethod(data);
          }}>
          {({ setFieldValue, values }) => (
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
              </Grid>
            </Form>
          )}
        </Formik>
      </AppAddModal>
    </>
  );
};

export default AddFaqCategory;
