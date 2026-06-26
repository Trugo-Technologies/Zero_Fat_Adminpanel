/** @format */

import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  alpha,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { AccessStatus, ClientAccountData } from "../types";
import ProfileInfoCard from "./profile/ProfileInfoCard";
import { cardTitle } from "./profile/profileTheme";

type Props = {
  client: ClientAccountData;
  onUnblock: () => void;
  onBlock: (type: "oneDay" | "custom" | "permanent", expiry?: Dayjs) => void;
};

type BlockOption = "oneDay" | "custom" | "permanent";

const blockOptions: { value: BlockOption; titleKey: string; descKey: string }[] = [
  {
    value: "oneDay",
    titleKey: "clientAccountAccess.block.oneDay",
    descKey: "clientAccountAccess.block.oneDayDesc",
  },
  {
    value: "custom",
    titleKey: "clientAccountAccess.block.custom",
    descKey: "clientAccountAccess.block.customDesc",
  },
  {
    value: "permanent",
    titleKey: "clientAccountAccess.block.permanent",
    descKey: "clientAccountAccess.block.permanentDesc",
  },
];

const statusLabel: Record<AccessStatus, string> = {
  Active: "clientAccountAccess.status.active",
  Blocked: "clientAccountAccess.status.blocked",
  TemporaryBlock: "clientAccountAccess.status.tempBlocked",
};

const statusColor: Record<AccessStatus, "success" | "error" | "warning"> = {
  Active: "success",
  Blocked: "error",
  TemporaryBlock: "warning",
};

const AccessControlCard = ({ client, onUnblock, onBlock }: Props) => {
  const { messages } = useIntl();
  const theme = useTheme();
  const [blockType, setBlockType] = useState<BlockOption>("oneDay");
  const [customDate, setCustomDate] = useState<Dayjs | null>(dayjs().add(1, "day"));

  const isActive = client.accessStatus === "Active";

  const handleBlock = () => {
    if (blockType === "custom") {
      onBlock("custom", customDate ?? undefined);
    } else {
      onBlock(blockType);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: "16px",
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.04)}, 0 1px 3px ${alpha(theme.palette.common.black, 0.02)}`,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2 }}>
        <IntlMessages id="clientAccountAccess.accessControl" />
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600 }}>
            <IntlMessages id="clientAccountAccess.currentStatus" />
          </Typography>
          <Chip
            label={messages[statusLabel[client.accessStatus]] as string}
            color={statusColor[client.accessStatus]}
            size="small"
            sx={{ width: "fit-content", fontWeight: 700, fontSize: 12, height: 24 }}
          />
        </Stack>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600, mb: 0.25 }}>
            <IntlMessages id="clientAccountAccess.lastLogin" />
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            {client.lastLoginDate
              ? dayjs(client.lastLoginDate).format("MMM D, YYYY")
              : "—"}
          </Typography>
        </Box>
      </Stack>

      {!isActive && client.blockExpiryDate && (
        <Typography sx={{ fontSize: 13, color: "warning.main", fontWeight: 600, mb: 2 }}>
          {messages["clientAccountAccess.blockExpiry"] as string}:{" "}
          {dayjs(client.blockExpiryDate).format("MMM D, YYYY · h:mm A")}
        </Typography>
      )}

      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600, mb: 1, textTransform: "uppercase" }}>
          <IntlMessages id="clientAccountAccess.blockOptions" />
        </Typography>

        <RadioGroup
          value={blockType}
          onChange={(e) => setBlockType(e.target.value as BlockOption)}
        >
          <Stack spacing={1}>
            {blockOptions.map((opt) => {
              const selected = blockType === opt.value;
              return (
                <Box
                  key={opt.value}
                  onClick={() => setBlockType(opt.value)}
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    border: `1px solid ${
                      selected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.4)
                    }`,
                    bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                    }
                  }}
                >
                  <FormControlLabel
                    value={opt.value}
                    control={<Radio size="small" />}
                    label={
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                          {messages[opt.titleKey] as string}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                          {messages[opt.descKey] as string}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, alignItems: "flex-start" }}
                  />
                </Box>
              );
            })}
          </Stack>
        </RadioGroup>
      </Box>

      {blockType === "custom" && (
        <Box sx={{ mb: 2.5 }}>
          <DateTimePicker
            label={messages["clientAccountAccess.blockDateTime"] as string}
            value={customDate}
            onChange={setCustomDate}
            slotProps={{ textField: { fullWidth: true, size: "small" } }}
          />
        </Box>
      )}

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          color="error"
          startIcon={<BlockIcon />}
          onClick={handleBlock}
          disabled={!isActive && blockType === "permanent"}
          fullWidth
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", boxShadow: "none" }}
        >
          <IntlMessages id="clientAccountAccess.blockClient" />
        </Button>
        <Button
          variant="outlined"
          color="success"
          startIcon={<LockOpenIcon />}
          onClick={onUnblock}
          disabled={isActive}
          fullWidth
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
        >
          <IntlMessages id="clientAccountAccess.unblockClient" />
        </Button>
      </Stack>
    </Box>
  );
};

export default AccessControlCard;
