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

import {
  useEditPhysicalActivityLevelsMutation,
  useGetPhysicalActivityLevelsQuery,
} from "src/pages/core-module/physicalActivityLevels/services";

import { ISelectedRow } from "src/types/baseEntity";
import { IUpdatePhysicalActivityLevel } from "src/types/modules/core/physicalActivityLevels";
import * as yup from "yup";

interface IEditPhysicalActivityLevelProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditPhysicalActivityLevel: React.FC<IEditPhysicalActivityLevelProps> = (
  props
) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: physicalActivityLevelItem, isLoading: detailsLoading } =
    useGetPhysicalActivityLevelsQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [
    updatePhysicalActivityLevelMethod,
    { isLoading: editLoading, isSuccess, error },
  ] = useEditPhysicalActivityLevelsMutation();

  const refForm = React.useRef<FormikProps<IUpdatePhysicalActivityLevel>>(null);

  const validationSchema = yup.object({
    exampleAr: yup.string().required(String(messages["validation.required"])),
    exampleEn: yup.string().required(String(messages["validation.required"])),
    activityValue: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"])),
    descriptionAr: yup
      .string()
      .required(String(messages["validation.required"])),
    descriptionEn: yup
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
          exampleAr: physicalActivityLevelItem?.data?.exampleAr || "",
          exampleEn: physicalActivityLevelItem?.data?.exampleEn || "",
          activityValue: physicalActivityLevelItem?.data?.activityValue || null,
          imageUrl: physicalActivityLevelItem?.data?.imageUrl || "",
          image: physicalActivityLevelItem?.data?.imageUrl || "",
          descriptionAr: physicalActivityLevelItem?.data?.descriptionAr || "",
          descriptionEn: physicalActivityLevelItem?.data?.descriptionEn || "",
          isActive: physicalActivityLevelItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updatePhysicalActivityLevelMethod({ id: selectedRow?.id, data });
        }}>
        {({ errors, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='physicalActivityLevels.exampleAr' />}
                  name='exampleAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='physicalActivityLevels.exampleEn' />}
                  name='exampleEn'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <AppTextField
                  label={
                    <IntlMessages id='physicalActivityLevels.activityValue' />
                  }
                  name='activityValue'
                  type='number'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} display={"flex"} justifyContent={"flex-start"}>
                <AppCustomizedSwitch
                  defaultChecked={values?.isActive}
                  keyName='isActive'
                  onChange={setFieldValue}
                />
              </Grid>

              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='trainers.descriptionAr' />}
                  name='descriptionAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='trainers.descriptionEn' />}
                  name='descriptionEn'
                  variant='outlined'
                  size='small'
                  fullWidth
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
export default EditPhysicalActivityLevel;
