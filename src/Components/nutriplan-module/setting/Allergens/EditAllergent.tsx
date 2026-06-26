/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditAllergensMutation,
  useGetAllergensQuery,
} from "src/pages/nutriplan-module/Allergens/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateAllergenDto } from "src/types/modules/nutriplan/allergens";
import * as yup from "yup";

interface IEditAllergenProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditAllergen: React.FC<IEditAllergenProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: AllergentItem, isLoading: detailsLoading } =
    useGetAllergensQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [updateAllergens, { isLoading: editLoading, isSuccess, error }] =
    useEditAllergensMutation();

  const refForm = React.useRef<FormikProps<IUpdateAllergenDto>>(null);

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
        locale == "en-US" && AllergentItem?.data?.nameEn!
          ? `- ${AllergentItem?.data?.nameEn!}`
          : `- ${AllergentItem?.data?.nameAr!}`
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
          nameAr: AllergentItem?.data?.nameAr || "",
          nameEn: AllergentItem?.data?.nameEn || "",
          icon: AllergentItem?.data?.iconUrl || "",
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateAllergens({ id: selectedRow?.id, data: data });
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
    </AppEditModal>
  );
};
export default EditAllergen;
