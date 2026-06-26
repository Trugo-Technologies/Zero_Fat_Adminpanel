import { Typography } from "@mui/material";
import * as React from "react";

interface IAppDataTableCellProps {
  value: React.ReactNode;
  variant?: any;
  style?: React.CSSProperties;
}

const AppDataGridCell: React.FC<IAppDataTableCellProps> = (props) => {
  var arabic = /[\u0600-\u06FF]/;
  const {
    variant = "span",
    value,
    style = {
      textAlign: "center",
      direction: arabic.test(typeof value == "string" ? value : "")
        ? "rtl"
        : "ltr",
    },
  } = props;

  return (
    <Typography noWrap={true} variant={variant} style={style}>
      {value ? value : "-"}
    </Typography>
  );
};

export default AppDataGridCell;
