/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { appendToFormData } from "src/Helpers/append-to-form-data";
import {
  useEditEquipmentCategoryMutation,
  useGetEquipmentCategoryQuery,
} from "src/pages/workout-module/equipmentCategories/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateEquipmentCategoryDto } from "src/types/modules/workout/equipmentCategories";
import * as yup from "yup";

interface IEditEquipmentCategoryProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditEquipmentCategory: React.FC<IEditEquipmentCategoryProps> = (
  props
) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: equipmentCategoryItem, isLoading: detailsLoading } =
    useGetEquipmentCategoryQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [
    updateEquipmentCategory,
    { isLoading: editLoading, isSuccess, error },
  ] = useEditEquipmentCategoryMutation();

  const refForm = React.useRef<FormikProps<IUpdateEquipmentCategoryDto>>(null);

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
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
        locale == "en-US" && equipmentCategoryItem?.data?.nameEn!
          ? `- ${equipmentCategoryItem?.data?.nameEn!}`
          : `- ${equipmentCategoryItem?.data?.nameAr!}`
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
          nameAr: equipmentCategoryItem?.data?.nameAr || "",
          nameEn: equipmentCategoryItem?.data?.nameEn || "",
          icon: `${equipmentCategoryItem?.data?.iconUrl}` || "",
          iconUrl: equipmentCategoryItem?.data?.iconUrl,
          isActive: equipmentCategoryItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          const formDataValue = appendToFormData(data);
          updateEquipmentCategory({ id: selectedRow?.id, data: formDataValue });
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
              <Grid item xs={6} display={"flex"} justifyContent={"flex-start"}>
                <AppCustomizedSwitch
                  defaultChecked={equipmentCategoryItem?.data?.isActive}
                  keyName='isActive'
                  onChange={setFieldValue}
                />
              </Grid>
              <Grid item xs={12}>
                <AppImageField
                  name='icon'
                  label={messages["common.icon"] as string}
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
export default EditEquipmentCategory;
