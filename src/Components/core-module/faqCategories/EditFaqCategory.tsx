/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditFaqCategoriesMutation,
  useGetFaqCategoryQuery
} from "src/pages/core-module/faqCategories/services";

import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateFaqCategories } from "src/types/modules/core/faqCategories";
import * as yup from "yup";

interface IEditFaqCategoryProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditFaqCategory: React.FC<IEditFaqCategoryProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: faqCategoryItem, isLoading: detailsLoading } =
    useGetFaqCategoryQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [updateFaqCategory, { isLoading: editLoading, isSuccess }] =
    useEditFaqCategoriesMutation();

  const refForm = React.useRef<FormikProps<IUpdateFaqCategories>>(null);

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
        locale == "en-US" && selectedRow?.nameEn!
          ? `- ${selectedRow?.nameEn!}`
          : `- ${selectedRow?.nameAr!}`
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
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow?.id || "",
          nameAr: faqCategoryItem?.data?.nameAr || "",
          nameEn: faqCategoryItem?.data?.nameEn || "",
          descriptionAr: faqCategoryItem?.data?.descriptionAr || "",
          descriptionEn: faqCategoryItem?.data?.descriptionEn || "",
          isActive: faqCategoryItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data) => {
          updateFaqCategory({ id: selectedRow?.id, data });
        }}>
        {({ values, setFieldValue }) => (
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
              <Grid item xs={12} display={"flex"} justifyContent={"flex-start"}>
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
    </AppEditModal>
  );
};
export default EditFaqCategory;
