/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppTags from "src/Components/baseComponents/inputs/AppTags";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  useEditFaqMutation,
  useGetFaqDetailsQuery,
} from "src/pages/core-module/faq/services";
import { useGetAllFaqCategoriesQuery } from "src/pages/core-module/faqCategories/services";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateFaq } from "src/types/modules/core/faq";
import { IFaqCategoriesListDto } from "src/types/modules/core/faqCategories";
import * as yup from "yup";

interface IEditFaqProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditFaq: React.FC<IEditFaqProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: faqItem, isLoading: detailsLoading } = useGetFaqDetailsQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updateFaq, { isLoading: editLoading, isSuccess, error }] =
    useEditFaqMutation();

  const refForm = React.useRef<FormikProps<IUpdateFaq>>(null);

  const validationSchema = yup.object({
    answer: yup.string().required(String(messages["validation.required"])),
    question: yup.string().required(String(messages["validation.required"])),
    faqCategoryId: yup
      .string()
      .required(String(messages["validation.required"])),
  });

  const {
    changePage: changePageFAQCategories,
    data: faqCategoriessList,
    isFetching: isFetchingFAQCategories,
    page: pageFAQCategories,
    setSearchValue: setSearchValueFAQCategories,
    searchValue: searchValueFAQCategories,
    refetch: refetchFAQCategories,
  } = usePaginateData<IFaqCategoriesListDto>(useGetAllFaqCategoriesQuery);

  useEffect(() => {
    if (pageFAQCategories && pageFAQCategories > 1) refetchFAQCategories();
  }, [pageFAQCategories]);

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
          id: selectedRow?.id || "",
          question: faqItem?.data?.question || "",
          answer: faqItem?.data?.answer || "",
          faqCategoryId: faqItem?.data?.faqCategoryId || "",
          tags: faqItem?.data?.tags || [],
          isActive: faqItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          updateFaq({ id: selectedRow?.id, data });
        }}>
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <AppTextField
                  label={<IntlMessages id='faqs.question' />}
                  name='question'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <AppFreeEditor name='answer' label='faqs.answer' />
              </Grid>
              <Grid item xs={6}>
                <AppBaseAutoComplete
                  label='faqCategories.name'
                  isLoading={isFetchingFAQCategories}
                  options={faqCategoriessList?.data}
                  hasNextPage={faqCategoriessList?.hasNextPage}
                  pageNumber={pageFAQCategories}
                  changePage={changePageFAQCategories}
                  defaultValue={faqItem?.data?.faqCategory}
                  onChangeAutoComplete={(event, value) => {
                    setFieldValue("faqCategoryId", value ? value?.id : "");
                    changePageFAQCategories(1);
                  }}
                  searchText={searchValueFAQCategories}
                  onChangeTextField={(value) => {
                    setSearchValueFAQCategories(value.target.value);
                    changePageFAQCategories(1);
                  }}
                  error={errors.faqCategoryId}
                  touched={touched.faqCategoryId}
                />
              </Grid>

              <Grid item xs={6}>
                <AppTags
                  error={errors?.tags}
                  touched={touched?.tags}
                  label='ingredients.tags'
                  onChangeAutoComplete={(event, value) =>
                    setFieldValue("tags", value)
                  }
                  value={values?.tags}
                />
              </Grid>

              <Grid item xs={12} display={"flex"} justifyContent={"flex-start"}>
                <AppCustomizedSwitch
                  defaultChecked={values?.isActive}
                  keyName='isActive'
                  onChange={setFieldValue}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditFaq;
