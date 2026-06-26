/** @format */

import AppCard from "@crema/components/AppCard";
import { Box, Icon } from "@mui/material";
import { Fonts } from "@crema/constants/AppEnums";
import { InfoWidgetType } from "src/types/modules/dashboard";
import IntlMessages from "src/@crema/helpers/IntlMessages";

type Props = {
  data: InfoWidgetType;
};
const InfoWidget = ({ data }: Props) => {
  return (
    <AppCard sxStyle={{ height: 1 }} contentStyle={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 2,
        }}>
        <Box
          sx={{
            mb: 4,
            width: { xs: 50, md: 60, xl: 75 },
            height: { xs: 50, md: 60, xl: 75 },
            bgcolor: "red",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: data.color,
            backgroundColor: data.color + "22",
          }}>
          {/* <Icon
            sx={{
              fontSize: 50,
            }}>
          </Icon> */}
          {data.icon}
        </Box>
        <Box
          sx={{
            textAlign: "center",
          }}>
          <Box
            component='h3'
            sx={{
              color: "text.primary",
              fontWeight: Fonts.MEDIUM,
              fontSize: 18,
            }}>
            {data.count}
          </Box>
          <Box
            component='p'
            sx={{
              color: "text.secondary",
            }}>
            <IntlMessages id={data.title} />
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default InfoWidget;
