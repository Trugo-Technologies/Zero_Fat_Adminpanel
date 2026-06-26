/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useAddCustomizationOptionMutation } from "src/pages/nutriplan-module/mealPlanning/customizationOptions/services/api";
import { ICreateCustomizationOptionDto } from "src/types/modules/nutriplan/mealPlanning/customizationOptions";
import CustomizationOptionsForm from "./CustomizationOptionsForm";
import customizationOptionsValidationSchema from "./validation";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}

const AddCustomizationOptions: React.FC<IProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;
  const { mealIdParams } = useParams();
  const refForm =
    React.useRef<FormikProps<ICreateCustomizationOptionDto>>(null);

  const [addCustomizationOptionMethod, { isLoading: addLoading, isSuccess }] =
    useAddCustomizationOptionMutation();

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
          caloriesAdjustment: null,
          carbsAdjustment: null,
          fatAdjustment: null,
          groupId: "",
          ingredientId: "",
          mealId: mealIdParams || "",
          priceAdjustment: null,
          proteinAdjustment: null,
          isAllMeals: true,
          image: "",
          isDefault: false,
        }}
        validationSchema={customizationOptionsValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          data = {
            ...data,
            caloriesAdjustment: data?.caloriesAdjustment || 0,
            fatAdjustment: data?.fatAdjustment || 0,
            carbsAdjustment: data?.carbsAdjustment || 0,
            priceAdjustment: data?.priceAdjustment || 0,
            proteinAdjustment: data?.proteinAdjustment || 0,
          };
          addCustomizationOptionMethod(data);
        }}>
        <CustomizationOptionsForm
          defaultGroup={null}
          defaultIngredient={null}
          defaultMeal={null}
        />
      </Formik>
    </AppAddModal>
  );
};

export default AddCustomizationOptions;
