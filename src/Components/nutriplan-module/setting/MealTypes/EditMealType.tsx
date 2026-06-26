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
  useEditMealTypeMutation,
  useGetMealTypeQuery,
} from "src/pages/nutriplan-module/MealTypes/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateMealTypeDto } from "src/types/modules/nutriplan/mealTypes";
import * as yup from "yup";

interface IEditMealTypesProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditMealType: React.FC<IEditMealTypesProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: mealTypesItem, isLoading: detailsLoading } =
    useGetMealTypeQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [updateMealType, { isLoading: editLoading, isSuccess, error }] =
    useEditMealTypeMutation();

  const refForm = React.useRef<FormikProps<IUpdateMealTypeDto>>(null);

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
        locale == "en-US" && mealTypesItem?.data?.nameEn!
          ? `- ${mealTypesItem?.data?.nameEn!}`
          : `- ${mealTypesItem?.data?.nameAr!}`
      }
      open={showEditModal}
      onClose={() => {
        setShowEditModal(false);
      }}
      handleSubmit={submit}
      loading={detailsLoading}
      errorMessage={(error as any) || null}
      loadingForEdit={editLoading}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth={"sm"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow?.id || "",
          nameAr: mealTypesItem?.data?.nameAr || "",
          nameEn: mealTypesItem?.data?.nameEn || "",
          icon: mealTypesItem?.data?.iconUrl || "",
          image: mealTypesItem?.data?.imageUrl || "",
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateMealType({ id: selectedRow?.id, data });
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
export default EditMealType;
