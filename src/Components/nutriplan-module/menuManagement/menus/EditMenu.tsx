/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppDatePicker from "src/Components/baseComponents/inputs/dateTimePickers/AppDatePicker";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditMenuMutation,
  useGetMenuQuery,
} from "src/pages/nutriplan-module/menuManagement/menus/services/api";

import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateMenuDto } from "src/types/modules/nutriplan/menuManagement/menus";
import * as yup from "yup";

interface IEditMenuProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditMenu: React.FC<IEditMenuProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: categoryItem, isLoading: detailsLoading } = useGetMenuQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updateMenuMethod, { isLoading: editLoading, isSuccess, error }] =
    useEditMenuMutation();

  const refForm = React.useRef<FormikProps<IUpdateMenuDto>>(null);

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    startDate: yup
      .string()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .required(String(messages["validation.required"])),

    endDate: yup
      .string()
      .nullable()
      .typeError(String(messages["validation.required"]))
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
      loadingForEdit={
        editLoading
      }
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth={"sm"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow?.id || "",
          nameAr: categoryItem?.data?.nameAr || "",
          nameEn: categoryItem?.data?.nameEn || "",
          startDate: categoryItem?.data?.startDate || "",
          endDate: categoryItem?.data?.endDate || "",
          isPublished: categoryItem?.data?.isPublished || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateMenuMethod({ id: selectedRow?.id, data });
        }}>
        {({ errors, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='common.nameAr' />}
                  name='nameAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='common.nameEn' />}
                  name='nameEn'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <AppCheckbox
                  keyName='isPublished'
                  label='menus.isPublished'
                  defaultChecked={values?.isPublished}
                  onChange={setFieldValue}
                />
              </Grid>
              <Grid item xs={4}>
                <AppDatePicker
                  label='common.startDate'
                  name='startDate'
                  onChange={setFieldValue}
                  value={values?.startDate}
                  errorText={errors?.startDate}
                />
              </Grid>
              <Grid item xs={4}>
                <AppDatePicker
                  label='common.endDate'
                  name='endDate'
                  onChange={setFieldValue}
                  value={values?.startDate}
                  errorText={errors?.endDate}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditMenu;
