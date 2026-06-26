/** @format */

import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import {
  DynamicFormTypeFields,
  FormikOnSubmitType,
  inputType,
} from "src/types";
import MainCard from "src/Components/cards/Main-card";
import { DialogActions, Divider, Grid } from "@mui/material";
import LanguagesTabWrapper from "src/Components/languages-tab-wrapper";
import DynamicInput from "src/Components/formik-input";
import GenericButton from "src/Components/generic-button";
import AreYouSureDialog from "src/Components/dialog/are-you-sure-dialog";
import ErrorAlert from "src/Components/error/error-alert";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import { useIntl } from "react-intl";
type PropsType<T> = {
  initialValues: T;
  loading?: boolean;
  isError?: boolean;
  onSubmit: FormikOnSubmitType<T>;
  isMultiLanguage?: boolean;
  title?: string | null;
  fields: DynamicFormTypeFields;
  validationSchema?: {};
  hideCardContainer?: Boolean;
  hideSubmitButton?: boolean;
  submitButtonTitle?: string;
  dirtyValuesOnly?: boolean;
  disableDirtyFlag?: boolean;
  showCancelButton?: {
    title: string;
    onClick: Function;
    disabled?: boolean;
    loading?: boolean;
  };
  ModalMode?: { onClose: () => void } | undefined;
  stepperMode?: {
    onBackButtonClick: () => void;
    backButtonTitle?: string;
    disableBackButton?: boolean;
  };
};
function GenerateForm<T extends {}>({
  initialValues,
  onSubmit,
  isMultiLanguage = false,
  title = "",
  fields,
  validationSchema,
  hideCardContainer = false,
  loading,
  isError,
  hideSubmitButton = false,
  submitButtonTitle = "common.add",
  dirtyValuesOnly = false,
  showCancelButton = undefined,
  disableDirtyFlag = false,
  ModalMode = undefined,
  stepperMode,
}: PropsType<T>) {
  const { messages } = useIntl();
  const [ln, setLn] = useState("ar");
  const [open, setOpen] = useState(false);
  const isValuesHasEnEmpty = (values: { [key: string]: any }) => {
    let result: boolean = false;
    for (const [key, value] of Object.entries(values)) {
      result = typeof value === "object" && values[key]["en"] === "";
      if (result) {
        break;
      }
    }
    return result;
  };

  const submitHandler: FormikOnSubmitType<T> = (values, helpers) => {
    // const dirtyValues = getDifferentValuesKeys(
    //   initialValues,
    //   values,
    //   !dirtyValuesOnly
    // );

    return onSubmit(values as T, helpers);
  };

  if (isError) return <ErrorAlert />;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitHandler}
      validateOnChange={true}
      validationSchema={validationSchema}>
      {({
        errors,
        touched,
        isSubmitting,
        dirty,
        handleSubmit,
        submitForm,
        values,
      }) => {
        return (
          <>
            <MainCard
              dialogMode={ModalMode}
              loading={loading}
              hide={hideCardContainer}
              title={messages[title ?? ""]}>
              <form
                onSubmit={(e) => {
                  if (isMultiLanguage && isValuesHasEnEmpty(values)) {
                    e.preventDefault();
                    setOpen(true);
                  } else handleSubmit(e);
                }}>
                <>
                  <Grid container spacing={3} columnSpacing={4}>
                    {isMultiLanguage && (
                      <Grid item xs={12}>
                        <LanguagesTabWrapper
                          errors={errors}
                          ln={ln}
                          setLn={setLn}
                          touched={touched}
                        />
                      </Grid>
                    )}
                    {fields.map((field, index) => {
                      const { name, renderComponent, xs, md, sm, lg, xl } =
                        field;
                      if (field.inputType === inputType.checkBox)
                        return (
                          <Grid
                            key={index}
                            item
                            xs={xs ?? 12}
                            sm={sm ?? undefined}
                            md={md ?? undefined}
                            lg={lg ?? undefined}
                            xl={xl ?? undefined}>
                            <DynamicInput
                              {...field}
                              name={name.replace("[multiLn]", ln)}
                            />
                          </Grid>
                        );
                      else if (field.inputType === inputType.custom)
                        return (
                          <Grid
                            key={index}
                            item
                            xs={xs ?? 12}
                            sm={sm ?? undefined}
                            md={md ?? 6}
                            lg={lg ?? undefined}
                            xl={xl ?? undefined}>
                            {renderComponent}
                          </Grid>
                        );
                      else
                        return (
                          <Grid
                            key={index}
                            item
                            xs={xs ?? 12}
                            sm={sm ?? undefined}
                            md={md ?? 4}
                            lg={lg ?? undefined}
                            xl={xl ?? undefined}>
                            <DynamicInput
                              {...field}
                              name={name.replace("[multiLn]", ln)}
                            />
                          </Grid>
                        );
                    })}
                    <Grid item xs={12} container spacing={2}>
                      <>
                        {showCancelButton && (
                          <Grid item xs={4} md={2}>
                            <GenericButton
                              variant='outlined'
                              onClick={showCancelButton.onClick}
                              title={showCancelButton.title}
                              loading={showCancelButton.loading}
                              disabled={showCancelButton.disabled}
                            />
                          </Grid>
                        )}
                        {!hideSubmitButton && !ModalMode && (
                          <Grid item xs={4} md={2}>
                            <GenericButton
                              type='submit'
                              title={submitButtonTitle}
                              loading={isSubmitting}
                              disabled={!dirty && !disableDirtyFlag}
                            />
                          </Grid>
                        )}
                      </>
                    </Grid>

                    <AreYouSureDialog
                      isWarning
                      message='some content are missing are you sure'
                      open={open}
                      setOpen={setOpen}
                      confirmHandler={submitForm}
                    />
                  </Grid>
                </>
              </form>
            </MainCard>
            {ModalMode && (
              <DialogActions>
                <AppButton
                  label='common.cancel'
                  color='warning'
                  onClick={ModalMode?.onClose}
                />
                {stepperMode && (
                  <AppButton
                    label={stepperMode?.backButtonTitle ?? ""}
                    color='inherit'
                    onClick={stepperMode?.onBackButtonClick ?? (() => {})}
                    disabled={stepperMode.disableBackButton || isSubmitting}
                  />
                )}

                <AppButton
                  label={submitButtonTitle}
                  loading={isSubmitting}
                  type='submit'
                  onClick={() => submitForm()}
                />
              </DialogActions>
            )}
          </>
        );
      }}
    </Formik>
  );
}

export default GenerateForm;
