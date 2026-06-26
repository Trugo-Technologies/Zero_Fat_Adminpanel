/** @format */

import { useTheme } from "@emotion/react";
import InfoIcon from "@mui/icons-material/Info";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Grid, Step, StepIconProps, StepLabel, Stepper } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppStepperAddModal from "src/Components/baseComponents/modals/stepper/AppStepperAddModal";
import { ColorLibConnector } from "src/Components/baseComponents/modals/stepper/ColorLibConnector";
import { ColorLibStepIconRoot } from "src/Components/baseComponents/modals/stepper/ColorLibStepIconRoot";
import { useCreatePlanMutation } from "src/pages/workout-module/workoutPLans/services/api";
import { workoutEnvironment } from "src/types/enums";
import { IWorkoutPlansCreateDto } from "src/types/modules/workout/workoutPlans";
import FirstStep from "src/Components/wrokout-module/catalog/pLans/addSteps/FirstStep";
import SecondStep from "src/Components/wrokout-module/catalog/pLans/addSteps/SecondStep";
import createValidationSchemas from "src/Components/wrokout-module/catalog/pLans/validations";
interface IAddPlanProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
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
const AddPlan: React.FC<IAddPlanProps> = (props) => {
  const refForm = React.useRef<FormikProps<IWorkoutPlansCreateDto>>(null);

  const { showAddModal, setShowAddModal, label } = props;
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
  const [addPlanMethod, { isSuccess, isLoading: addLoading }] =
    useCreatePlanMutation();

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

  const handleSubmit = async (data: IWorkoutPlansCreateDto) => {
    if (activeStep === steps.length - 1) {
      await addPlanMethod(data);
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
      <AppStepperAddModal
        handleBack={activeStep > 0 ? () => handleBack() : undefined}
        handleSubmit={submit}
        labelForAddBtn={
          activeStep === steps.length - 1 ? "common.add" : "common.next"
        }
        loadingForAdd={addLoading}
        label={label}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        closeModalState={setShowAddModal}
        successClose={isSuccess}
        maxWidth={"lg"}>
        <Formik
          validationSchema={validationSchemas[activeStep]}
          validateOnChange={true}
          initialValues={{
            nameAr: "",
            nameEn: "",
            avatarImage: "",
            profileMedia: "",
            equipmentCategory: null,
            equipmentCategoryId: "",
            daysPerWeek: null,
            weeklyRepetition: null,
            trainerId: "",
            trainer: null,
            planGoalId: "",
            planGoal: null,
            environment: workoutEnvironment.Home,
            level: "",
            overviewAr: "",
            overviewEn: "",
            planConclusionEn: "",
            planConclusionAr: "",
            restDays: [],
            isActive: true,
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
      </AppStepperAddModal>
    </>
  );
};

export default AddPlan;
