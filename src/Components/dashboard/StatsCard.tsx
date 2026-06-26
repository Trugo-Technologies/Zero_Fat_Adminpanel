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
      className='card-hover'
      contentStyle={{
        p: 0,
        "&:last-of-type": {
          pb: "0 !important",
        },
        mb: 0,
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 4,
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}>
          <Box
            component='span'
            sx={{
              mr: 3.5,
              height: 46,
              width: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color: data.color,
              backgroundColor: data.color + "22",
            }}>
            <Icon
              sx={{
                fontSize: 24,
              }}>
              {data.icon}
            </Icon>
          </Box>

          <Box sx={{ mr: 2, overflow: "hidden" }}>
            <Typography
              variant='h2'
              component='h2'
              sx={{
                fontWeight: Fonts.SEMI_BOLD,
                fontSize: 18,
              }}>
              {data.value}
            </Typography>
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 14,
                color: (theme) => theme.palette.text.secondary,
                mt: 0.5,
              }}>
              <IntlMessages id={data.name} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default StatsCard;
