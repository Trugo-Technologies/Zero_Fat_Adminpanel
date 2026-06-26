/** @format */

import {
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useGetClientPortalSettingsQuery,
  useUpdateClientPortalSettingsMutation,
} from "src/pages/clients-module/clientPortalSettings/services/api";

import { nutriPlanStartegy } from "src/types/enums";
import { IUpdateClientPortalSettings } from "src/types/modules/clientsManagement/clientPortalSettings";
import * as yup from "yup";

interface IEditClientPortalSettingsProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditClientPortalSettings: React.FC<IEditClientPortalSettingsProps> = (
  props
) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label } = props;
  const {
    data: clientPortalSettingsItem,
    isLoading: detailsLoading,
    refetch,
  } = useGetClientPortalSettingsQuery({});
  const [
    updateClientPortalSettingsMethod,
    { isLoading: editLoading, isSuccess, error },
  ] = useUpdateClientPortalSettingsMutation();

  const refForm = React.useRef<FormikProps<IUpdateClientPortalSettings>>(null);

  const validationSchema = yup.object({
    nutriPlanStartegy: yup
      .string()
      .required(String(messages["validation.required"])),

    weeklyCaloricDeficit: yup
      .number()
      .nullable()
      .when("nutriPlanStartegy", {
        is: (val: string) => val === nutriPlanStartegy.BasedOnCalories,
        then: () =>
          yup
            .number()
            .nullable()
            .positive(String(messages["validation.positive"]))
            .required(String(messages["validation.required"])),
        otherwise: () => yup.number().notRequired(),
      }),
    weeklyCaloricSurplus: yup
      .number()
      .nullable()
      .when("nutriPlanStartegy", {
        is: (val: string) => val === nutriPlanStartegy.BasedOnCalories,
        then: () =>
          yup
            .number()
            .nullable()
            .positive(String(messages["validation.positive"]))
            .required(String(messages["validation.required"])),
        otherwise: () => yup.number().notRequired(),
      }),

    defaultNutriPlanTimeAvailable: yup
      .number()
      .nullable()
      .when("nutriPlanStartegy", {
        is: (val: string) => val === nutriPlanStartegy.BasedOnTime,
        then: () =>
          yup
            .number()
            .nullable()
            .positive(String(messages["validation.positive"]))
            .required(String(messages["validation.required"])),
        otherwise: () => yup.number().notRequired(),
      }),
  });

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);
  return (
    <AppEditModal
      label={label}
      itemName={""}
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
          nutriPlanStartegy:
            clientPortalSettingsItem?.data?.nutriPlanStartegy! ||
            nutriPlanStartegy.BasedOnCalories,
          onePointEqualInMoney:
            clientPortalSettingsItem?.data?.onePointEqualInMoney || null,
          defaultNutriPlanTimeAvailable:
            clientPortalSettingsItem?.data?.defaultNutriPlanTimeAvailable ||
            null,
          weeklyCaloricDeficit:
            clientPortalSettingsItem?.data?.weeklyCaloricDeficit || null,
          weeklyCaloricSurplus:
            clientPortalSettingsItem?.data?.weeklyCaloricSurplus || null,
          monthlyPackageSubsciptionDiscount:
            clientPortalSettingsItem?.data?.monthlyPackageSubsciptionDiscount ||
            null,

          threeMonthlyPackageSubsciptionDiscount:
            clientPortalSettingsItem?.data
              ?.threeMonthlyPackageSubsciptionDiscount || null,
          minimumSubsciption:
            clientPortalSettingsItem?.data?.minimumSubsciption || null,

          offsetSubscriptionInDays:
            clientPortalSettingsItem?.data?.offsetSubscriptionInDays || null,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data) => {
          data = {
            ...data,
            monthlyPackageSubsciptionDiscount: Number(
              data?.monthlyPackageSubsciptionDiscount
            ),
            threeMonthlyPackageSubsciptionDiscount: Number(
              data?.threeMonthlyPackageSubsciptionDiscount
            ),
          };
          updateClientPortalSettingsMethod({ data });
        }}>
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <FormControl variant='outlined' fullWidth size='small'>
                  <InputLabel id='select-footer'>
                    {
                      messages[
                        "clientPortalSettings.nutriPlanStartegy"
                      ] as string
                    }
                  </InputLabel>

                  <Select
                    value={values?.nutriPlanStartegy}
                    defaultValue={values?.nutriPlanStartegy}
                    fullWidth
                    size='small'
                    name='nutriPlanStartegy'
                    labelId='clientPortalSettings.nutriPlanStartegy'
                    label={
                      messages[
                        "clientPortalSettings.nutriPlanStartegy"
                      ] as string
                    }
                    onChange={(event) => {
                      setFieldValue("defaultNutriPlanTimeAvailable", null);
                      setFieldValue("weeklyCaloricDeficit", null);
                      setFieldValue("weeklyCaloricSurplus", null);

                      setFieldValue("nutriPlanStartegy", event.target.value);
                    }}>
                    <MenuItem value={nutriPlanStartegy.BasedOnCalories}>
                      <IntlMessages id='clientPortalSettings.nutriPlanStartegy.BasedOnCalories' />
                    </MenuItem>
                    <MenuItem value={nutriPlanStartegy.BasedOnTime}>
                      <IntlMessages id='clientPortalSettings.nutriPlanStartegy.BasedOnTime' />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {values?.nutriPlanStartegy === nutriPlanStartegy.BasedOnTime && (
                <Grid item xs={4}>
                  <AppTextField
                    label={
                      <IntlMessages id='clientPortalSettings.defaultNutriPlanTimeAvailable' />
                    }
                    name='defaultNutriPlanTimeAvailable'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
              )}
              {values?.nutriPlanStartegy ===
                nutriPlanStartegy.BasedOnCalories && (
                <>
                  <Grid item xs={4}>
                    <AppTextField
                      label={
                        <IntlMessages id='clientPortalSettings.weeklyCaloricDeficit' />
                      }
                      name='weeklyCaloricDeficit'
                      variant='outlined'
                      size='small'
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <AppTextField
                      label={
                        <IntlMessages id='clientPortalSettings.weeklyCaloricSurplus' />
                      }
                      name='weeklyCaloricSurplus'
                      variant='outlined'
                      size='small'
                      fullWidth
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={4}>
                <AppTextField
                  label={
                    <IntlMessages id='clientPortalSettings.onePointEqualInMoney' />
                  }
                  name='onePointEqualInMoney'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Divider
                  sx={{
                    color: "#a5d060",
                    fontWeight: Fonts.SEMI_BOLD,
                  }}
                  variant='fullWidth'>
                  {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
                  <Chip
                    label={
                      messages["clientPortalSettings.subsciption"] as string
                    }
                    size='medium'
                    color='primary'
                    sx={{ fontSize: 17 }}
                  />
                </Divider>
              </Grid>
              <Grid item xs={4}>
                <AppTextField
                  label={
                    <IntlMessages id='clientPortalSettings.minimumSubsciption' />
                  }
                  name='minimumSubsciption'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <AppTextField
                  label={
                    <IntlMessages id='clientPortalSettings.monthlyPackageSubsciptionDiscount' />
                  }
                  name='monthlyPackageSubsciptionDiscount'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <AppTextField
                  label={
                    <IntlMessages id='clientPortalSettings.threeMonthlyPackageSubsciptionDiscount' />
                  }
                  name='threeMonthlyPackageSubsciptionDiscount'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <AppTextField
                  label={
                    <IntlMessages id='clientPortalSettings.offsetSubscriptionInDays' />
                  }
                  name='offsetSubscriptionInDays'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditClientPortalSettings;
