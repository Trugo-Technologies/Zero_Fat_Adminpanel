/** @format */

import { alpha, Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
};

const ProfileInfoCard = ({ title, children, action, icon }: Props) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "16px",
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        boxShadow: (theme) => 
          `0 2px 12px ${alpha(theme.palette.common.black, 0.04)}, 0 1px 3px ${alpha(theme.palette.common.black, 0.02)}`,
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 800,
            color: "primary.main",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {icon && (
            <Box sx={{ display: "flex", alignItems: "center", "& svg": { fontSize: 18 } }}>
              {icon}
            </Box>
          )}
          {title}
        </Typography>
        {action}
      </Box>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
};

export default ProfileInfoCard;
