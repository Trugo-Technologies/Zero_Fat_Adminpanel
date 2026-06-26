/** @format */

import { useTheme } from "@emotion/react";
import InfoIcon from "@mui/icons-material/Info";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Grid, Step, StepIconProps, StepLabel, Stepper } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppStepperEditModal from "src/Components/baseComponents/modals/stepper/AppStepperEditModal";
import { ColorLibConnector } from "src/Components/baseComponents/modals/stepper/ColorLibConnector";
import { ColorLibStepIconRoot } from "src/Components/baseComponents/modals/stepper/ColorLibStepIconRoot";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import {
  useGetPlanByIdQuery,
  useUpdatePlanMutation,
} from "src/pages/workout-module/workoutPLans/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { workoutEnvironment } from "src/types/enums";
import { IUpdateWorkoutPlansDto } from "src/types/modules/workout/workoutPlans";
import FirstStep from "src/Components/wrokout-module/catalog/pLans/addSteps/FirstStep";
import SecondStep from "src/Components/wrokout-module/catalog/pLans/addSteps/SecondStep";
import createValidationSchemas from "src/Components/wrokout-module/catalog/pLans/validations";
interface IEditPlanProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: ISelectedRow;
}

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  const theme = useTheme();

  const icons: { [index: string]: React.ReactElement<any> } = {
    1: <InfoIcon />,
    2: <WorkspacePremiumIcon />,
  };

  return (
    <ColorLibStepIconRoot
      ownerState={{ completed: Boolean(completed), active: Boolean(active) }}
      className={className}>
      {icons[String(props.icon)]}
    </ColorLibStepIconRoot>
  );
}
const EditPlan: React.FC<IEditPlanProps> = (props) => {
  const refForm = React.useRef<FormikProps<IUpdateWorkoutPlansDto>>(null);

  const { showEditModal, setShowEditModal, selectedRow } = props;
  const { messages } = useIntl();
  const [activeStep, setActiveStep] = useState(0);

  const validationSchemas = createValidationSchemas(messages);

  const steps = [
    {
      label: "trainers.basicInformation",
      icon: () => <InfoIcon fontSize='medium' />,
    },
    {
      label: "trainers.additionalInfo",
      icon: () => <WorkspacePremiumIcon fontSize='medium' />,
    },
  ];
  // queries
  const [editPlanMethod, { isSuccess, isLoading: editLoading }] =
    useUpdatePlanMutation();
  const { data: planItem, isLoading: detailsLoading } = useGetPlanByIdQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const handleNext = async () => {
    if (refForm.current) {
      await refForm.current.validateForm();
      const errors = refForm.current.errors;

      if (Object.keys(errors).length > 0) {
        return;
      }
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleSubmit = async (data: IUpdateWorkoutPlansDto) => {
    if (activeStep === steps.length - 1) {
      await editPlanMethod({ id: selectedRow?.id, data });
    } else {
      handleNext();
    }
  };

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <>
      <AppStepperEditModal
        handleBack={activeStep > 0 ? () => handleBack() : undefined}
        handleSubmit={submit}
        labelForEditBtn={
          activeStep === steps.length - 1 ? "common.save" : "common.next"
        }
        loadingForEdit={editLoading}
        loading={detailsLoading}
        label='workoutPlan.edit'
        open={showEditModal}
        errorMessage=''
        itemName={` - ${getValueBasedOnCurrentLanguage(selectedRow?.nameAr || "", selectedRow?.nameEn || "")}`}
        onClose={() => setShowEditModal(false)}
        closeModalState={setShowEditModal}
        successClose={isSuccess}
        maxWidth={"lg"}>
        <Formik
          validationSchema={validationSchemas[activeStep]}
          validateOnChange={true}
          initialValues={{
            id: selectedRow?.id,
            nameAr: planItem?.data?.nameAr || "",
            nameEn: planItem?.data?.nameEn || "",
            avatarImage: planItem?.data?.avatarImageUrl || "",
            avatarImageUrl: planItem?.data?.avatarImageUrl || "",
            environment: planItem?.data?.environment || workoutEnvironment.Home,
            equipmentCategoryId: planItem?.data?.equipmentCategory?.id || "",
            equipmentCategory: planItem?.data?.equipmentCategory || null,
            profileMedia: planItem?.data?.profileMediaUrl || "",
            profileMediaUrl: planItem?.data?.profileMediaUrl || "",
            daysPerWeek: planItem?.data?.daysPerWeek || null,
            weeklyRepetition: planItem?.data?.weeklyRepetition || null,
            level: planItem?.data?.level || "",
            trainerId: planItem?.data?.trainerId || "",
            trainer: planItem?.data?.trainer || null,
            planGoalId: planItem?.data?.planGoalId || "",
            planGoal: planItem?.data?.planGoal || null,
            restDays: planItem?.data?.restDays || [],
            overviewAr: planItem?.data?.overviewAr || "",
            overviewEn: planItem?.data?.overviewEn || "",
            planConclusionEn: planItem?.data?.planConclusionEn || "",
            planConclusionAr: planItem?.data?.planConclusionAr || "",

            isActive: planItem?.data?.isActive || true,
          }}
          innerRef={refForm}
          onSubmit={handleSubmit}>
          {({ setFieldValue, errors, touched, values }) => {
            return (
              <Form>
                <Grid
                  container
                  direction='column'
                  justifyContent='center'
                  spacing={4}>
                  <Grid item>
                    <Stepper
                      activeStep={activeStep}
                      sx={{ py: 3 }}
                      alternativeLabel
                      connector={<ColorLibConnector />}>
                      {steps.map((step, index) => (
                        <Step key={index}>
                          <StepLabel StepIconComponent={ColorlibStepIcon}>
                            <IntlMessages id={step.label} />
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Grid>
                  <Grid item>
                    {activeStep === 0 && <FirstStep />}
                    {activeStep === 1 && <SecondStep />}
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </AppStepperEditModal>
    </>
  );
};

export default EditPlan;
