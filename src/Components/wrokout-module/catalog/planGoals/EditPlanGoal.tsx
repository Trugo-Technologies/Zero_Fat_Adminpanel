/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { appendToFormData } from "src/Helpers/append-to-form-data";
import {
  useEditPlanGoalMutation,
  useGetPlanGoalQuery,
} from "src/pages/workout-module/planGoals/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdatePlanGoalDto } from "src/types/modules/workout/planGoals";
import * as yup from "yup";

interface IEditPlanGoalProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditPlanGoal: React.FC<IEditPlanGoalProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: planGoalItem, isLoading: detailsLoading } = useGetPlanGoalQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updatePlanGoal, { isLoading: editLoading, isSuccess, error }] =
    useEditPlanGoalMutation();

  const refForm = React.useRef<FormikProps<IUpdatePlanGoalDto>>(null);

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
        locale == "en-US" && planGoalItem?.data?.nameEn!
          ? `- ${planGoalItem?.data?.nameEn!}`
          : `- ${planGoalItem?.data?.nameAr!}`
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
          nameAr: planGoalItem?.data?.nameAr || "",
          nameEn: planGoalItem?.data?.nameEn || "",
          image: `${planGoalItem?.data?.imageUrl}` || "",
          imageUrl: planGoalItem?.data?.imageUrl,
          isActive: planGoalItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          const formDataValue = appendToFormData(data);
          updatePlanGoal({ id: selectedRow?.id, data: formDataValue });
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
                  defaultChecked={planGoalItem?.data?.isActive}
                  keyName='isActive'
                  onChange={setFieldValue}
                />
              </Grid>
              <Grid item xs={12}>
                <AppImageField
                  name='image'
                  label={"common.image"}
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
export default EditPlanGoal;
