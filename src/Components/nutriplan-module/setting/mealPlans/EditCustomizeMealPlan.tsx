/** @format */

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
import FirstStep from "src/Components/nutriplan-module/setting/mealPlans/addSteps/FirstStep";
import CustomizeSecondStep from "src/Components/nutriplan-module/setting/mealPlans/addSteps/CustomizeSecondStep";
import { createCustomizeValidationSchemas } from "src/Components/nutriplan-module/setting/mealPlans/validations";
import {
  useEditMealPlansMutation,
  useGetMealPlanQuery,
} from "src/pages/nutriplan-module/mealPlans/services/api";
import {
  ICreateCustomizeMealPlanDto,
  IMealPlans,
  mapCustomizeFormToMealPlanPayload,
  mapMealPlanApiMacrosToForm,
} from "src/types/modules/nutriplan/mealPlans";

interface IEditCustomizeMealPlanProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  plan: IMealPlans;
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

const EditCustomizeMealPlan: React.FC<IEditCustomizeMealPlanProps> = ({
  showEditModal,
  setShowEditModal,
  plan,
  onSaved,
}) => {
  const refForm = React.useRef<FormikProps<ICreateCustomizeMealPlanDto>>(null);
  const { messages } = useIntl();
  const [activeStep, setActiveStep] = useState(0);
  const validationSchemas = createCustomizeValidationSchemas(messages);

  const { data: mealPlanItem, isLoading: detailsLoading } = useGetMealPlanQuery(
    { id: plan?.id || "" },
    { skip: !plan?.id || !showEditModal }
  );

  const [editMealPlan, { isSuccess, isLoading }] = useEditMealPlansMutation();

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
    const source = mealPlanItem?.data || plan;
    await editMealPlan({
      id: plan.id,
      data: mapCustomizeFormToMealPlanPayload(data, {
        id: plan.id,
        imageUrl: source.imageUrl || source.mainImageUrl || "",
      }),
    });
    onSaved?.();
  };

  const source = mealPlanItem?.data || plan;
  const macros = mapMealPlanApiMacrosToForm(source);
  const mealTypes =
    source.mealPlanMealTypes
      ?.map((item) => item.mealType)
      .filter(Boolean) || [];

  return (
    <AppStepperEditModal
      handleBack={activeStep > 0 ? handleBack : undefined}
      handleSubmit={() => refForm.current?.submitForm()}
      labelForEditBtn={
        activeStep === steps.length - 1 ? "common.save" : "common.next"
      }
      loadingForEdit={isLoading}
      loading={detailsLoading}
      errorMessage=''
      itemName={source.nameEn || source.nameAr || ""}
      label='mealPlans.customize.edit'
      open={showEditModal}
      onClose={() => setShowEditModal(false)}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth='lg'>
      <Formik
        enableReinitialize
        validationSchema={validationSchemas[activeStep]}
        validateOnChange={false}
        validateOnBlur
        initialValues={
          {
            nameAr: source.nameAr || "",
            nameEn: source.nameEn || "",
            code: source.code || "CUSTOMIZE",
            defaultDietitianGoal: source.defaultDietitianGoal || "",
            descriptionAr: source.descriptionAr || "",
            descriptionEn: source.descriptionEn || "",
            mainImage: source.imageUrl || source.mainImageUrl || "",
            isActive: !!source.isActive,
            isCustomize: true,
            mealTypes: mealTypes as any[],
            mealTypeIds: mealTypes.map((item: any) => item.id),
            protein: macros.protein,
            carbs: macros.carbs,
            fiber: macros.fiber,
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
    </AppStepperEditModal>
  );
};

export default EditCustomizeMealPlan;
