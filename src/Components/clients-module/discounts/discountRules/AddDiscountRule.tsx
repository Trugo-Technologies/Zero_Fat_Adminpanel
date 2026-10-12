/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useCreateDiscountRuleMutation } from "src/pages/clients-module/discounts/discountRules/services/api";
import {
  DiscountOfferType,
  ICreateDiscountRuleDto,
  toDiscountRuleApiPayload,
} from "src/types/modules/clientsManagement/discounts/discountRules";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import DiscountRuleForm from "./DiscountRuleForm";
import discountRulesValidationSchema from "./validation";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}

const AddDiscountRule: React.FC<IProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;
  const refForm = React.useRef<FormikProps<ICreateDiscountRuleDto>>(null);

  const [createDiscountRuleMethod, { isLoading: addLoading, isSuccess }] =
    useCreateDiscountRuleMutation();

  const { messages } = useIntl();

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppAddModal
      label={label}
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForAdd={addLoading}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          code: "",
          amountOff: null,
          duration: "",
          descriptionAr: "",
          descriptionEn: "",
          expirationDate: "",
          durationInMonths: null,
          firstTimeClientsOnly: false,
          addToOffers: false,
          isActive: true,
          maxRedemptions: null,
          maxRedemptionsPerClient: null,
          percentOff: null,
          startDate: "",
          isPercent: true,
          offerType: DiscountOfferType.PromoCode,
          bankId: "",
          mealPlanId: "",
          subscriptionTypes: [],
        }}
        validationSchema={discountRulesValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          const payload = toDiscountRuleApiPayload({
            ...data,
            startDate: data?.startDate
              ? dateFormatInBackendPayload(data?.startDate)
              : "",
            expirationDate: data?.expirationDate
              ? dateFormatInBackendPayload(data?.expirationDate)
              : "",
            durationInMonths: data?.durationInMonths
              ? data?.durationInMonths
              : 0,
            maxRedemptions: data?.maxRedemptions ? data?.maxRedemptions : 0,
            maxRedemptionsPerClient: data?.maxRedemptionsPerClient
              ? data?.maxRedemptionsPerClient
              : 0,
          });
          createDiscountRuleMethod(payload);
        }}>
        <DiscountRuleForm />
      </Formik>
    </AppAddModal>
  );
};

export default AddDiscountRule;
