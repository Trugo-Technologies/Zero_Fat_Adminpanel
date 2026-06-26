import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useTranslation } from "src/hooks/use-translation";
function ErrorAlert() {
  const { t } = useTranslation("translation");
  return (
    <Alert severity="error">
      <AlertTitle>{t("networkError")}</AlertTitle>
      {t("thereIsAnError")}
    </Alert>
  );
}

export default ErrorAlert;
