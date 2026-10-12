/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  IPromoCode,
  IUpdatePromoCodeDto,
  PromoEligibilityType,
  PromoRewardType,
} from "src/types/modules/clientsManagement/discounts/promoCodes";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import PromoCodeForm from "./PromoCodeForm";
import promoCodesValidationSchema from "./validation";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: IPromoCode;
  onSubmit: (data: IUpdatePromoCodeDto) => void;
}

const EditPromoCode: React.FC<IProps> = (props) => {
  const { showEditModal, setShowEditModal, label, selectedRow, onSubmit } =
    props;
  const refForm = React.useRef<FormikProps<IUpdatePromoCodeDto>>(null);
  const { messages } = useIntl();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const submit = () => {
    refForm.current?.submitForm();
  };

  return (
    <AppEditModal
      label={label}
      open={showEditModal}
      itemName={selectedRow.code}
      errorMessage=''
      onClose={() => setShowEditModal(false)}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForEdit={false}
      loading={false}
      maxWidth='md'>
      <Formik
        enableReinitialize
        validateOnChange
        initialValues={{
          id: selectedRow.id,
          amountOff: selectedRow.amountOff || null,
          percentOff: selectedRow.percentOff || null,
          code: selectedRow.code || "",
          descriptionAr: selectedRow.descriptionAr || "",
          descriptionEn: selectedRow.descriptionEn || "",
          duration: selectedRow.duration || "",
          durationInMonths: selectedRow.durationInMonths || null,
          expirationDate: selectedRow.expirationDate || "",
          startDate: selectedRow.startDate || "",
          firstTimeClientsOnly: selectedRow.firstTimeClientsOnly,
          isActive: selectedRow.isActive,
          isPercent: selectedRow.rewardType === PromoRewardType.Percent,
          maxRedemptions: selectedRow.maxRedemptions || null,
          maxRedemptionsPerClient: selectedRow.maxRedemptionsPerClient || null,
          applyMode: selectedRow.applyMode,
          eligibilityType: selectedRow.eligibilityType,
          rewardType: selectedRow.rewardType,
          bankIds: selectedRow.bankIds || [],
          planIds: selectedRow.planIds || [],
          subscriptionTypes: selectedRow.subscriptionTypes || [],
          minOrderCredits: selectedRow.minOrderCredits,
          buyQuantity: selectedRow.buyQuantity,
          getQuantity: selectedRow.getQuantity,
        }}
        validationSchema={promoCodesValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          const payload: IUpdatePromoCodeDto = {
            ...data,
            startDate: data?.startDate
              ? dateFormatInBackendPayload(data.startDate)
              : "",
            expirationDate: data?.expirationDate
              ? dateFormatInBackendPayload(data.expirationDate)
              : "",
            durationInMonths: data?.durationInMonths || 0,
            maxRedemptions: data?.maxRedemptions || 0,
            maxRedemptionsPerClient: data?.maxRedemptionsPerClient || 0,
            firstTimeClientsOnly:
              data.eligibilityType === PromoEligibilityType.FirstTime,
            isPercent: data.rewardType === PromoRewardType.Percent,
            bankIds: data.bankIds || [],
            planIds: data.planIds || [],
            subscriptionTypes: data.subscriptionTypes || [],
          };
          onSubmit(payload);
          setIsSuccess(true);
          setShowEditModal(false);
        }}>
        <PromoCodeForm />
      </Formik>
    </AppEditModal>
  );
};

export default EditPromoCode;
