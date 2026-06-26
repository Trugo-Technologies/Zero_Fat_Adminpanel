/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditWorkoutBodyPartsMutation,
  useGetBodyPartQuery,
} from "src/pages/workout-module/workoutBodyParts/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateWorkoutBodyPartDto } from "src/types/modules/workout/workoutBodyParts";
import * as yup from "yup";

interface IEditBodyPartProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditBodyPart: React.FC<IEditBodyPartProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: bodyPartItem, isLoading: detailsLoading } = useGetBodyPartQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updateWorkoutBodyPart, { isLoading: editLoading, isSuccess, error }] =
    useEditWorkoutBodyPartsMutation();

  const refForm = React.useRef<FormikProps<IUpdateWorkoutBodyPartDto>>(null);

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
        locale == "en-US" && bodyPartItem?.data?.nameEn!
          ? `- ${bodyPartItem?.data?.nameEn!}`
          : `- ${bodyPartItem?.data?.nameAr!}`
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
          nameAr: bodyPartItem?.data?.nameAr || "",
          nameEn: bodyPartItem?.data?.nameEn || "",
          isActive: bodyPartItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateWorkoutBodyPart({ id: selectedRow?.id, data });
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
                  defaultChecked={bodyPartItem?.data?.isActive}
                  keyName='isActive'
                  onChange={setFieldValue}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditBodyPart;
