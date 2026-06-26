/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppDatePicker from "src/Components/baseComponents/inputs/dateTimePickers/AppDatePicker";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useCopyMenuMutation } from "src/pages/nutriplan-module/menuManagement/menus/services/api";
import { ICopyMenusDto } from "src/types/modules/nutriplan/menuManagement/menus";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import * as yup from "yup";

interface IProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  menu: {
    id: string;
    nameAr: string;
    nameEn: string;
  };
}

const CopyMenu: React.FC<IProps> = (props) => {
  const { label, setShowModal, showModal, menu } = props;

  const [copyMenuMethod, { isLoading: copyLoading, isSuccess }] =
    useCopyMenuMutation();

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    startDate: yup
      .string()
      .nullable()
      .typeError(String(messages["validation.required"]))
      .test(
        "is-valid-date",
        String(messages["validation.invalidDate"]),
        (value) => {
          // Check if value is not empty
          if (!value) return true; // Required validation already handles this

          // Check if the date is valid using moment
          const isValidDate = moment(value, "DD/MM/YYYY", true).isValid();
          return isValidDate;
        }
      )
      .required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICopyMenusDto>>(null);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppAddModal
      labelForAddBtn='menus.copy'
      label={label}
      open={showModal}
      onClose={() => setShowModal(false)}
      closeModalState={setShowModal}
      successClose={isSuccess}
      handleSubmit={submit}
      loadingForAdd={copyLoading}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          nameAr: menu.nameAr,
          nameEn: menu.nameEn,
          startDate: "",
          isPublished: false,
          menuId: menu.id,
        }}
        validationSchema={validationSchema}
        innerRef={refForm}
        onSubmit={async (data) => {
          let dataToSend = {
            ...data,
            startDate: dateFormatInBackendPayload(data?.startDate),
          };
          copyMenuMethod(dataToSend);
        }}>
        {({ setFieldValue, values, errors, touched }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='common.nameAr' />}
                  name='nameAr'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <AppTextField
                  label={<IntlMessages id='common.nameEn' />}
                  name='nameEn'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <AppDatePicker
                  label='common.startDate'
                  name='startDate'
                  onChange={setFieldValue}
                  value={values?.startDate}
                  errorText={
                    errors?.startDate && touched?.startDate
                      ? errors?.startDate
                      : ""
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <AppCheckbox
                  keyName='isPublished'
                  label='menus.isPublished'
                  defaultChecked={values?.isPublished}
                  onChange={setFieldValue}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppAddModal>
  );
};

export default CopyMenu;
