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
import { useAddMealPlansMutation } from "src/pages/nutriplan-module/mealPlans/services/api";
import { ICreateMealPlanDto } from "src/types/modules/nutriplan/mealPlans";
import FirstStep from "src/Components/nutriplan-module/setting/mealPlans/addSteps/FirstStep";
import SecondStep from "src/Components/nutriplan-module/setting/mealPlans/addSteps/SecondStep";
import { createValidationSchemas } from "src/Components/nutriplan-module/setting/mealPlans/validations";
interface IAddMealPlanProps {
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
const AddMealPlan: React.FC<IAddMealPlanProps> = (props) => {
  const refForm = React.useRef<FormikProps<ICreateMealPlanDto>>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

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
  const [addMealPlanMethod, { isSuccess, isLoading: addLoading }] =
    useAddMealPlansMutation();

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

  const handleSubmit = async (data: ICreateMealPlanDto) => {
    if (activeStep === steps.length - 1) {
      if (uploadedFiles) {
        data = { ...data, images: uploadedFiles };
      }
      await addMealPlanMethod(data);
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
            code: "",
            defaultDietitianGoal: "",
            descriptionAr: "",
            descriptionEn: "",

            carbPercentage: null,
            fatPercentage: null,
            proteinPercentage: null,
            images: [],
            mainImage: "",
            mealTypes: [
              {
                mealTypeId: "",
                mealType: null,
                averageCalories: null,
                price: null,
              },
            ],
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
                    {activeStep === 1 && (
                      <SecondStep
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        values={values}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
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

export default AddMealPlan;
