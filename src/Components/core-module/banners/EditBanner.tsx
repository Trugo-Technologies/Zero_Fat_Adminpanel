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
  useGetBannerQuery,
  useUpdateBannerMutation,
} from "src/pages/core-module/banners/services";

import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateBanner } from "src/types/modules/core/banners";
import * as yup from "yup";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
}

const EditBanner: React.FC<IProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: bannerItem, isLoading: detailsLoading } = useGetBannerQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updateBannerMethod, { isLoading: editLoading, isSuccess }] =
    useUpdateBannerMutation();

  const refForm = React.useRef<FormikProps<IUpdateBanner>>(null);

  const validationSchema = yup.object({
    titleAr: yup.string().required(String(messages["validation.required"])),
    titleEn: yup.string().required(String(messages["validation.required"])),
    descriptionAr: yup
      .string()
      .required(String(messages["validation.required"])),
    descriptionEn: yup
      .string()
      .required(String(messages["validation.required"])),
    index: yup.string().required(String(messages["validation.required"])),
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
          titleAr: bannerItem?.data?.titleAr || "",
          titleEn: bannerItem?.data?.titleEn || "",
          imageUrl: bannerItem?.data?.imageUrl || "",
          image: bannerItem?.data?.imageUrl || "",
          descriptionAr: bannerItem?.data?.descriptionAr || "",
          descriptionEn: bannerItem?.data?.descriptionEn || "",
          index: bannerItem?.data?.index || 0,
          isActive: bannerItem?.data?.isActive!,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data) => {
          updateBannerMethod({ id: selectedRow?.id, data });
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

              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='banners.index' />}
                  name='index'
                  variant='outlined'
                  size='small'
                  fullWidth
                  type='number'
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
                  label={<IntlMessages id='common.descriptionAr' />}
                  name='descriptionAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='common.descriptionEn' />}
                  name='descriptionEn'
                  variant='outlined'
                  size='small'
                  fullWidth
                  rows={3}
                  multiline
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
export default EditBanner;
