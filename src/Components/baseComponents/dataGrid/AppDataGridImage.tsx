//                   <Avatar src={`${baseImageUrl}/${value}`}/>
import { Avatar } from "@mui/material";
import Image from "rc-image";
import React from "react";
import { baseImageUrl } from "src/env/base-url";
import CloseIcon from "@mui/icons-material/Close";

interface IAppImageTableCellProps {
  value: string;
  variant?: any;
  style?: React.CSSProperties;
}

const AppDataGridImage: React.FC<IAppImageTableCellProps> = (props) => {
  var arabic = /[\u0600-\u06FF]/;
  const {
    variant = "span",
    value,
    style = {
      textAlign: "center",
      direction: arabic.test(value) ? "rtl" : "ltr",
    },
  } = props;
  return (
    <>
      {value && (
        <Image
          preview={{
            closeIcon: <CloseIcon color="primary" />,
            // focusTriggerAfterClose: true,
            // maskClosable: true,
            // destroyOnClose: true,
            // forceRender: true,
          }}
          src={`${baseImageUrl}/${value}`}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
          // Enable zoom functionality
        />
      )}
    </>
  );

  // <Avatar src={`${baseImageUrl}/${value}`} />;
};

export default AppDataGridImage;
