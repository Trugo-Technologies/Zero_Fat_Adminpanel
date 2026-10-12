/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useGetChallengeByIdQuery,
  useUpdateChallengeMutation,
} from "src/pages/clients-module/challenges/services/api";
import {
  IChallenge,
  IChallengeFormValues,
  isChallengeActive,
  mapChallengeFormToCreateDto,
} from "src/types/modules/clientsManagement/challenges";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import ChallengeForm, { getMonthFromDate } from "./ChallengeForm";
import { getChallengeValidationSchema } from "./validation";

interface IEditChallengeProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  challenge: IChallenge;
}

const toApiDate = (value?: string) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value.trim())) return value.trim().slice(0, 10);
  return dateFormatInBackendPayload(value);
};

const EditChallenge: React.FC<IEditChallengeProps> = ({
  showEditModal,
  setShowEditModal,
  challenge,
}) => {
  const { messages } = useIntl();
  const refForm = React.useRef<FormikProps<IChallengeFormValues>>(null);

  const { data: itemById, isLoading: detailsLoading } =
    useGetChallengeByIdQuery(
      { id: challenge?.id || "" },
      { skip: !challenge?.id }
    );

  const [updateChallenge, { isLoading, isSuccess }] =
    useUpdateChallengeMutation();

  const submit = () => {
    refForm.current?.submitForm();
  };

  const source = itemById?.data || challenge;
  const itemName = source.title ? `- ${source.title}` : "";
  const datesLocked = isChallengeActive(source.status);

  const initialValues: IChallengeFormValues = {
    title: source.title || source.nameEn || "",
    subtitle: source.subtitle || source.descriptionEn || "",
    badgeLabel: source.badgeLabel || "",
    month: source.month || getMonthFromDate(source.startDate),
    startDate: source.startDate || "",
    endDate: source.endDate || "",
    isFeaturedOnHome: !!source.isFeaturedOnHome,
  };

  return (
    <AppEditModal
      label='challenges.edit'
      itemName={itemName}
      open={showEditModal}
      onClose={() => setShowEditModal(false)}
      handleSubmit={submit}
      loading={detailsLoading}
      errorMessage={""}
      loadingForEdit={isLoading}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth='md'>
      <Formik
        enableReinitialize
        validateOnChange
        initialValues={initialValues}
        validationSchema={getChallengeValidationSchema(
          messages as Record<string, string>
        )}
        innerRef={refForm}
        onSubmit={(data) => {
          const payload = mapChallengeFormToCreateDto(data);
          updateChallenge({
            id: challenge.id,
            data: {
              id: challenge.id,
              ...payload,
              startDate: toApiDate(payload.startDate),
              endDate: toApiDate(payload.endDate),
            },
          });
        }}>
        <ChallengeForm disableDates={datesLocked} />
      </Formik>
    </AppEditModal>
  );
};

export default EditChallenge;
