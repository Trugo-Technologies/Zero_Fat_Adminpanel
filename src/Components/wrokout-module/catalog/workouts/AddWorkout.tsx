/** @format */

import { useTheme } from "@emotion/react";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import InfoIcon from "@mui/icons-material/Info";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Grid, Step, StepIconProps, StepLabel, Stepper } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppStepperAddModal from "src/Components/baseComponents/modals/stepper/AppStepperAddModal";
import { ColorLibConnector } from "src/Components/baseComponents/modals/stepper/ColorLibConnector";
import { ColorLibStepIconRoot } from "src/Components/baseComponents/modals/stepper/ColorLibStepIconRoot";
import FirstStep from "src/Components/wrokout-module/catalog/workouts/addSteps/FirstStep";
import SecondStep from "src/Components/wrokout-module/catalog/workouts/addSteps/SecondStep";
import ThirdStep from "src/Components/wrokout-module/catalog/workouts/addSteps/ThirdStep";
import { createValidationSchemas } from "src/Components/wrokout-module/catalog/workouts/validations";
import { useAddWorkoutMutation } from "src/pages/workout-module/workouts/services/api";
import { workoutFormat } from "src/types/enums";
import { ICreateWorkoutDto } from "src/types/modules/workout/workouts";
interface IAddWorkoutProps {
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
    3: <SportsGymnasticsIcon />,
    4: <ImageSearchIcon />,
  };

  return (
    <ColorLibStepIconRoot
      ownerState={{ completed: Boolean(completed), active: Boolean(active) }}
      className={className}>
      {icons[String(props.icon)]}
    </ColorLibStepIconRoot>
  );
}
const AddWorkout: React.FC<IAddWorkoutProps> = (props) => {
  const refForm = React.useRef<FormikProps<ICreateWorkoutDto>>(null);

  const { showAddModal, setShowAddModal, label } = props;
  const { messages } = useIntl();
  const [activeStep, setActiveStep] = useState(0);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const validationSchemas = createValidationSchemas(messages);

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

    // {
    //   label: "trainers.socialInfo",
    //   icon: () => <ImageSearchIcon fontSize="medium" />,
    // },
  ];
  // queries
  const [addWorkoutMethod, { isSuccess, isLoading: addLoading }] =
    useAddWorkoutMutation();

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

  const handleSubmit = async (data: ICreateWorkoutDto) => {
    if (activeStep === steps.length - 1) {
      if (uploadedFiles.length) {
        data = { ...data, profileMedia: uploadedFiles[0] };
      }
      await addWorkoutMethod(data);
    } else {
      handleNext();
    }
  };

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
            durationInMins: null,

            level: "",
            environment: "",
            avatarImage: "",
            profileMedia: "",
            overviewAr: "",
            overviewEn: "",
            bodyParts: [],
            bodyPartsIds: [],
            equipmentCategory: null,
            equipmentCategoryId: "",
            equipmentIds: [],
            equipments: [],
            format: workoutFormat.SetReps || "",
            trainer: null,
            trainerId: "",
            workoutType: null,
            sets: null,
            caloriesBurned: null,
            setNamesAr: [],
            setNamesEn: [],
            exerciseSets: [
              {
                exerciseId: "",
                exercise: null,
                durationInSec: null,
                reps: null,
                sets: null,
                weight: null,
              },
            ],
            workoutTypeId: "",
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
                        refForm={refForm}
                      />
                    )}
                    {/* {activeStep === 3 && (
                      <FourthStep
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        values={values}
                      />
                    )} */}
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

export default AddWorkout;
