/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditCustomizationGroupMutation,
  useGetCustomizationGroupQuery,
} from "src/pages/nutriplan-module/mealPlanning/customizationGroups/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateCustomizationGroupDto } from "src/types/modules/nutriplan/mealPlanning/customizationGroups";
import CustomizationGroupForm from "./CustomizationGroupForm";
import customizationGroupsValidationSchema from "./validation";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
}

const EditCustomizationGroup: React.FC<IProps> = (props) => {
  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const refForm = React.useRef<FormikProps<IUpdateCustomizationGroupDto>>(null);

  const { data: ItemById, isLoading: detailsLoading } =
    useGetCustomizationGroupQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [editCustomizationGroupMethod, { isLoading: editLoading, isSuccess }] =
    useEditCustomizationGroupMutation();

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
          displayOrder: ItemById?.data?.displayOrder || null,
          isRequired: ItemById?.data?.isRequired!,
          imageUrl: ItemById?.data?.imageUrl || "",
          image: ItemById?.data?.imageUrl || "",
          caloriesAdjustment: ItemById?.data?.caloriesAdjustment || null,
          carbsAdjustment: ItemById?.data?.carbsAdjustment || null,
          fatAdjustment: ItemById?.data?.fatAdjustment || null,
          proteinAdjustment: ItemById?.data?.proteinAdjustment || null,
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
          editCustomizationGroupMethod({ id: selectedRow.id, data });
        }}>
        <CustomizationGroupForm />
      </Formik>
    </AppEditModal>
  );
};

export default EditCustomizationGroup;
