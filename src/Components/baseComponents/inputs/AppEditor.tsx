import { FormHelperText, Typography } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import * as React from "react";
import { useIntl } from "react-intl";
import { tinykKey } from "src/@crema/constants/AppConst";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface IAppTextAreaFieldProps {
  label: string;
  name: string;
  error?: boolean;
  value: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const AppEditor: React.FC<IAppTextAreaFieldProps> = (props) => {
  const { label, name, setFieldValue, error, value } = props;
  const { messages, locale } = useIntl();
  return (
    <>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: Fonts.SEMI_BOLD,
          mb: 2,
        }}
      >
        <IntlMessages id={label} />
      </Typography>
      <Editor
        apiKey={tinykKey}
        // initialValue="<p>This is the initial content of the editor</p>"
        init={{
          //   skin: "oxide-dark",
          icons: "thin",
          //   content_css: "dark",
          placeholder: String(messages[label]),

          height: 200,
          directionality: locale == "en-US" ? "ltr" : "rtl",
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen textcolor",
            "insertdatetime media table paste code help wordcount",
            "lists",
          ],
          paste_data_images: false,
          textcolor_rows: "4",

          toolbar:
            "undo redo | formatselect | bold italic | \
                      alignleft aligncenter alignright | \
                      bullist numlist outdent indent | help",
        }}
        onEditorChange={(content: any, editor: any) => {
          setFieldValue(name, content);
        }}
        value={value}

        // toolbar="code"
      />
      {error && (
        <FormHelperText sx={{ color: "#d32f2f", margin: "4px 14px 0 14px" }}>
          <IntlMessages id={"validation.required"} />
        </FormHelperText>
      )}
    </>
  );
};

export default AppEditor;
