/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useCreateChallengeMutation } from "src/pages/clients-module/challenges/services/api";
import {
  IChallengeFormValues,
  mapChallengeFormToCreateDto,
} from "src/types/modules/clientsManagement/challenges";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import ChallengeForm from "./ChallengeForm";
import { getChallengeValidationSchema } from "./validation";

interface IAddChallengeProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const emptyValues: IChallengeFormValues = {
  title: "",
  subtitle: "",
  badgeLabel: "",
  month: "",
  startDate: "",
  endDate: "",
  isFeaturedOnHome: false,
};

const toApiDate = (value?: string) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value.trim())) return value.trim().slice(0, 10);
  return dateFormatInBackendPayload(value);
};

const AddChallenge: React.FC<IAddChallengeProps> = ({
  showAddModal,
  setShowAddModal,
}) => {
  const { messages } = useIntl();
  const refForm = React.useRef<FormikProps<IChallengeFormValues>>(null);
  const [createChallenge, { isLoading, isSuccess }] =
    useCreateChallengeMutation();

  const submit = () => {
    refForm.current?.submitForm();
  };

  return (
    <AppAddModal
      label='challenges.add'
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForAdd={isLoading}
      maxWidth='md'>
      <Formik
        validateOnChange
        initialValues={emptyValues}
        validationSchema={getChallengeValidationSchema(
          messages as Record<string, string>
        )}
        innerRef={refForm}
        onSubmit={(data) => {
          const payload = mapChallengeFormToCreateDto(data);
          createChallenge({
            ...payload,
            startDate: toApiDate(payload.startDate),
            endDate: toApiDate(payload.endDate),
          });
        }}>
        <ChallengeForm />
      </Formik>
    </AppAddModal>
  );
};

export default AddChallenge;
