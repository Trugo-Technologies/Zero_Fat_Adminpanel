/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { useUpdateBankMutation } from "src/pages/clients-module/discounts/banks/services/api";
import {
  buildBankFormData,
  IPromoBank,
  IPromoBankFormValues,
} from "src/types/modules/clientsManagement/discounts/banks";
import BankForm from "./BankForm";
import banksValidationSchema from "./validation";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: IPromoBank;
}

const EditBank: React.FC<IProps> = ({
  showEditModal,
  setShowEditModal,
  selectedRow,
}) => {
  const refForm = React.useRef<FormikProps<IPromoBankFormValues>>(null);
  const { messages } = useIntl();
  const [updateBank, { isLoading, isSuccess }] = useUpdateBankMutation();

  return (
    <AppEditModal
      label='promoBanks.edit'
      open={showEditModal}
      itemName={selectedRow.nameEn}
      errorMessage=''
      onClose={() => setShowEditModal(false)}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      handleSubmit={() => refForm.current?.submitForm()}
      loadingForEdit={isLoading}
      loading={false}
      maxWidth='sm'>
      <Formik
        enableReinitialize
        validateOnChange
        initialValues={{
          nameEn: selectedRow.nameEn || "",
          nameAr: selectedRow.nameAr || "",
          cardBinPrefixes:
            selectedRow.cardBinPrefixes?.length
              ? selectedRow.cardBinPrefixes
              : selectedRow.code
                ? [selectedRow.code]
                : [],
          logo: selectedRow.logoUrl || null,
          logoUrl: selectedRow.logoUrl || "",
          isActive: selectedRow.isActive,
        }}
        validationSchema={banksValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          updateBank({
            id: selectedRow.id,
            data: buildBankFormData(data, { id: selectedRow.id }),
          });
        }}>
        <BankForm />
      </Formik>
    </AppEditModal>
  );
};

export default EditBank;
