/** @format */

import AuthorizedCheckWrapper from "src/Components/authorized-check-wrapper";
import GenerateForm from "src/Components/generate-form-component";
import { privilegeFeature } from "src/shared/privileges";
import {
  DynamicFormTypeFields,
  FormikOnSubmitType,
  inputType,
} from "src/types";
import { Yup } from "src/validation";

function AddPlans() {
  const fields: DynamicFormTypeFields = [
    { inputType: inputType.text, name: "nameEn", label: "name in en" },
  ];

  const initialValues = {};

  const validationSchema = Yup.object({
    nameEn: Yup.text({ isRequired: true }),
  });

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    {}
  ) => {};

  return (
    <GenerateForm
      title={"add plan"}
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={false}
      loading={false}
    />
  );
}
export default AuthorizedCheckWrapper({
  feature: privilegeFeature.all,
  type: "add",
})(AddPlans);
