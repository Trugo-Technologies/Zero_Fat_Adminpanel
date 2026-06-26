/** @format */

import { Grid, Typography } from "@mui/material";
import { FormikProps } from "formik";
import * as React from "react";
import { Accept, useDropzone } from "react-dropzone";
import PreviewThumb from "src/Components/baseComponents/uploadFile/PreviewThumb";
import UploadModern from "src/Components/baseComponents/uploadFile/UploadModern";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppGrid from "src/@crema/components/AppGrid";

// * Values of fields in the form

interface IAppUploadPhotoProps {
  uploadText?: string;
  formRef?: React.RefObject<FormikProps<any>>;
  spacing?: number;
  keyName?: string;
  uploadedFiles: any[];
  errors?: boolean;
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
  accept?: Accept;
  helperText?: string;
  uploadModernXs?: number;
  appGridXs?: number;
  multiple?: boolean;
}

const AppUploadPhoto: React.FC<IAppUploadPhotoProps> = (props) => {
  const {
    uploadText = "common.uploadPhoto",
    spacing = 2,
    uploadedFiles,
    formRef,
    keyName,
    setUploadedFiles,
    errors,
    accept = { "image/*": [] },
    helperText = "validation.required",
    uploadModernXs = 3,
    appGridXs = 3,
    multiple = false,
  } = props;

  const dropzone = useDropzone({
    accept: accept,
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      setUploadedFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      if (formRef?.current && keyName) {
        formRef.current.setFieldValue(
          keyName,
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      }
    },
  });

  // React.useEffect(() => {
  //   setUploadedFiles(dropzone.acceptedFiles);
  // }, [dropzone.acceptedFiles]);

  const onDeleteUploadFile = (file: any) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
    if (formRef?.current && keyName) {
      formRef.current.setFieldValue(keyName, [...dropzone.acceptedFiles]);
    }
  };

  return (
    <>
      <Grid item xs={uploadModernXs}>
        <UploadModern uploadText={uploadText} dropzone={dropzone} />
        {errors && (
          <Typography
            style={{ marginTop: "5px", fontSize: "0.75rem" }}
            variant='body1'
            color='error'>
            <IntlMessages id={helperText} />
          </Typography>
        )}
      </Grid>

      <Grid item xs={appGridXs}>
        <AppGrid
          data={uploadedFiles}
          renderRow={(file, index) => (
            <PreviewThumb
              file={file}
              onDeleteUploadFile={onDeleteUploadFile}
              key={index + file.path}
            />
          )}
        />
      </Grid>
    </>
  );
};

export default AppUploadPhoto;
