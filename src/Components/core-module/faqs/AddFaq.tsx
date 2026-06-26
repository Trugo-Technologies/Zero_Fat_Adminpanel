/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppTags from "src/Components/baseComponents/inputs/AppTags";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useAddFaqMutation } from "src/pages/core-module/faq/services";
import { useGetAllFaqCategoriesQuery } from "src/pages/core-module/faqCategories/services";
import { ICreateFaq } from "src/types/modules/core/faq";
import { IFaqCategoriesListDto } from "src/types/modules/core/faqCategories";
import * as yup from "yup";

interface IAddFaqProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddFaq: React.FC<IAddFaqProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addFaqMethod, { isLoading: addLoading, isSuccess }] =
    useAddFaqMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    answer: yup.string().required(String(messages["validation.required"])),
    question: yup.string().required(String(messages["validation.required"])),
    faqCategoryId: yup
      .string()
      .required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateFaq>>(null);

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
    <>
      <AppAddModal
        label={label}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        closeModalState={setShowAddModal}
        successClose={isSuccess}
        handleSubmit={submit}
        loadingForAdd={addLoading}
        maxWidth={"md"}>
        <Formik
          validateOnChange={true}
          initialValues={{
            question: "",
            answer: "",
            faqCategoryId: "",
            tags: [],
            isActive: false,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            addFaqMethod(data);
          }}>
          {({ errors, touched, setFieldValue, values }) => (
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

                <Grid
                  item
                  xs={12}
                  display={"flex"}
                  justifyContent={"flex-start"}>
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
      </AppAddModal>
    </>
  );
};

export default AddFaq;
