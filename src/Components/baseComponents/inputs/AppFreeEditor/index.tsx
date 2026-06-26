/** @format */

import { FormHelperText, Typography } from "@mui/material";
import Editor from "react-simple-wysiwyg";
import * as React from "react";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { useField } from "formik";

interface IProps {
  label: string;
  name: string;
}

const AppFreeEditor: React.FC<IProps> = (props) => {
  const { label, name } = props;
  const [_, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: Fonts.SEMI_BOLD,
          mb: 2,
        }}>
        <IntlMessages id={label} />
      </Typography>
      <div className='editor-content'>
        <Editor
          value={meta?.value || ""}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {errorText ? (
        <FormHelperText sx={{ color: "#d32f2f", margin: "4px 14px 0 14px" }}>
          <IntlMessages id={"validation.required"} />
        </FormHelperText>
      ) : null}
    </>
  );
};

export default AppFreeEditor;
