/** @format */

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {
  alpha,
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { AccessStatus, ClientAccountData } from "../../types";

type Props = {
  client: ClientAccountData;
  onEdit: () => void;
  onSendNotification: () => void;
  onQuickBlock?: () => void; // Keeping prop optional to avoid breaking parent if it still passes it
};

const accessStatusConfig: Record<
  AccessStatus,
  { label: string; color: "success" | "error" | "warning" }
> = {
  Active: { label: "clientAccountAccess.status.active", color: "success" },
  Blocked: { label: "clientAccountAccess.status.blocked", color: "error" },
  TemporaryBlock: { label: "clientAccountAccess.status.tempBlocked", color: "warning" },
};

const ProfileHero = ({ client, onEdit, onSendNotification }: Props) => {
  const { messages } = useIntl();
  const access = accessStatusConfig[client.accessStatus];

  const subscriptionExpired =
    client.subscriptionStatus !== "Active" &&
    client.subscriptionStatus !== "Pending";

  const primaryStatus =
    client.accessStatus !== "Active"
      ? access
      : subscriptionExpired
        ? {
            label: "clientAccountAccess.status.expired",
            color: "warning" as const,
          }
        : access;

  return (
    <Box sx={{ pb: 4, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={4}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems={{ sm: "center" }}>
          <Avatar
            src={client.avatarUrl}
            sx={{
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              fontSize: { xs: 32, md: 40 },
              fontWeight: 800,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {client.fullName.charAt(0)}
          </Avatar>

          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: "text.primary",
                }}
              >
                {client.fullName}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: "text.secondary",
                letterSpacing: "0.02em",
              }}
            >
              #{client.customerId}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.75,
              borderRadius: "20px",
              bgcolor: (theme) => alpha(theme.palette[primaryStatus.color].main, 0.1),
              color: `${primaryStatus.color}.main`,
              border: (theme) => `1px solid ${alpha(theme.palette[primaryStatus.color].main, 0.2)}`,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "currentColor",
                boxShadow: "0 0 8px currentColor",
              }}
            />
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {messages[primaryStatus.label] as string}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Tooltip title={<IntlMessages id="clientAccountAccess.editClient" />}>
              <IconButton
                onClick={onEdit}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                  },
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={<IntlMessages id="clientAccountAccess.viewNotifications" />}>
              <IconButton
                onClick={onSendNotification}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                  color: "text.primary",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.text.primary, 0.08),
                  },
                }}
              >
                <NotificationsOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProfileHero;
