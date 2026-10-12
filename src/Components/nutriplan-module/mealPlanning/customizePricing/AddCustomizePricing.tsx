/** @format */

import { Formik, FormikProps } from "formik";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import {
  useCreateCustomizePricingMutation,
  useGetAllCustomizePricingQuery,
} from "src/pages/nutriplan-module/mealPlanning/customizePricing/services/api";
import {
  CustomizeMacroType,
  ICustomizePricingFormValues,
  mapCustomizePricingApiToUi,
  mapFormToCustomizePricingPayload,
} from "src/types/modules/nutriplan/customizePricing";
import CustomizePricingForm from "./CustomizePricingForm";
import customizePricingValidationSchema from "./validation";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValues: ICustomizePricingFormValues = {
  macroType: CustomizeMacroType.Protein,
  fromGrams: "",
  toGrams: "",
  price: "",
  mealPlanId: "",
  mealTypeId: "",
  isActive: true,
};

const AddCustomizePricing: React.FC<IProps> = ({
  showAddModal,
  setShowAddModal,
}) => {
  const refForm = React.useRef<FormikProps<ICustomizePricingFormValues>>(null);
  const { messages } = useIntl();
  const [createCustomizePricing, { isLoading, isSuccess }] =
    useCreateCustomizePricingMutation();

  const { data: listData } = useGetAllCustomizePricingQuery(
    { pageNumber: 1, pageSize: 500 },
    { skip: !showAddModal }
  );

  const existingTiers = useMemo(
    () => (listData?.data ?? []).map(mapCustomizePricingApiToUi),
    [listData?.data]
  );

  const validationSchema = useMemo(
    () => customizePricingValidationSchema(messages, existingTiers),
    [messages, existingTiers]
  );

  return (
    <AppAddModal
      label='customizePricing.add'
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      handleSubmit={() => refForm.current?.submitForm()}
      loadingForAdd={isLoading}
      maxWidth='md'>
      <Formik
        validateOnChange
        initialValues={defaultValues}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={(data) => {
          createCustomizePricing(mapFormToCustomizePricingPayload(data));
        }}>
        <CustomizePricingForm />
      </Formik>
    </AppAddModal>
  );
};

export default AddCustomizePricing;
