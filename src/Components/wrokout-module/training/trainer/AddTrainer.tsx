/** @format */

import { useTheme } from "@emotion/react";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
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
import { appendToFormData } from "src/Helpers/append-to-form-data";
import { useAddTrainerMutation } from "src/pages/workout-module/training-module/trainer/services/api";
import { ICreateTrainerDto } from "src/types/modules/training/trainers";
import FirstStep from "src/Components/wrokout-module/training/trainer/addSteps/FirstStep";
import SecondStep from "src/Components/wrokout-module/training/trainer/addSteps/SecondStep";
import ThirdStep from "src/Components/wrokout-module/training/trainer/addSteps/ThirdStep";
import createValidationSchemas from "src/Components/wrokout-module/training/trainer/validations";
interface IAddTrainerProps {
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
    3: <ImageSearchIcon />,
  };

  return (
    <ColorLibStepIconRoot
      ownerState={{ completed: Boolean(completed), active: Boolean(active) }}
      className={className}>
      {icons[String(props.icon)]}
    </ColorLibStepIconRoot>
  );
}
const AddTrainer: React.FC<IAddTrainerProps> = (props) => {
  const refForm = React.useRef<FormikProps<ICreateTrainerDto>>(null);

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
    {
      label: "trainers.socialInfo",
      icon: () => <ImageSearchIcon fontSize='medium' />,
    },
  ];
  // queries
  const [addTrainerMethod, { isSuccess, isLoading: addLoading }] =
    useAddTrainerMutation();

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

  const handleSubmit = async (data: ICreateTrainerDto) => {
    if (activeStep === steps.length - 1) {
      await addTrainerMethod(appendToFormData(data));
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
            briefAr: "",
            briefEn: "",
            type: "",
            descriptionAr: "",
            descriptionEn: "",
            specialisesIn: [],
            facebookUrl: "",
            instagramUrl: "",
            pinterestUrl: "",
            websiteUrl: "",
            youtubeUrl: "",
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
                    {activeStep === 0 && (
                      <FirstStep
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        values={values}
                      />
                    )}
                    {activeStep === 1 && <SecondStep />}
                    {activeStep === 2 && (
                      <ThirdStep
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        values={values}
                      />
                    )}
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

export default AddTrainer;
