/** @format */
/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditCustomizationOptionMutation,
  useGetCustomizationOptionQuery,
} from "src/pages/nutriplan-module/mealPlanning/customizationOptions/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateCustomizationOptionDto } from "src/types/modules/nutriplan/mealPlanning/customizationOptions";
import CustomizationOptionsForm from "./CustomizationOptionsForm";
import customizationOptionsValidationSchema from "./validation";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
}

const EditCustomizationOptions: React.FC<IProps> = (props) => {
  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const refForm =
    React.useRef<FormikProps<IUpdateCustomizationOptionDto>>(null);

  const { data: ItemById, isLoading: detailsLoading } =
    useGetCustomizationOptionQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [editCustomizationOptionMethod, { isLoading: editLoading, isSuccess }] =
    useEditCustomizationOptionMutation();

  const { messages, locale } = useIntl();

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppEditModal
      label={label}
      open={showEditModal}
      itemName={
        locale == "en-US" && selectedRow?.nameEn!
          ? `- ${selectedRow?.nameEn!}`
          : `- ${selectedRow?.nameAr!}`
      }
      errorMessage=''
      onClose={() => setShowEditModal(false)}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForEdit={editLoading}
      loading={detailsLoading}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow.id,
          nameAr: selectedRow.nameAr,
          nameEn: selectedRow.nameEn,
          isDefault: ItemById?.data?.isDefault!,
          imageUrl: ItemById?.data?.imageUrl || "",
          image: ItemById?.data?.imageUrl || "",
          caloriesAdjustment: ItemById?.data?.caloriesAdjustment || null,
          fatAdjustment: ItemById?.data?.fatAdjustment || null,
          priceAdjustment: ItemById?.data?.priceAdjustment || null,
          proteinAdjustment: ItemById?.data?.proteinAdjustment || null,
          carbsAdjustment: ItemById?.data?.carbsAdjustment || null,
          groupId: ItemById?.data?.groupId || "",
          ingredientId: ItemById?.data?.ingredientId || "",
          isAllMeals: !ItemById?.data?.meal,
          mealId: ItemById?.data?.mealId || "",
        }}
        validationSchema={customizationOptionsValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          editCustomizationOptionMethod({
            id: selectedRow.id,
            data: {
              ...data,
              caloriesAdjustment: data?.caloriesAdjustment || 0,
              fatAdjustment: data?.fatAdjustment || 0,
              carbsAdjustment: data?.carbsAdjustment || 0,
              priceAdjustment: data?.priceAdjustment || 0,
              proteinAdjustment: data?.proteinAdjustment || 0,
            },
          });
        }}>
        <CustomizationOptionsForm
          defaultGroup={ItemById?.data?.group || null}
          defaultMeal={ItemById?.data?.meal || null}
          defaultIngredient={ItemById?.data?.ingredient || null}
        />
      </Formik>
    </AppEditModal>
  );
};

export default EditCustomizationOptions;
