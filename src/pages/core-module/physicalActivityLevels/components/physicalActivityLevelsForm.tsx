/** @format */

import React from "react";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import GenerateForm from "src/Components/generate-form-component";
import {
  DynamicFormTypeFields,
  FormikOnSubmitType,
  inputType,
} from "src/types";
import * as yup from "yup";
import { useAddPhysicalActivityLevelsMutation } from "../services";
import { appendToFormData } from "src/Helpers/append-to-form-data";
import { useIntl } from "react-intl";
type IPropType = {
  label: string;
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
};
function PhysicalActivityLevelsForm({
  label,
  setShowAddModal,
  showAddModal,
  id,
}: IPropType) {
  const { messages } = useIntl();
  const [add] = useAddPhysicalActivityLevelsMutation();
  const onClose = () => setShowAddModal(false);
  const fields: DynamicFormTypeFields = [
    {
      inputType: inputType.text,
      name: "DescriptionAr",
      label: "faqCat.descriptionAr",
      md: 6,
      multiline: true,
      minRows: 3,
    },
    {
      inputType: inputType.text,
      name: "DescriptionEn",
      label: "faqCat.descriptionEn",
      multiline: true,
      minRows: 3,
      md: 6,
    },
    {
      inputType: inputType.text,
      name: "ExampleAr",
      label: "physicalActivityLevels.exampleAr",
      md: 6,
    },
    {
      inputType: inputType.text,
      name: "ExampleEn",
      label: "physicalActivityLevels.exampleEn",
      md: 6,
    },
    {
      inputType: inputType.text,
      name: "ActivityValue",
      label: "physicalActivityLevels.activityValue",
      type: "number",
      md: 2,
    },
    {
      inputType: inputType.image,
      name: "Image",
      label: "adv.Image",
      placeholder: "",
      md: 12,
    },
    {
      inputType: inputType.switch,
      name: "IsActive",
      label: "IsActive",
    },
  ];
  const initialValues = {
    DescriptionAr: "",
    DescriptionEn: "",
    ExampleEn: "",
    ExampleAr: "",
    ActivityValue: "",
    IsActive: true,
  };
  const validationSchema = yup.object({
    DescriptionAr: yup
      .string()
      .required(String(messages["validation.required"])),
    DescriptionEn: yup
      .string()
      .required(String(messages["validation.required"])),
    ExampleEn: yup.string().required(String(messages["validation.required"])),
    ExampleAr: yup.string().required(String(messages["validation.required"])),
    ActivityValue: yup
      .number()
      .min(1)
      .required(String(messages["validation.required"])),
  });

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (values) => {
    return add(appendToFormData(values)).unwrap().then(onClose);
  };
  return (
    <AppAddModal
      label={label}
      open={showAddModal}
      onClose={onClose}
      closeModalState={setShowAddModal}
      maxWidth={"md"}
      generateFormMode={true}
      showActions={false}
      //   isLoading={isLoading || isFetching}
    >
      <GenerateForm
        ModalMode={{ onClose }}
        fields={fields}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      />
    </AppAddModal>
  );
}

export default PhysicalActivityLevelsForm;
