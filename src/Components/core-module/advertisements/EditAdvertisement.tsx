/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useGetAdvertisementsQuery,
  useUpdateAdvertisementsMutation,
} from "src/pages/core-module/advertisements/services";

import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateAdvertisement } from "src/types/modules/core/advertisements";
import * as yup from "yup";

interface IEditAdvertisementProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditAdvertisement: React.FC<IEditAdvertisementProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: advertisementItem, isLoading: detailsLoading } =
    useGetAdvertisementsQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [
    updateAdvertisementMethod,
    { isLoading: editLoading, isSuccess, error },
  ] = useUpdateAdvertisementsMutation();

  const refForm = React.useRef<FormikProps<IUpdateAdvertisement>>(null);

  const validationSchema = yup.object({
    titleAr: yup.string().required(String(messages["validation.required"])),
    titleEn: yup.string().required(String(messages["validation.required"])),

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
          titleAr: advertisementItem?.data?.titleAr || "",
          titleEn: advertisementItem?.data?.titleEn || "",
          welcomeMsgAr: advertisementItem?.data?.welcomeMsgAr || "",
          welcomeMsgEn: advertisementItem?.data?.welcomeMsgEn || "",
          imageUrl: advertisementItem?.data?.imageUrl || "",
          image: advertisementItem?.data?.imageUrl || "",
          descriptionAr: advertisementItem?.data?.descriptionAr || "",
          descriptionEn: advertisementItem?.data?.descriptionEn || "",
          isActive: advertisementItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data) => {
          updateAdvertisementMethod({ id: selectedRow?.id, data });
        }}>
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='common.titleAr' />}
                  name='titleAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='common.titleEn' />}
                  name='titleEn'
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
                  name='welcomeMsgAr'
                  label='advertisements.welcomeMsgAr'
                />
              </Grid>
              <Grid item xs={6}>
                <AppFreeEditor
                  name='welcomeMsgEn'
                  label='advertisements.welcomeMsgEn'
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
export default EditAdvertisement;
