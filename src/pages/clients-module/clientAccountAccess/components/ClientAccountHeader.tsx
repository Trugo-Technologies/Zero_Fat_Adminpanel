/** @format */

import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { getSubscriptionStatusChipColor } from "../mapClientAccountData";
import { ClientAccountData } from "../types";

type Props = {
  client: ClientAccountData;
  onEdit: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onNotify: () => void;
};

const ClientAccountHeader = ({
  client,
  onEdit,
  onBlock,
  onUnblock,
  onNotify,
}: Props) => {
  const { messages } = useIntl();
  const isBlocked = client.accessStatus !== "Active";

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        border: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
            {client.fullName}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Typography variant="body2" color="text.secondary">
              {messages["clientAccountAccess.customerId"] as string}:{" "}
              <strong>{client.customerId}</strong>
            </Typography>
            <Chip
              label={client.subscriptionStatus}
              size="small"
              color={getSubscriptionStatusChipColor(client.subscriptionStatus)}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={onEdit}
            sx={{ borderRadius: 2 }}
          >
            {messages["clientAccountAccess.editClient"] as string}
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<BlockIcon />}
            onClick={onBlock}
            disabled={isBlocked}
            sx={{ borderRadius: 2 }}
          >
            {messages["clientAccountAccess.blockClient"] as string}
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<LockOpenIcon />}
            onClick={onUnblock}
            disabled={!isBlocked}
            sx={{ borderRadius: 2 }}
          >
            {messages["clientAccountAccess.unblockClient"] as string}
          </Button>
          <Button
            variant="contained"
            startIcon={<NotificationsActiveIcon />}
            onClick={onNotify}
            sx={{ borderRadius: 2 }}
          >
            {messages["clientAccountAccess.sendNotification"] as string}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ClientAccountHeader;
