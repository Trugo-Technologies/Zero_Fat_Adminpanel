/** @format */

import { Box } from "@mui/material";
import * as React from "react";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface Props {
  title: string;
  endAdornment?: React.ReactNode;
}

const StatisticsBaseTitle: React.FC<Props> = (props) => {
  const { title, endAdornment } = props;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box
        component='h2'
        sx={{
          color: "text.primary",
          fontSize: 17,
          textTransform: "uppercase",
          mb: 0,
          fontWeight: Fonts.BOLD,
        }}>
        <IntlMessages id={title} />
      </Box>
      {endAdornment}
    </Box>
  );
};

export default StatisticsBaseTitle;
