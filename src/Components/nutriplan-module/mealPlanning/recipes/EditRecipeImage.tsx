/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import { serialize } from "object-to-formdata";
import React from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditRecipeImageMutation,
  useGetRecipesQuery,
} from "src/pages/nutriplan-module/mealPlanning/recipes/services/api";

import { ISelectedRow } from "src/types/baseEntity";
import { IEditRecipeImageDto } from "src/types/modules/nutriplan/mealPlanning/recipes";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
}

const EditRecipeImage: React.FC<IProps> = (props) => {
  const { locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: itemById, isLoading: detailsLoading } = useGetRecipesQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updateImageMutation, { isLoading: editLoading, isSuccess, error }] =
    useEditRecipeImageMutation();

  const refForm = React.useRef<FormikProps<IEditRecipeImageDto>>(null);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppEditModal
      label={label}
      itemName={
        locale == "en-US" && selectedRow?.nameEn!
          ? `- ${selectedRow?.nameEn!}`
          : `- ${selectedRow?.nameAr!}`
      }
      open={showEditModal}
      onClose={() => {
        setShowEditModal(false);
      }}
      handleSubmit={submit}
      loading={detailsLoading}
      errorMessage={""}
      loadingForEdit={editLoading}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow.id,
          image: itemById?.data?.imageUrl || "",
        }}
        innerRef={refForm}
        onSubmit={async (data) => {
          let dataToSend = serialize(
            {
              ...data,
            },
            {
              indices: true,
            }
          );
          updateImageMutation(dataToSend);
        }}>
        {({}) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <AppImageField
                  name='image'
                  label='common.image'
                  placeholder=''
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditRecipeImage;
