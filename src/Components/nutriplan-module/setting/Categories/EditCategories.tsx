/** @format */

import { Grid, MenuItem } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditCategoryMutation,
  useGetCategoryQuery,
} from "src/pages/nutriplan-module/Categories/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateCategoryDto } from "src/types/modules/nutriplan/categories";
import * as yup from "yup";

interface IEditCategoryProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditCategory: React.FC<IEditCategoryProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: categoryItem, isLoading: detailsLoading } = useGetCategoryQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updateCategory, { isLoading: editLoading, isSuccess, error }] =
    useEditCategoryMutation();

  const refForm = React.useRef<FormikProps<IUpdateCategoryDto>>(null);

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    categoryType: yup
      .string()
      .required(String(messages["validation.required"])),
  });

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppEditModal
      label={label}
      itemName={
        locale == "en-US" && categoryItem?.data?.nameEn!
          ? `- ${categoryItem?.data?.nameEn!}`
          : `- ${categoryItem?.data?.nameAr!}`
      }
      open={showEditModal}
      onClose={() => {
        setShowEditModal(false);
      }}
      handleSubmit={submit}
      loading={detailsLoading}
      errorMessage={""}
      loadingForEdit={editLoading}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth={"sm"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow?.id || "",
          nameAr: categoryItem?.data?.nameAr || "",
          nameEn: categoryItem?.data?.nameEn || "",
          icon: categoryItem?.data?.iconUrl || "",
          image: categoryItem?.data?.imageUrl || "",
          categoryType: categoryItem?.data?.categoryType || "",
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateCategory({ id: selectedRow?.id, data });
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
    </AppEditModal>
  );
};
export default EditCategory;
