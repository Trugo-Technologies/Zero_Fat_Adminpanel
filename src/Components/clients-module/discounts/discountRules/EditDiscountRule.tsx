/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useGetDiscountRuleByIdQuery,
  useUpdateDiscountRuleMutation,
} from "src/pages/clients-module/discounts/discountRules/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import {
  DiscountOfferType,
  IUpdateDiscountRuleDto,
  toDiscountRuleApiPayload,
} from "src/types/modules/clientsManagement/discounts/discountRules";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import DiscountRuleForm from "./DiscountRuleForm";
import discountRulesValidationSchema from "./validation";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
}

const EditDiscountRule: React.FC<IProps> = (props) => {
  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const refForm = React.useRef<FormikProps<IUpdateDiscountRuleDto>>(null);

  const { data: ItemById, isLoading: detailsLoading } =
    useGetDiscountRuleByIdQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [updateDiscountRuleMethod, { isLoading: editLoading, isSuccess }] =
    useUpdateDiscountRuleMutation();

  const { messages } = useIntl();

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppEditModal
      label={label}
      open={showEditModal}
      itemName={""}
      errorMessage=''
      onClose={() => setShowEditModal(false)}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForEdit={editLoading}
      loading={detailsLoading}
      maxWidth={"md"}>
      <Formik
        enableReinitialize
        validateOnChange={true}
        initialValues={{
          id: selectedRow.id,
          amountOff: ItemById?.data?.amountOff || null,
          percentOff: ItemById?.data?.percentOff || null,
          code: ItemById?.data?.code || "",
          descriptionAr: ItemById?.data?.descriptionAr || "",
          descriptionEn: ItemById?.data?.descriptionEn || "",
          duration: ItemById?.data?.duration || "",
          durationInMonths: ItemById?.data?.durationInMonths || null,
          expirationDate: ItemById?.data?.expirationDate || "",
          startDate: ItemById?.data?.startDate || "",
          firstTimeClientsOnly: ItemById?.data?.firstTimeClientsOnly!,
          addToOffers: !!ItemById?.data?.addToOffers,
          isActive: ItemById?.data?.isActive!,
          isPercent: !!ItemById?.data?.percentOff,
          maxRedemptions: ItemById?.data?.maxRedemptions || null,
          maxRedemptionsPerClient:
            ItemById?.data?.maxRedemptionsPerClient || null,
          offerType:
            ItemById?.data?.offerType || DiscountOfferType.PromoCode,
          bankId: ItemById?.data?.bankId || "",
          mealPlanId: ItemById?.data?.mealPlanId || "",
          subscriptionTypes: ItemById?.data?.subscriptionTypes || [],
        }}
        validationSchema={discountRulesValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          const payload = toDiscountRuleApiPayload({
            ...data,
            startDate:
              data?.startDate === ItemById?.data?.startDate
                ? data?.startDate
                : dateFormatInBackendPayload(data?.startDate),
            expirationDate:
              data?.expirationDate === ItemById?.data?.expirationDate
                ? data?.expirationDate
                : dateFormatInBackendPayload(data?.expirationDate),
            durationInMonths: data?.durationInMonths
              ? data?.durationInMonths
              : 0,
            maxRedemptions: data?.maxRedemptions ? data?.maxRedemptions : 0,
            maxRedemptionsPerClient: data?.maxRedemptionsPerClient
              ? data?.maxRedemptionsPerClient
              : 0,
          });
          updateDiscountRuleMethod({ id: selectedRow.id, data: payload });
        }}>
        <DiscountRuleForm />
      </Formik>
    </AppEditModal>
  );
};

export default EditDiscountRule;
