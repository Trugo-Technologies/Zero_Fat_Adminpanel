/** @format */

import ImageSearchIcon from "@mui/icons-material/ImageSearch";
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
import FirstStep from "src/Components/wrokout-module/training/trainer/addSteps/FirstStep";
import SecondStep from "src/Components/wrokout-module/training/trainer/addSteps/SecondStep";
import ThirdStep from "src/Components/wrokout-module/training/trainer/addSteps/ThirdStep";
import createValidationSchemas from "src/Components/wrokout-module/training/trainer/validations";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { appendToFormData } from "src/Helpers/append-to-form-data";
import {
  useEditTrainerMutation,
  useGetTrainerQuery,
} from "src/pages/workout-module/training-module/trainer/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateTrainerDto } from "src/types/modules/training/trainers";
interface IEditTrainerProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: ISelectedRow;
  label: string;
}

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

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
const EditTrainer: React.FC<IEditTrainerProps> = (props) => {
  const refForm = React.useRef<FormikProps<IUpdateTrainerDto>>(null);

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
    {
      label: "trainers.socialInfo",
      icon: () => <ImageSearchIcon fontSize='medium' />,
    },
  ];
  // queries
  const [editTrainerMethod, { isSuccess, isLoading: editLoading }] =
    useEditTrainerMutation();
  const { data: trainerItem, isLoading: detailsLoading } = useGetTrainerQuery(
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

  const handleSubmit = async (data: IUpdateTrainerDto) => {
    if (activeStep === steps.length - 1) {
      const dataToSend = appendToFormData(data);
      await editTrainerMethod({ id: selectedRow?.id, data: dataToSend });
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
        label='trainers.edit'
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
            nameAr: trainerItem?.data?.nameAr || "",
            nameEn: trainerItem?.data?.nameEn || "",
            avatarImage: trainerItem?.data?.avatarImageUrl || "",
            avatarImageUrl: trainerItem?.data?.avatarImageUrl || "",

            profileMedia: trainerItem?.data?.profileMediaUrl || "",
            profileMediaUrl: trainerItem?.data?.profileMediaUrl || "",
            briefAr: trainerItem?.data?.briefAr || "",
            briefEn: trainerItem?.data?.briefEn || "",
            type: trainerItem?.data?.type || "",
            descriptionAr: trainerItem?.data?.descriptionAr || "",
            descriptionEn: trainerItem?.data?.descriptionEn || "",
            specialisesIn: trainerItem?.data?.specialisesIn || [],
            facebookUrl: trainerItem?.data?.facebookUrl || "",
            instagramUrl: trainerItem?.data?.instagramUrl || "",
            pinterestUrl: trainerItem?.data?.pinterestUrl || "",
            websiteUrl: trainerItem?.data?.websiteUrl || "",
            youtubeUrl: trainerItem?.data?.youtubeUrl || "",
            isActive: trainerItem?.data?.isActive || true,
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
      </AppStepperEditModal>
    </>
  );
};

export default EditTrainer;
