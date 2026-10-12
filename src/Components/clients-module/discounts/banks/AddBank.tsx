/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import {
  useCreateBankMutation,
} from "src/pages/clients-module/discounts/banks/services/api";
import {
  buildBankFormData,
  IPromoBankFormValues,
} from "src/types/modules/clientsManagement/discounts/banks";
import BankForm from "./BankForm";
import banksValidationSchema from "./validation";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValues: IPromoBankFormValues = {
  nameEn: "",
  nameAr: "",
  cardBinPrefixes: [],
  logo: null,
  logoUrl: "",
  isActive: true,
};

const AddBank: React.FC<IProps> = ({ showAddModal, setShowAddModal }) => {
  const refForm = React.useRef<FormikProps<IPromoBankFormValues>>(null);
  const { messages } = useIntl();
  const [createBank, { isLoading, isSuccess }] = useCreateBankMutation();

  return (
    <AppAddModal
      label='promoBanks.add'
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      handleSubmit={() => refForm.current?.submitForm()}
      loadingForAdd={isLoading}
      maxWidth='sm'>
      <Formik
        validateOnChange
        initialValues={defaultValues}
        validationSchema={banksValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          createBank(buildBankFormData(data));
        }}>
        <BankForm />
      </Formik>
    </AppAddModal>
  );
};

export default AddBank;
