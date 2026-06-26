/** @format */

import { alpha, Box, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";

type Props = {
  current: number;
  target: number;
};

const WeightProgress = ({ current, target }: Props) => {
  const theme = useTheme();
  const { messages } = useIntl();

  const delta = current - target;
  const totalRange = Math.max(Math.abs(delta) * 2, 1);
  const progress = Math.min(100, Math.max(8, Math.round((1 - Math.abs(delta) / totalRange) * 100)));

  return (
    <Box
      sx={{
        mt: 1,
        p: 2.5,
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(
          theme.palette.primary.main,
          0.08
        )})`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: `inset 0 2px 4px ${alpha(theme.palette.common.white, 0.4)}`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.secondary" }}>
          <IntlMessages id="clientAccountAccess.weightProgress" />
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "primary.main" }}>
          {progress}%
        </Typography>
      </Stack>

      <Box sx={{ position: "relative", mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: -4,
            bottom: -4,
            left: `${progress}%`,
            width: 4,
            borderRadius: 2,
            bgcolor: "primary.main",
            boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`,
            transform: "translateX(-50%)",
            transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </Box>

      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600 }}>
            {messages["clientAccountAccess.currentWeight"] as string}
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{current} <Typography component="span" sx={{ fontSize: 13, color: "text.secondary", fontWeight: 600 }}>kg</Typography></Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600 }}>
            {messages["clientAccountAccess.targetWeight"] as string}
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: "primary.main" }}>
            {target} <Typography component="span" sx={{ fontSize: 13, color: "primary.light", fontWeight: 600 }}>kg</Typography>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default WeightProgress;
