/** @format */

import { Grid, MenuItem } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppGoogleMap from "src/Components/baseComponents/googleMap/AppGoogleMap";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useEditClientLocationMutation,
  useGetClientLocationDetailsQuery,
} from "src/pages/clients-module/clientLocations/services/api";

import { ISelectedRow } from "src/types/baseEntity";
import {
  IAddressDto,
  IUpdateClientLocation,
} from "src/types/modules/clientsManagement/clientLocations";
import * as yup from "yup";

interface IEditClientLocationProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  clientId: string;

  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditClientLocation: React.FC<IEditClientLocationProps> = (props) => {
  const { messages, locale } = useIntl();

  const { showEditModal, setShowEditModal, label, clientId, selectedRow } =
    props;
  const [currentLocation, setCurrentLocation] = useState<
    IAddressDto | undefined
  >({
    latitude: 33.5022498,
    longitude: 36.2561701,
  });
  const { data: clientLocationItem, isLoading: detailsLoading } =
    useGetClientLocationDetailsQuery(
      { id: selectedRow?.id || "" },
      {
        skip: !selectedRow?.id,
      }
    );
  const [
    updateClientLocationMethod,
    { isLoading: editLoading, isSuccess, error },
  ] = useEditClientLocationMutation();

  const refForm = React.useRef<FormikProps<IUpdateClientLocation>>(null);

  const validationSchema = yup.object({
    clientId: yup.string().required(String(messages["validation.required"])),
    fullAddressAr: yup
      .string()
      .required(String(messages["validation.required"])),
    fullAddressEn: yup
      .string()
      .required(String(messages["validation.required"])),
    area: yup.string().required(String(messages["validation.required"])),
    postalCode: yup.string().required(String(messages["validation.required"])),
  });

  useEffect(() => {
    setCurrentLocation({
      latitude: clientLocationItem?.data?.latitude!,
      longitude: clientLocationItem?.data?.longitude!,
    });
  }, [clientLocationItem]);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
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
          id: selectedRow?.id || "",
          clientId: clientId,
          area: clientLocationItem?.data?.area || "",
          block: clientLocationItem?.data?.block || "",
          building: clientLocationItem?.data?.building || "",
          flat: clientLocationItem?.data?.flat || "",
          office: clientLocationItem?.data?.office || "",
          street: clientLocationItem?.data?.street || "",
          postalCode: clientLocationItem?.data?.postalCode || "",
          type: clientLocationItem?.data?.type || "Home",
          fullAddressAr: clientLocationItem?.data?.fullAddressAr || "",
          fullAddressEn: clientLocationItem?.data?.fullAddressEn || "",
          notesFromClient: clientLocationItem?.data?.notesFromClient || "",
          notesFromZeroFat: clientLocationItem?.data?.notesFromZeroFat || "",
          latitude:
            clientLocationItem?.data?.latitude ||
            currentLocation?.latitude ||
            0,
          longitude:
            clientLocationItem?.data?.longitude ||
            currentLocation?.longitude ||
            0,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          const dataToSend = {
            ...data,
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
          };
          updateClientLocationMethod({ id: selectedRow?.id, data: dataToSend });
        }}>
        {({ errors, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <AppSelectField
                  fullWidth
                  size='small'
                  name='type'
                  labelId='clientLocations.type'
                  label={messages["clientLocations.type"] as string}
                  error={Boolean(errors?.type)}>
                  <MenuItem value={"Home"}>
                    <IntlMessages id='clientLocations.type.Home' />
                  </MenuItem>
                  <MenuItem value={"Office"}>
                    <IntlMessages id='clientLocations.type.Office' />
                  </MenuItem>
                </AppSelectField>
              </Grid>
              <Grid item xs={3}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.area' />}
                  name='area'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.building' />}
                  name='building'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.flat' />}
                  name='flat'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={3}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.street' />}
                  name='street'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.postalCode' />}
                  name='postalCode'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.block' />}
                  name='block'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.office' />}
                  name='office'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.fullAddressAr' />}
                  name='fullAddressAr'
                  variant='outlined'
                  size='small'
                  multiline
                  minRows={2}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.fullAddressEn' />}
                  name='fullAddressEn'
                  variant='outlined'
                  size='small'
                  multiline
                  minRows={2}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.notesFromClient' />}
                  name='notesFromClient'
                  variant='outlined'
                  size='small'
                  multiline
                  minRows={2}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label={<IntlMessages id='clientLocations.notesFromZeroFat' />}
                  name='notesFromZeroFat'
                  variant='outlined'
                  size='small'
                  multiline
                  minRows={2}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sx={{ minHeight: 300 }}>
                <AppGoogleMap
                  currentLocation={currentLocation}
                  setCurrentLocation={setCurrentLocation}
                  draggable
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditClientLocation;
