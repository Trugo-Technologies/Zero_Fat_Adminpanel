import { Step, StepLabel, Stepper, SxProps, Theme } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { ReactNode } from "react";
import { useIntl } from "react-intl";
type propsType = {
  steps: { label: string; icon: () => ReactNode }[];
  activeStep: number;
  sx?: SxProps<Theme>;
};

function CustomStepper({ steps, activeStep, sx }: propsType) {
  const { messages } = useIntl();
  return (
    <Stepper
      sx={{
        width: { xs: "100%" },
        ...sx,
      }}
      activeStep={activeStep}
    >
      {steps.map((step) => (
        <Step key={step.label}>
          <StepLabel
            sx={{ "& .MuiStepIcon-text ": { fill: "white" } }}
            StepIconComponent={step.icon}
          >
            {messages[step.label] as string}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default CustomStepper;
