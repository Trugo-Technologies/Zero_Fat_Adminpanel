/** @format */

import { FormikOnSubmitType, inputType } from "src/types";
import GenerateForm from "src/Components/generate-form-component";
import { Yup } from "src/validation";
import { DynamicFormTypeFields } from "src/types";

import {
  equipmentCategoriesType,
  useAddEquipmentCategoriesMutation,
  useEditEquipmentCategoriesMutation,
} from "../services/api";
import { appendToFormData } from "src/Helpers/append-to-form-data";

type propTypes = {
  formValues: equipmentCategoriesType | undefined | "add";
  setOpenFOrmPopup: Function;
};
function EquipmentCategoriesForm({ formValues, setOpenFOrmPopup }: propTypes) {
  const [addEquipmentCategory, { isLoading: addLoading }] =
    useAddEquipmentCategoriesMutation();
  const [editEquipmentCategory, { isLoading: editLoading }] =
    useEditEquipmentCategoriesMutation();

  const fields: DynamicFormTypeFields = [
    { inputType: inputType.text, name: "nameEn", label: "Name en", md: 6 },
    { inputType: inputType.text, name: "nameAr", label: "Name ar", md: 6 },
    {
      inputType: inputType.image,
      name: "icon",
      label: "Icon url",
      md: 12,
      placeholder: "",
    },
  ];

  const initialValues = {
    nameEn: (formValues as equipmentCategoriesType)?.nameEn ?? "",
    nameAr: (formValues as equipmentCategoriesType)?.nameAr ?? "",
    icon: (formValues as equipmentCategoriesType)?.iconUrl ?? "",
  };

  const validationSchema = Yup.object({
    nameEn: Yup.text({ isRequired: true }),
    nameAr: Yup.text({ isRequired: true }),
    icon: Yup.text({ isRequired: true }),
  });

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    { setSubmitting }
  ) => {
    const fn =
      formValues === "add"
        ? addEquipmentCategory(appendToFormData(values))
        : editEquipmentCategory({
            id: formValues?.id,
            data: values,
            isActive: false,
          });
    return fn
      .unwrap()
      .then(() => {
        setOpenFOrmPopup(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  return (
    <GenerateForm
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={false}
      loading={false}
      ModalMode={{ onClose: () => setOpenFOrmPopup(false) }}
      hideCardContainer={true}
    />
  );
}
export default EquipmentCategoriesForm;
