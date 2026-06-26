/** @format */

import { Grid, Typography } from "@mui/material";
import { FormikProps } from "formik";
import * as React from "react";
import { Accept, useDropzone } from "react-dropzone";
import FileRow from "src/Components/baseComponents/uploadFile/FileRow";
import UploadModern from "src/Components/baseComponents/uploadFile/UploadModern";
import AppList from "src/@crema/components/AppList";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface IAppUploadDocumentProps {
  uploadText?: string;
  xsSize?: number;
  spacing?: number;
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
  keyName?: string;
  formRef?: React.RefObject<FormikProps<any>>;
  errors?: boolean;
  accept?: Accept;
  helperText?: string;
  uploadModernXs?: number;
  appGridXs?: number;
  maxSize?: number;
  color?: string;
  multiple?: boolean;
}

const AppUploadDocument: React.FC<IAppUploadDocumentProps> = (props) => {
  const {
    uploadText = "common.uploadFile",
    uploadedFiles,
    setUploadedFiles,
    formRef,
    keyName,
    errors,
    accept = {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [], // .docx
      "application/msword": [], // .doc
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // .xlsx
      "application/vnd.ms-excel": [], // .xls
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [], // .pptx
      "application/vnd.ms-powerpoint": [], // .ppt
    },
    uploadModernXs = 3,
    appGridXs = 3,
    helperText = "validation.required",
    maxSize,
    color,
    multiple = false,
  } = props;

  const dropzone = useDropzone({
    accept: accept,
    multiple: multiple,
    maxSize: maxSize && maxSize * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (multiple) {
        setUploadedFiles((prevState) => [
          ...prevState,
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ]);
      } else {
        setUploadedFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      }
      if (formRef?.current && keyName) {
        if (multiple) {
          // uploadedFiles
          formRef.current.setFieldValue(
            keyName,
            [...uploadedFiles, ...acceptedFiles].map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          );
        } else {
          formRef.current.setFieldValue(
            keyName,
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          );
        }
      }
    },
  });

  // React.useEffect(() => {
  //   setUploadedFiles(dropzone.acceptedFiles);
  // }, [dropzone.acceptedFiles]);

  const onDeleteUploadFile = (file: any) => {
    if (multiple) {
      const currentFiles = [...uploadedFiles];
      currentFiles.splice(currentFiles.indexOf(file), 1);
      setUploadedFiles(currentFiles);
      if (formRef?.current && keyName) {
        formRef.current.setFieldValue(keyName, currentFiles);
      }
    } else {
      dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
      setUploadedFiles([...dropzone.acceptedFiles]);
      if (formRef?.current && keyName) {
        formRef.current.setFieldValue(keyName, [...dropzone.acceptedFiles]);
      }
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
            color={color ?? "error"}>
            <IntlMessages id={helperText} />
          </Typography>
        )}
      </Grid>
      <Grid item xs={appGridXs}>
        <AppList
          data={uploadedFiles}
          renderRow={(file: any, index: number) => (
            <FileRow
              key={index + file.path}
              file={file}
              onDeleteUploadFile={onDeleteUploadFile}
            />
          )}
        />
      </Grid>
    </>
  );
};

export default AppUploadDocument;
