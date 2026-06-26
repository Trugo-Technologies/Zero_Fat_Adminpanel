/** @format */

import React, { ReactNode } from "react";
import ListItem from "@mui/material/ListItem";
import { Fonts } from "@crema/constants/AppEnums";
import { alpha } from "@mui/material";

type VerticalNavGroupItemProps = {
  children: ReactNode;
  sidebarTextColor: string;
  level: number;

  [x: string]: any;
};

const VerticalNavGroupItem: React.FC<VerticalNavGroupItemProps> = ({
  children,
  sidebarTextColor,
  level,
  ...rest
}) => {
  return (
    <ListItem
      sx={{
        height: 40,
        my: 0.25,
        pl: 31 + 33 * level - 15 + "px",
        pr: 3,
        color: "#000",
        fontWeight: Fonts.BOLD,
        fontSize: 16,
        cursor: "pointer",
        textDecoration: "none!important",
        whiteSpace: "nowrap",
        transition: "all 0.4s ease",
        // borderTop: "1px solid #a5d060",
        // borderBottom: "1px solid #a5d060",
        "&.nav-item-header": {
          cursor: "auto",
          transition: "all 0.4s ease",
        },
      }}
      {...rest}>
      {children}
    </ListItem>
  );
};

export default VerticalNavGroupItem;
