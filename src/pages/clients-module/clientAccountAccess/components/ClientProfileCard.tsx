/** @format */

import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { getSubscriptionStatusChipColor } from "../mapClientAccountData";
import { ClientAccountData } from "../types";

type Props = {
  client: ClientAccountData;
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    <Box sx={{ color: "primary.main", mt: 0.25 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

const ClientProfileCard = ({ client }: Props) => {
  const { messages } = useIntl();

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        border: (t) => `1px solid ${t.palette.divider}`,
        height: "100%",
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
        {messages["clientAccountAccess.clientProfile"] as string}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: "primary.main",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {client.fullName.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {client.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {client.customerId}
          </Typography>
          <Chip
            label={client.subscriptionStatus}
            size="small"
            color={getSubscriptionStatusChipColor(client.subscriptionStatus)}
            sx={{ mt: 1, fontWeight: 600 }}
          />
        </Box>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <InfoRow
            icon={<PersonIcon fontSize="small" />}
            label={messages["clientAccountAccess.fullName"] as string}
            value={client.fullName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow
            icon={<EmailIcon fontSize="small" />}
            label={messages["clientAccountAccess.email"] as string}
            value={client.email}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow
            icon={<PhoneIcon fontSize="small" />}
            label={messages["clientAccountAccess.phone"] as string}
            value={client.phone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow
            icon={<WcIcon fontSize="small" />}
            label={messages["clientAccountAccess.gender"] as string}
            value={client.gender}
          />
        </Grid>
        <Grid item xs={12}>
          <InfoRow
            icon={<LocationOnIcon fontSize="small" />}
            label={messages["clientAccountAccess.deliveryAddress"] as string}
            value={client.deliveryAddress}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow
            icon={<PersonIcon fontSize="small" />}
            label={
              messages["clientAccountAccess.subscriptionStart"] as string
            }
            value={
              client.subscriptionStartDate
                ? dayjs(client.subscriptionStartDate).format("MMM D, YYYY")
                : "—"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow
            icon={<PersonIcon fontSize="small" />}
            label={messages["clientAccountAccess.subscriptionEnd"] as string}
            value={
              client.subscriptionEndDate
                ? dayjs(client.subscriptionEndDate).format("MMM D, YYYY")
                : "—"
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientProfileCard;
