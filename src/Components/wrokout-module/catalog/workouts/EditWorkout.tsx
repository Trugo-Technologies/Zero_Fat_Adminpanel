/** @format */

import { Grid, Step, StepIconProps, StepLabel, Stepper } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";

import { useTheme } from "@emotion/react";
import InfoIcon from "@mui/icons-material/Info";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AppStepperEditModal from "src/Components/baseComponents/modals/stepper/AppStepperEditModal";
import { ColorLibConnector } from "src/Components/baseComponents/modals/stepper/ColorLibConnector";
import { ColorLibStepIconRoot } from "src/Components/baseComponents/modals/stepper/ColorLibStepIconRoot";
import FirstStep from "src/Components/wrokout-module/catalog/workouts/editSteps/FirstStep";
import SecondStep from "src/Components/wrokout-module/catalog/workouts/editSteps/SecondStep";
import { updateValidationSchemas } from "src/Components/wrokout-module/catalog/workouts/validations";
import { baseImageUrl } from "src/env/base-url";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import {
  useEditWorkoutMutation,
  useGetWorkoutQuery,
} from "src/pages/workout-module/workouts/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateWorkoutDto } from "src/types/modules/workout/workouts";
import ThirdStep from "./editSteps/ThirdStep";
import { workoutFormat } from "src/types/enums";

interface IEditWorkoutProps {
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
    3: <SportsGymnasticsIcon />,
  };

  return (
    <ColorLibStepIconRoot
      ownerState={{ completed: Boolean(completed), active: Boolean(active) }}
      className={className}>
      {icons[String(props.icon)]}
    </ColorLibStepIconRoot>
  );
}
const EditWorkout: React.FC<IEditWorkoutProps> = (props) => {
  const refForm = React.useRef<FormikProps<IUpdateWorkoutDto>>(null);

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { messages } = useIntl();
  const [activeStep, setActiveStep] = useState(0);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const validationSchemas = updateValidationSchemas(messages);

  const steps = [
    {
      label: "trainers.basicInformation",
    },
    {
      label: "trainers.additionalInfo",
    },
    {
      label: "workout.trainingInfo",
    },
  ];
  // queries
  const [editWorkoutMethod, { isSuccess, isLoading }] =
    useEditWorkoutMutation();
  const { data: workoutItem, isLoading: detailsLoading } = useGetWorkoutQuery(
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

  const handleSubmit = async (data: IUpdateWorkoutDto) => {
    if (activeStep === steps.length - 1) {
      // const dataToSend = appendToFormData(data);

      if (uploadedFiles[0].orginalUrl) {
        data = {
          ...data,
          profileMediaUrl: uploadedFiles[0].orginalUrl,
          profileMedia: null,
        };
      } else {
        data = {
          ...data,
          profileMedia: uploadedFiles[0],
          profileMediaUrl: null,
        };
      }
      await editWorkoutMethod({ id: selectedRow?.id, data });
    } else {
      handleNext();
    }
  };

  useEffect(() => {
    if (workoutItem && workoutItem?.data?.profileMediaUrl) {
      setUploadedFiles([
        {
          preview: `${baseImageUrl}/${workoutItem?.data?.profileMediaUrl}`,
          orginalUrl: `${workoutItem?.data?.profileMediaUrl}`,
        },
      ]);
    }
  }, [workoutItem]);

  useEffect(() => {
    refForm.current?.setFieldValue("profileMedia", uploadedFiles);
  }, [uploadedFiles]);
  const submit = () => {
    if (refForm.current) {
      if (
        refForm.current.values.format === workoutFormat.FollowAlong &&
        !uploadedFiles?.length
      ) {
        return;
      }
      refForm.current.submitForm();
    }
  };
  return (
    <AppStepperEditModal
      handleBack={activeStep > 0 ? () => handleBack() : undefined}
      handleSubmit={submit}
      labelForEditBtn={
        activeStep === steps.length - 1 ? "common.save" : "common.next"
      }
      loadingForEdit={
        (refForm.current?.isSubmitting &&
          !refForm.current?.isValidating &&
          isLoading) ||
        false
      }
      loading={detailsLoading}
      label='workouts.edit'
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
          nameAr: workoutItem?.data?.nameAr || "",
          nameEn: workoutItem?.data?.nameEn || "",
          avatarImage: workoutItem?.data?.avatarImageUrl || "",
          avatarImageUrl: workoutItem?.data?.avatarImageUrl || "",
          profileMediaUrl: workoutItem?.data?.profileMediaUrl || "",
          durationInMins: workoutItem?.data?.durationInMins || null,
          level: workoutItem?.data?.level || "",
          overviewAr: workoutItem?.data?.overviewAr || "",
          overviewEn: workoutItem?.data?.overviewEn || "",
          bodyParts: workoutItem?.data?.bodyParts || [],
          bodyPartsIds: workoutItem?.data?.bodyPartIds || [],
          equipmentIds: workoutItem?.data?.equipmentIds || [],
          equipments: workoutItem?.data?.equipments || [],
          format: workoutItem?.data?.format || "",
          trainer: workoutItem?.data?.trainer || null,
          trainerId: workoutItem?.data?.trainer?.id || "",
          workoutType: workoutItem?.data?.workoutType || null,
          workoutTypeId: workoutItem?.data?.workoutType?.id || "",
          caloriesBurned: workoutItem?.data?.caloriesBurned || null,
          setNamesAr: workoutItem?.data?.setNamesAr || [],
          setNamesEn: workoutItem?.data?.setNamesEn || [],
          isActive: workoutItem?.data?.isActive || false,
          sets: workoutItem?.data?.setNamesAr?.length || 0,
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
                      values={values}
                    />
                  )}
                  {activeStep === 1 && (
                    <SecondStep
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      values={values}
                    />
                  )}

                  {activeStep === 2 && (
                    <ThirdStep
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
    </AppStepperEditModal>
  );
};

export default EditWorkout;
