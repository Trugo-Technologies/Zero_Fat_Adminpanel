/** @format */

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
import FirstStep from "src/Components/nutriplan-module/setting/mealPlans/addSteps/FirstStep";
import CustomizeSecondStep from "src/Components/nutriplan-module/setting/mealPlans/addSteps/CustomizeSecondStep";
import { createCustomizeValidationSchemas } from "src/Components/nutriplan-module/setting/mealPlans/validations";
import { useAddMealPlansMutation } from "src/pages/nutriplan-module/mealPlans/services/api";
import {
  ICreateCustomizeMealPlanDto,
  mapCustomizeFormToMealPlanPayload,
} from "src/types/modules/nutriplan/mealPlans";

interface IAddCustomizeMealPlanProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSaved?: () => void;
}

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
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

const AddCustomizeMealPlan: React.FC<IAddCustomizeMealPlanProps> = ({
  showAddModal,
  setShowAddModal,
  onSaved,
}) => {
  const refForm = React.useRef<FormikProps<ICreateCustomizeMealPlanDto>>(null);
  const { messages } = useIntl();
  const [activeStep, setActiveStep] = useState(0);
  const validationSchemas = createCustomizeValidationSchemas(messages);

  const [addMealPlan, { isSuccess, isLoading }] = useAddMealPlansMutation();

  const steps = [
    { label: "trainers.basicInformation" },
    { label: "trainers.additionalInfo" },
  ];

  const handleNext = async () => {
    if (!refForm.current) return;
    await refForm.current.validateForm();
    if (Object.keys(refForm.current.errors).length > 0) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (data: ICreateCustomizeMealPlanDto) => {
    if (activeStep < steps.length - 1) {
      handleNext();
      return;
    }
    await addMealPlan(mapCustomizeFormToMealPlanPayload(data));
    onSaved?.();
  };

  return (
    <AppStepperAddModal
      handleBack={activeStep > 0 ? handleBack : undefined}
      handleSubmit={() => refForm.current?.submitForm()}
      labelForAddBtn={
        activeStep === steps.length - 1 ? "common.add" : "common.next"
      }
      loadingForAdd={isLoading}
      label='mealPlans.customize.add'
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      maxWidth='lg'>
      <Formik
        validationSchema={validationSchemas[activeStep]}
        validateOnChange={false}
        validateOnBlur
        initialValues={
          {
            nameAr: "",
            nameEn: "",
            code: "CUSTOMIZE",
            defaultDietitianGoal: "",
            descriptionAr: "",
            descriptionEn: "",
            mainImage: "",
            isActive: true,
            isCustomize: true,
            mealTypes: [],
            mealTypeIds: [],
            protein: { grams: null, calories: null },
            carbs: { grams: null, calories: null },
            fiber: { grams: null, calories: null },
          } as ICreateCustomizeMealPlanDto
        }
        innerRef={refForm}
        onSubmit={handleSubmit}>
        {({ setFieldValue, errors, touched, values }) => (
          <Form>
            <Grid container direction='column' justifyContent='center' spacing={4}>
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
                    setFieldValue={setFieldValue as any}
                    errors={errors as any}
                    touched={touched as any}
                    values={values as any}
                  />
                )}
                {activeStep === 1 && (
                  <CustomizeSecondStep
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                  />
                )}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppStepperAddModal>
  );
};

export default AddCustomizeMealPlan;
