/** @format */

import { Grid, Step, StepIconProps, StepLabel, Stepper } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";

import { useTheme } from "@emotion/react";
import InfoIcon from "@mui/icons-material/Info";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AppStepperEditModal from "src/Components/baseComponents/modals/stepper/AppStepperEditModal";
import { ColorLibConnector } from "src/Components/baseComponents/modals/stepper/ColorLibConnector";
import { ColorLibStepIconRoot } from "src/Components/baseComponents/modals/stepper/ColorLibStepIconRoot";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import {
  useEditMealPlansMutation,
  useGetMealPlanQuery,
} from "src/pages/nutriplan-module/mealPlans/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateMealPlanDto } from "src/types/modules/nutriplan/mealPlans";
import FirstStep from "src/Components/nutriplan-module/setting/mealPlans/addSteps/FirstStep";
import SecondStep from "src/Components/nutriplan-module/setting/mealPlans/addSteps/SecondStep";
import { createValidationSchemas } from "src/Components/nutriplan-module/setting/mealPlans/validations";
interface IEditMealPlanProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: ISelectedRow;
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
const EditMealPlan: React.FC<IEditMealPlanProps> = (props) => {
  const refForm = React.useRef<FormikProps<IUpdateMealPlanDto>>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
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
  const [EditMealPlanMethod, { isSuccess, isLoading }] =
    useEditMealPlansMutation();
  const { data: mealPlanItem, isLoading: detailsLoading } = useGetMealPlanQuery(
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

  const handleSubmit = async (data: IUpdateMealPlanDto) => {
    if (activeStep === steps.length - 1) {
      if (uploadedFiles) {
        data = { ...data, images: uploadedFiles };
      }
      await EditMealPlanMethod({ id: selectedRow?.id, data });
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
        loadingForEdit={isLoading}
        loading={detailsLoading}
        label='mealPlans.edit'
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
            nameAr: mealPlanItem?.data?.nameAr || "",
            nameEn: mealPlanItem?.data?.nameEn || "",
            code: mealPlanItem?.data?.code || "",
            defaultDietitianGoal:
              mealPlanItem?.data?.defaultDietitianGoal || "",
            descriptionAr: mealPlanItem?.data?.descriptionAr || "",
            descriptionEn: mealPlanItem?.data?.descriptionEn || "",
            carbPercentage: mealPlanItem?.data?.carbPercentage || null,
            fatPercentage: mealPlanItem?.data?.fatPercentage || null,
            proteinPercentage: mealPlanItem?.data?.proteinPercentage || null,
            images: mealPlanItem?.data?.images || [],
            imageUrl: mealPlanItem?.data?.imageUrl || "",
            mainImage: mealPlanItem?.data?.imageUrl || "",
            mealTypes:
              mealPlanItem?.data?.mealPlanMealTypes?.map((item) => {
                return {
                  ...item,
                  mealTypeId: item?.mealType?.id!,
                };
              }) || [],

            isActive: mealPlanItem?.data?.isActive || true,
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
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
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
      </AppStepperEditModal>
    </>
  );
};

export default EditMealPlan;
