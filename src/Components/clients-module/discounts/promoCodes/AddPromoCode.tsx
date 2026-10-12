/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import {
  ICreatePromoCodeDto,
  PromoApplyMode,
  PromoEligibilityType,
  PromoRewardType,
} from "src/types/modules/clientsManagement/discounts/promoCodes";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import PromoCodeForm from "./PromoCodeForm";
import promoCodesValidationSchema from "./validation";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSubmit: (data: ICreatePromoCodeDto) => void;
}

const defaultValues: ICreatePromoCodeDto = {
  code: "",
  amountOff: null,
  duration: "",
  descriptionAr: "",
  descriptionEn: "",
  expirationDate: "",
  durationInMonths: null,
  firstTimeClientsOnly: false,
  isActive: true,
  maxRedemptions: null,
  maxRedemptionsPerClient: null,
  percentOff: null,
  startDate: "",
  isPercent: true,
  applyMode: PromoApplyMode.Manual,
  eligibilityType: PromoEligibilityType.All,
  rewardType: PromoRewardType.Percent,
  bankIds: [],
  planIds: [],
  subscriptionTypes: [],
  minOrderCredits: null,
  buyQuantity: null,
  getQuantity: null,
};

const AddPromoCode: React.FC<IProps> = (props) => {
  const { showAddModal, setShowAddModal, label, onSubmit } = props;
  const refForm = React.useRef<FormikProps<ICreatePromoCodeDto>>(null);
  const { messages } = useIntl();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const submit = () => {
    refForm.current?.submitForm();
  };

  return (
    <AppAddModal
      label={label}
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForAdd={false}
      maxWidth='md'>
      <Formik
        validateOnChange
        initialValues={defaultValues}
        validationSchema={promoCodesValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          const payload: ICreatePromoCodeDto = {
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
          setShowAddModal(false);
        }}>
        <PromoCodeForm />
      </Formik>
    </AppAddModal>
  );
};

export default AddPromoCode;
