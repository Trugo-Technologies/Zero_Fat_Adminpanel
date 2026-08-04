/** @format */

import { Box, Icon, Typography } from "@mui/material";
import { Fonts } from "@crema/constants/AppEnums";
import AppCard from "@crema/components/AppCard";
import { StateCardType } from "src/types/modules/dashboard";
import IntlMessages from "src/@crema/helpers/IntlMessages";

type Props = {
  data: StateCardType;
};

const StatsCard = ({ data }: Props) => {
  return (
    <AppCard
      className="card-hover"
      contentStyle={{
        p: 0,
        "&:last-of-type": {
          pb: "0 !important",
        },
        mb: 0,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          padding: 2.5,
          minHeight: 96,
          height: "100%",
        }}
      >
        <Box
          component="span"
          sx={{
            flexShrink: 0,
            height: 40,
            width: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            color: data.color,
            backgroundColor: data.color + "22",
          }}
        >
          <Icon sx={{ fontSize: 22 }}>{data.icon}</Icon>
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: Fonts.SEMI_BOLD,
              fontSize: 18,
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            {data.value}
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              lineHeight: 1.35,
              color: (theme) => theme.palette.text.secondary,
              mt: 0.75,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {data.label ?? <IntlMessages id={data.name} />}
          </Typography>
        </Box>
      </Box>
    </AppCard>
  );
};

export default StatsCard;
