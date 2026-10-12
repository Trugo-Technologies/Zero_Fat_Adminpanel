/** @format */

import { Formik, FormikProps } from "formik";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useGetAllCustomizePricingQuery,
  useGetCustomizePricingByIdQuery,
  useUpdateCustomizePricingMutation,
} from "src/pages/nutriplan-module/mealPlanning/customizePricing/services/api";
import {
  ICustomizePricingFormValues,
  ICustomizePricingTier,
  mapCustomizePricingApiToUi,
  mapFormToCustomizePricingPayload,
} from "src/types/modules/nutriplan/customizePricing";
import CustomizePricingForm from "./CustomizePricingForm";
import customizePricingValidationSchema from "./validation";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: ICustomizePricingTier;
}

const EditCustomizePricing: React.FC<IProps> = ({
  showEditModal,
  setShowEditModal,
  selectedRow,
}) => {
  const refForm = React.useRef<FormikProps<ICustomizePricingFormValues>>(null);
  const { messages } = useIntl();

  const { data: itemById, isLoading: detailsLoading } =
    useGetCustomizePricingByIdQuery(
      { id: selectedRow.id },
      { skip: !selectedRow.id || !showEditModal }
    );

  const { data: listData } = useGetAllCustomizePricingQuery(
    { pageNumber: 1, pageSize: 500 },
    { skip: !showEditModal }
  );

  const [updateCustomizePricing, { isLoading, isSuccess }] =
    useUpdateCustomizePricingMutation();

  const row = itemById?.data
    ? mapCustomizePricingApiToUi(itemById.data)
    : selectedRow;

  const existingTiers = useMemo(
    () => (listData?.data ?? []).map(mapCustomizePricingApiToUi),
    [listData?.data]
  );

  const validationSchema = useMemo(
    () =>
      customizePricingValidationSchema(messages, existingTiers, selectedRow.id),
    [messages, existingTiers, selectedRow.id]
  );

  return (
    <AppEditModal
      label='customizePricing.edit'
      open={showEditModal}
      itemName={`${row.macroType} ${row.fromGrams}-${row.toGrams}g`}
      errorMessage=''
      onClose={() => setShowEditModal(false)}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      handleSubmit={() => refForm.current?.submitForm()}
      loadingForEdit={isLoading}
      loading={detailsLoading}
      maxWidth='md'>
      <Formik
        enableReinitialize
        validateOnChange
        initialValues={{
          macroType: row.macroType,
          fromGrams: row.fromGrams,
          toGrams: row.toGrams,
          price: row.price,
          mealPlanId: row.mealPlanId || "",
          mealTypeId: row.mealTypeId || "",
          isActive: row.isActive,
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={(data) => {
          updateCustomizePricing({
            id: selectedRow.id,
            data: {
              id: selectedRow.id,
              ...mapFormToCustomizePricingPayload(data),
            },
          });
        }}>
        <CustomizePricingForm />
      </Formik>
    </AppEditModal>
  );
};

export default EditCustomizePricing;
