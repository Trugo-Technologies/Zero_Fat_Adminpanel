/** @format */

import { Box } from "@mui/material";
import * as React from "react";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface Props {
  title: string;
}

const StatisticsBaseTitle: React.FC<Props> = (props) => {
  const { title } = props;

  return (
    <Box
      component='h2'
      sx={{
        color: "text.primary",
        fontSize: 17,
        textTransform: "uppercase",
        mb: 4,
        fontWeight: Fonts.BOLD,
      }}>
      <IntlMessages id={title} />
    </Box>
  );
};

export default StatisticsBaseTitle;
