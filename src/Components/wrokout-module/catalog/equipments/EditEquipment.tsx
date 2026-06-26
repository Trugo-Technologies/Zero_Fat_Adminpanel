/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllEquipmentCategoriesQuery } from "src/pages/workout-module/equipmentCategories/services/api";
import {
  useEditEquipmentMutation,
  useGetEquipmentQuery,
} from "src/pages/workout-module/equipments/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IEquipmentCategoriesListDto } from "src/types/modules/workout/equipmentCategories";
import { IUpdateEquipmentDto } from "src/types/modules/workout/equipments";
import * as yup from "yup";

interface IEditEquipmentProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditEquipment: React.FC<IEditEquipmentProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: equipmentItem, isLoading: detailsLoading } =
    useGetEquipmentQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [updateEquipment, { isLoading: editLoading, isSuccess, error }] =
    useEditEquipmentMutation();
  const {
    changePage,
    data,
    isError,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    searchValue,
    totalRecords,
    handleDelete,
    refetch,
  } = usePaginateData<IEquipmentCategoriesListDto>(
    useGetAllEquipmentCategoriesQuery
  );

  const refForm = React.useRef<FormikProps<IUpdateEquipmentDto>>(null);

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
  });

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppEditModal
      label={label}
      itemName={
        locale == "en-US" && equipmentItem?.data?.nameEn!
          ? `- ${equipmentItem?.data?.nameEn!}`
          : `- ${equipmentItem?.data?.nameAr!}`
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
      maxWidth={"sm"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow?.id || "",
          nameAr: equipmentItem?.data?.nameAr || "",
          nameEn: equipmentItem?.data?.nameEn || "",
          categoryId: equipmentItem?.data?.categoryId || "",
          category: equipmentItem?.data?.category || null,
          image: equipmentItem?.data?.imageUrl || "",
          imageUrl: equipmentItem?.data?.imageUrl || "",

          isActive: equipmentItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateEquipment({ id: selectedRow?.id, data });
        }}>
        {({ setFieldValue, values }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='common.nameAr' />}
                  name='nameAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='common.nameEn' />}
                  name='nameEn'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <AppBaseAutoComplete
                  label='sidebar.categories'
                  isLoading={isFetching}
                  options={data?.data}
                  hasNextPage={data?.hasNextPage}
                  pageNumber={page}
                  changePage={changePage}
                  defaultValue={values?.category}
                  onChangeAutoComplete={(value) => {
                    setFieldValue("categoryId", value ? value : "");
                    changePage(1);
                  }}
                  searchText={searchValue}
                  onChangeTextField={(value) => {
                    setSearchValue(value.target.value);
                    changePage(1);
                  }}
                />
              </Grid>
              <Grid item xs={6} display={"flex"} justifyContent={"flex-start"}>
                <AppCustomizedSwitch
                  defaultChecked={equipmentItem?.data?.isActive}
                  keyName='isActive'
                  onChange={setFieldValue}
                />
              </Grid>

              <Grid item xs={12}>
                <AppImageField
                  label={"common.image"}
                  name='image'
                  placeholder={""}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditEquipment;
