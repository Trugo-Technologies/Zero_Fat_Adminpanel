/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllEquipmentCategoriesQuery } from "src/pages/workout-module/equipmentCategories/services/api";
import { useAddEquipmentMutation } from "src/pages/workout-module/equipments/services/api";
import { IEquipmentCategoriesListDto } from "src/types/modules/workout/equipmentCategories";
import { ICreateEquipmentDto } from "src/types/modules/workout/equipments";
import * as yup from "yup";

interface IAddEquipmentProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddEquipment: React.FC<IAddEquipmentProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addEquipmentMethod, { isLoading: addLoading, isSuccess }] =
    useAddEquipmentMutation();

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

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    categoryId: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateEquipmentDto>>(null);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  useEffect(() => {
    if (page && page > 1) refetch();
  }, [page]);

  return (
    <>
      <AppAddModal
        label={label}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        closeModalState={setShowAddModal}
        successClose={isSuccess}
        handleSubmit={submit}
        loadingForAdd={addLoading}
        maxWidth={"sm"}>
        <Formik
          validateOnChange={true}
          initialValues={{
            nameAr: "",
            nameEn: "",
            categoryId: "",
            image: "",
            isActive: true,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addEquipmentMethod(data);
          }}>
          {({ setFieldValue, errors, touched }) => {
            return (
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
                      onChangeAutoComplete={(event, value) => {
                        setFieldValue("categoryId", value ? value?.id : "");
                        changePage(1);
                      }}
                      searchText={searchValue}
                      onChangeTextField={(value) => {
                        setSearchValue(value.target.value);
                        changePage(1);
                      }}
                      error={errors.categoryId}
                      touched={touched.categoryId}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    display={"flex"}
                    justifyContent={"flex-start"}>
                    <AppCustomizedSwitch
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
            );
          }}
        </Formik>
        {/* <GenerateForm
          isMultiLanguage={false}
          fields={fields}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (data, { setSubmitting }) => {
            // AddEquipment.submitData(data);
          }}
          hideCardContainer={true}
          isError={false}
          loading={false}
        /> */}
      </AppAddModal>
    </>
  );
};

export default AddEquipment;
