/** @format */

import AuthorizedCheckWrapper from "src/Components/authorized-check-wrapper";
import GenerateForm from "src/Components/generate-form-component";
import { privilegeFeature } from "src/shared/privileges";
import { DynamicFormTypeFields, FormikOnSubmitType } from "src/types";
import { Yup } from "src/validation";

function EditPlans() {
  const fields: DynamicFormTypeFields = [];

  const initialValues = {};

  const validationSchema = Yup.object({});

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    {}
  ) => {};

  return (
    <GenerateForm
      title={""}
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
})(EditPlans);
