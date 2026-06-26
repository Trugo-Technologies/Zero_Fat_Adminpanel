/** @format */

import { Grid, MenuItem } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useAddCategoryMutation } from "src/pages/nutriplan-module/Categories/services/api";
import { categoryType } from "src/types/enums";
import { ICreateCategoriesDto } from "src/types/modules/nutriplan/categories";
import * as yup from "yup";

interface IAddCategoryProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddCategory: React.FC<IAddCategoryProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addCategory, { isLoading: addLoading, isSuccess }] =
    useAddCategoryMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    categoryType: yup
      .string()
      .required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateCategoriesDto>>(null);

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
            image: "",
            categoryType: "",
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addCategory(data);
          }}>
          {({ errors }) => (
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
                    name='categoryType'
                    labelId='categories.categoryType'
                    label={messages["categories.categoryType"] as string}
                    error={Boolean(errors?.categoryType)}>
                    <MenuItem value={categoryType.Recipe}>
                      <IntlMessages id='categories.categoryType.Recipe' />
                    </MenuItem>
                    <MenuItem value={categoryType.Ingredient}>
                      <IntlMessages id='categories.categoryType.Ingredient' />
                    </MenuItem>
                  </AppSelectField>
                  {/* <SelectInput
                    options={[
                      { key: 'Recipe', value: 'Recipe' },
                      { key: 'Ingredient', value: 'Ingredient' },
                    ]}
                    name="categoryType"
                    label="common.CategoryType"
                  /> */}
                </Grid>
                <Grid item xs={12}>
                  <AppImageField
                    name='icon'
                    label='common.icon'
                    placeholder=''
                    accept='image/png, image/jpeg, image/jpg'
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

export default AddCategory;
