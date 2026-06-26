/** @format */

import {
  useAddConfigurationMutation,
  useGetAllConfigurationQuery,
} from "./services/api";
import GenerateForm from "src/Components/generate-form-component";
import { FormikOnSubmitType, inputType } from "src/types";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import useIntl from "react-intl/lib/src/components/useIntl";
import { CircularProgress } from "@mui/material";

function ConfigurtionForm() {
  const { messages } = useIntl();
  const {
    data: ConfigurationData,
    isFetching,
    isError,
  } = useGetAllConfigurationQuery();
  const [addConfiguration] = useAddConfigurationMutation();
  const initialValues = {
    offsetSubscriptionInDays: ConfigurationData?.data?.offsetSubscriptionInDays,
  };
  const validationSchema = yup.object({
    offsetSubscriptionInDays: yup
      .number()
      .required(String(messages["validation.required"]))
      .min(1, String(messages["validation.numberMoreThanZero"])),
  });
  const fields = [
    {
      inputType: inputType.text,
      name: "offsetSubscriptionInDays",
      label: "configurtion.offsetSubscriptionInDays",
      md: 6,
      xs: 12,
      type: "number",
    },
  ];
  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    { setSubmitting }
  ) => {
    return addConfiguration(values)
      .unwrap()
      .then(() => {})
      .catch(() => {
        setSubmitting(false);
      });
  };
  return (
    <>
      {isFetching ? (
        <CircularProgress size={16} />
      ) : (
        <GenerateForm
          title={"configurtion.info"}
          isMultiLanguage={false}
          fields={fields}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          isError={isError}
          loading={isFetching}
        />
      )}
    </>
  );
}

export default ConfigurtionForm;
