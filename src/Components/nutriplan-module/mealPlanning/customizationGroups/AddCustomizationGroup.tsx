/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useAddCustomizationGroupMutation } from "src/pages/nutriplan-module/mealPlanning/customizationGroups/services/api";
import { ICreateCustomizationGroupDto } from "src/types/modules/nutriplan/mealPlanning/customizationGroups";
import CustomizationGroupForm from "./CustomizationGroupForm";
import customizationGroupsValidationSchema from "./validation";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}

const AddCustomizationGroup: React.FC<IProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;
  const refForm = React.useRef<FormikProps<ICreateCustomizationGroupDto>>(null);

  const [addCustomizationGroupMethod, { isLoading: addLoading, isSuccess }] =
    useAddCustomizationGroupMutation();

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
          nameAr: "",
          nameEn: "",
          displayOrder: null,
          isRequired: false,
          image: "",
          caloriesAdjustment: null,
          carbsAdjustment: null,
          fatAdjustment: null,
          proteinAdjustment: null,
        }}
        validationSchema={customizationGroupsValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          data = {
            ...data,
            caloriesAdjustment: data?.caloriesAdjustment || 0,
            carbsAdjustment: data?.carbsAdjustment || 0,
            fatAdjustment: data?.fatAdjustment || 0,
            proteinAdjustment: data?.proteinAdjustment || 0,
          };
          addCustomizationGroupMethod(data);
        }}>
        <CustomizationGroupForm />
      </Formik>
    </AppAddModal>
  );
};

export default AddCustomizationGroup;
